package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.services;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.ContainerEvent;
import pt.unl.fct.microservicemanagement.mastermanager.manager.operators.Operator;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.Condition;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.ServiceDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.DroolsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.Rule;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.RuleDecision;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.RulesProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ServiceRulesService {

  private final DecisionsService decisionsService;
  private final DroolsService droolsService;
  private final ConditionsService conditionsService;

  private final ServiceRuleRepository rules;

  private final String serviceRuleTemplateFile;
  private final AtomicLong lastUpdateServiceRules;

  public ServiceRulesService(@Lazy DecisionsService decisionsService, DroolsService droolsService,
                             ConditionsService conditionsService, ServiceRuleRepository rules,
                             RulesProperties rulesProperties) {
    this.decisionsService = decisionsService;
    this.droolsService = droolsService;
    this.conditionsService = conditionsService;
    this.rules = rules;
    this.serviceRuleTemplateFile = rulesProperties.getServiceRuleTemplateFile();
    this.lastUpdateServiceRules = new AtomicLong(0);
  }

  public void setLastUpdateServiceRules() {
    long currentTime = System.currentTimeMillis();
    lastUpdateServiceRules.getAndSet(currentTime);
  }

  public Iterable<ServiceRuleEntity> getServiceRules() {
    return rules.findAll();
  }

  public List<ServiceRuleEntity> getServiceRules(String serviceName) {
    return rules.getRulesByServiceName(serviceName);
  }

  public List<ServiceRuleEntity> getGenericServiceRules() {
    return rules.findGenericServiceRules();
  }

  public ServiceRuleEntity getRule(Long id) {
    return rules.findById(id).orElseThrow(() ->
        new EntityNotFoundException(ServiceRuleEntity.class, "id", id.toString()));
  }

  public ServiceRuleEntity getRule(String name) {
    return rules.findByNameIgnoreCase(name).orElseThrow(() ->
        new EntityNotFoundException(ServiceRuleEntity.class, "name", name));
  }

  public ServiceRuleEntity addRule(ServiceRuleEntity rule) {
    log.debug("Saving rule {}", ToStringBuilder.reflectionToString(rule));
    setLastUpdateServiceRules();
    return rules.save(rule);
  }

  public ServiceRuleEntity updateRule(String ruleName, ServiceRuleEntity newRule) {
    log.debug("Updating rule {} with {}", ruleName, ToStringBuilder.reflectionToString(newRule));
    ServiceRuleEntity rule = getRule(ruleName);
    ObjectUtils.copyValidProperties(newRule, rule);
    rule = rules.save(rule);
    setLastUpdateServiceRules();
    return rule;
  }

  public void deleteRule(String ruleName) {
    log.debug("Deleting rule {}", ruleName);
    var rule = getRule(ruleName);
    rules.delete(rule);
    setLastUpdateServiceRules();
  }

  public ConditionEntity getCondition(String ruleName, String conditionName) {
    assertRuleExists(ruleName);
    return rules.getCondition(ruleName, conditionName).orElseThrow(() ->
        new EntityNotFoundException(ConditionEntity.class, "conditionName", conditionName));
  }

  public List<ConditionEntity> getConditions(String ruleName) {
    assertRuleExists(ruleName);
    return rules.getConditions(ruleName);
  }

  public void addCondition(String ruleName, String conditionName) {
    log.debug("Adding condition {} to rule {}", conditionName, ruleName);
    ConditionEntity condition = conditionsService.getCondition(conditionName);
    ServiceRuleEntity rule = getRule(ruleName);
    ServiceRuleConditionEntity hostRuleCondition =
        ServiceRuleConditionEntity.builder().serviceCondition(condition).serviceRule(rule).build();
    rule = rule.toBuilder().condition(hostRuleCondition).build();
    rules.save(rule);
    setLastUpdateServiceRules();
  }

  public void addConditions(String ruleName, List<String> conditions) {
    conditions.forEach(condition -> addCondition(ruleName, condition));
  }

  public void removeCondition(String ruleName, String conditionName) {
    removeConditions(ruleName, List.of(conditionName));
  }

  public void removeConditions(String ruleName, List<String> conditionNames) {
    log.info("Removing conditions {}", conditionNames);
    var rule = getRule(ruleName);
    rule.getConditions()
        .removeIf(condition -> conditionNames.contains(condition.getServiceCondition().getName()));
    rules.save(rule);
    setLastUpdateServiceRules();
  }

  private void assertRuleExists(String ruleName) {
    if (!rules.hasRule(ruleName)) {
      throw new EntityNotFoundException(ServiceEntity.class, "ruleName", ruleName);
    }
  }

  public ServiceDecisionResult processServiceEvent(String appName, String serviceHostname,
                                                   ContainerEvent containerEvent) {
    //FIXME: appName and serviceHostname
    String serviceName = containerEvent.getServiceName();
    if (droolsService.shouldCreateNewRuleSession(serviceName, lastUpdateServiceRules.get())) {
      List<Rule> rules = generateServiceRules(appName, serviceName);
      Map<Long, String> drools = droolsService.executeDroolsRules(containerEvent, rules, serviceRuleTemplateFile);
      droolsService.createNewServiceRuleSession(serviceName, drools);
    }
    return droolsService.evaluate(serviceHostname, containerEvent);
  }

  private List<Rule> generateServiceRules(String appName, String serviceName) {
    List<ServiceRuleEntity> genericServiceRules = getGenericServiceRules();
    List<ServiceRuleEntity> serviceRules = getServiceRules(serviceName);
    var rules = new ArrayList<Rule>(genericServiceRules.size() + serviceRules.size());
    log.info("Generating service rules... (count: {})", rules.size());
    genericServiceRules.forEach(genericServiceRule -> rules.add(generateServiceRule(genericServiceRule)));
    serviceRules.forEach(serviceRule -> rules.add(generateServiceRule(serviceRule)));
    return rules;
  }

  private Rule generateServiceRule(ServiceRuleEntity serviceRule) {
    Long id = serviceRule.getId();
    List<Condition> conditions = getConditions(serviceRule.getName()).stream().map(condition -> {
      String fieldName = String.format("%s-%S", condition.getField().getName(),
          condition.getValueMode().getName());
      double value = condition.getValue();
      Operator operator = Operator.fromValue(condition.getOperator().getName());
      return new Condition(fieldName, value, operator);
    }).collect(Collectors.toList());
    RuleDecision decision = RuleDecision.fromValue(serviceRule.getDecision().getName());
    int priority = serviceRule.getPriority();
    return new Rule(id, conditions, decision, priority);
  }

  
}
