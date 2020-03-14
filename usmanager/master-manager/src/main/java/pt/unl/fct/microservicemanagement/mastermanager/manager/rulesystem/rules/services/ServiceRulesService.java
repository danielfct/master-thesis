package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.services;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.ContainerEvent;
import pt.unl.fct.microservicemanagement.mastermanager.manager.operators.Operator;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.Condition;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.ServiceDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.RuleDecision;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.DroolsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.Rule;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.RulesProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.apps.AppRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.apps.AppRulesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ServiceRulesService {

  private final AppRulesService appRulesService;
  private final DroolsService droolsService;
  private final ConditionsService conditionsService;

  private final ServiceRuleRepository rules;

  private final String serviceRuleTemplateFile;
  private final AtomicLong lastUpdateServiceRules;

  public ServiceRulesService(AppRulesService appRulesService, DroolsService droolsService,
                             ConditionsService conditionsService, ServiceRuleRepository rules,
                             RulesProperties rulesProperties) {
    this.appRulesService = appRulesService;
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

  public Iterable<ServiceRuleEntity> getRules() {
    return rules.findAll();
  }

  public List<ServiceRuleEntity> getRulesByServiceName(String serviceName) {
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
    var rule = getRule(ruleName);
    log.debug("Updating rule {} with {}",
        ToStringBuilder.reflectionToString(rule), ToStringBuilder.reflectionToString(newRule));
    log.debug("Rule before copying properties: {}",
        ToStringBuilder.reflectionToString(rule));
    ObjectUtils.copyValidProperties(newRule, rule);
    log.debug("Rule after copying properties: {}",
        ToStringBuilder.reflectionToString(rule));
    rule = rules.save(rule);
    setLastUpdateServiceRules();
    return rule;
  }

  public void deleteRule(String ruleName) {
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
    var rule = getRule(ruleName);
    var condition = conditionsService.getCondition(conditionName);
    var ruleCondition = ServiceRuleConditionEntity.builder()
        .serviceRule(rule)
        .serviceCondition(condition)
        .build();
    rule = rule.toBuilder().condition(ruleCondition).build();
    rules.save(rule);
    setLastUpdateServiceRules();
  }

  public void addConditions(String ruleName, List<String> conditionNames) {
    conditionNames.forEach(conditionName -> addCondition(ruleName, conditionName));
  }

  public void removeCondition(String ruleName, String conditionName) {
    removeConditions(ruleName, List.of(conditionName));
  }

  public void removeConditions(String ruleName, List<String> conditionNames) {
    var rule = getRule(ruleName);
    log.info("Removing conditions {}", conditionNames);
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
    final var serviceName = containerEvent.getServiceName();
    if (droolsService.shouldCreateNewRuleSession(serviceName, lastUpdateServiceRules.get())
        || droolsService.shouldCreateNewRuleSession(serviceName, appRulesService.getLastUpdateAppRules().get())) {
      List<Rule> rules = generateServiceRules(appName, serviceName);
      Map<Long, String> drools = droolsService.executeDroolsRules(containerEvent, rules, serviceRuleTemplateFile);
      droolsService.createNewServiceRuleSession(serviceName, drools);
    }
    return droolsService.evaluate(serviceHostname, containerEvent);
  }

  private List<Rule> generateServiceRules(String appName, String serviceName) {
    List<AppRuleEntity> appRules = appRulesService.getRulesByAppName(appName);
    List<ServiceRuleEntity> genericServiceRules = getGenericServiceRules();
    List<ServiceRuleEntity> serviceRules = getRulesByServiceName(serviceName);
    List<Rule> rules = new ArrayList<>(appRules.size() + genericServiceRules.size() + serviceRules.size());
    log.info("Generating app rules... (count: {})", appRules.size());
    appRules.forEach(appRule -> rules.add(generateAppRule(appRule)));
    log.info("Generating generic service rules... (count: {})", genericServiceRules.size());
    genericServiceRules.forEach(genericServiceRule -> rules.add(generateServiceRule(genericServiceRule)));
    log.info("Generating service rules... (count: {})", serviceRules.size());
    serviceRules.forEach(serviceRule -> rules.add(generateServiceRule(serviceRule)));
    return rules;
  }

  //TODO merge 2 methods after doing inheritance from RuleEntity

  private Rule generateAppRule(AppRuleEntity appRule) {
    Long id = appRule.getId();
    List<Condition> conditions = getConditions(appRule.getName()).stream().map(condition -> {
      String fieldName = String.format("%s-%S", condition.getField().getName(),
          condition.getValueMode().getName());
      double value = condition.getValue();
      Operator operator = Operator.fromValue(condition.getOperator().getName());
      return new Condition(fieldName, value, operator);
    }).collect(Collectors.toList());
    RuleDecision decision = RuleDecision.fromValue(appRule.getDecision().getName());
    int priority = appRule.getPriority();
    return new Rule(id, conditions, decision, priority);
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
