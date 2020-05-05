package pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.hosts;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud.CloudHostEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud.CloudHostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.edge.EdgeHostEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.edge.EdgeHostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.HostEvent;
import pt.unl.fct.microservicemanagement.mastermanager.manager.operators.Operator;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.condition.Condition;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.condition.ConditionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.decision.HostDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.DroolsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.Rule;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.RuleDecision;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.RulesProperties;
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
public class HostRulesService {

  private final ConditionsService conditionsService;
  private final CloudHostsService cloudHostsService;
  private final EdgeHostsService edgeHostsService;
  private final DroolsService droolsService;

  private final HostRuleRepository rules;

  private final String hostRuleTemplateFile;
  private final AtomicLong lastUpdateHostRules;

  public HostRulesService(ConditionsService conditionsService, CloudHostsService cloudHostsService,
                          EdgeHostsService edgeHostsService, DroolsService droolsService, HostRuleRepository rules,
                          RulesProperties rulesProperties) {
    this.conditionsService = conditionsService;
    this.cloudHostsService = cloudHostsService;
    this.edgeHostsService = edgeHostsService;
    this.droolsService = droolsService;
    this.rules = rules;
    this.hostRuleTemplateFile = rulesProperties.getHostRuleTemplateFile();
    this.lastUpdateHostRules = new AtomicLong(0);
  }

  public void setLastUpdateHostRules() {
    long currentTime = System.currentTimeMillis();
    lastUpdateHostRules.getAndSet(currentTime);
  }

  public Iterable<HostRuleEntity> getHostRules() {
    return rules.findAll();
  }

  public List<HostRuleEntity> getRules(String hostname) {
    return rules.findByEdgeHostname(hostname);
  }

  public HostRuleEntity getRule(Long id) {
    return rules.findById(id).orElseThrow(() ->
        new EntityNotFoundException(HostRuleEntity.class, "id", id.toString()));
  }

  public HostRuleEntity getRule(String name) {
    return rules.findByNameIgnoreCase(name).orElseThrow(() ->
        new EntityNotFoundException(HostRuleEntity.class, "name", name));
  }

  public HostRuleEntity getHostRule(String name) {
    return rules.findHostRule(name).orElseThrow(() ->
        new EntityNotFoundException(HostRuleEntity.class, "name", name));
  }

  public HostRuleEntity addRule(HostRuleEntity rule) {
    log.debug("Saving rule {}", ToStringBuilder.reflectionToString(rule));
    setLastUpdateHostRules();
    return rules.save(rule);
  }

  public HostRuleEntity updateRule(String ruleName, HostRuleEntity newRule) {
    log.debug("Updating rule {} with {}", ruleName, ToStringBuilder.reflectionToString(newRule));
    HostRuleEntity rule = getRule(ruleName);
    ObjectUtils.copyValidProperties(newRule, rule);
    rule = rules.save(rule);
    setLastUpdateHostRules();
    return rule;
  }

  public void deleteRule(String ruleName) {
    log.debug("Deleting rule {}", ruleName);
    HostRuleEntity rule = getRule(ruleName);
    rules.delete(rule);
    setLastUpdateHostRules();
  }

  public List<HostRuleEntity> getGenericHostRules() {
    return rules.findGenericHostRules();
  }

  public HostRuleEntity getGenericHostRule(String ruleName) {
    return rules.findGenericHostRule(ruleName).orElseThrow(() ->
        new EntityNotFoundException(HostRuleEntity.class, "ruleName", ruleName));
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
    HostRuleEntity rule = getRule(ruleName);
    HostRuleConditionEntity hostRuleCondition =
        HostRuleConditionEntity.builder().hostCondition(condition).hostRule(rule).build();
    rule = rule.toBuilder().condition(hostRuleCondition).build();
    rules.save(rule);
    setLastUpdateHostRules();
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
        .removeIf(condition -> conditionNames.contains(condition.getHostCondition().getName()));
    rules.save(rule);
    setLastUpdateHostRules();
  }

  public CloudHostEntity getCloudHost(String ruleName, String instanceId) {
    assertRuleExists(ruleName);
    return rules.getCloudHost(ruleName, instanceId).orElseThrow(() ->
        new EntityNotFoundException(ConditionEntity.class, "instanceId", instanceId));
  }

  public List<CloudHostEntity> getCloudHosts(String ruleName) {
    assertRuleExists(ruleName);
    return rules.getCloudHosts(ruleName);
  }

  public void addCloudHost(String ruleName, String instanceId) {
    log.debug("Adding cloud host {} to rule {}", instanceId, ruleName);
    CloudHostEntity cloudHost = cloudHostsService.getCloudHost(instanceId);
    HostRuleEntity rule = getRule(ruleName);
    rule = rule.toBuilder().cloudHost(cloudHost).build();
    rules.save(rule);
    setLastUpdateHostRules();
  }

  public void addCloudHosts(String ruleName, List<String> instanceIds) {
    instanceIds.forEach(instanceId -> addCloudHost(ruleName, instanceId));
  }

  public void removeCloudHost(String ruleName, String instanceId) {
    removeCloudHosts(ruleName, List.of(instanceId));
  }

  public void removeCloudHosts(String ruleName, List<String> instanceIds) {
    log.info("Removing cloud hosts {}", instanceIds);
    var rule = getRule(ruleName);
    rule.getCloudHosts()
        .removeIf(cloudHost -> instanceIds.contains(cloudHost.getInstanceId()));
    rules.save(rule);
    setLastUpdateHostRules();
  }

  public EdgeHostEntity getEdgeHost(String ruleName, String hostname) {
    assertRuleExists(ruleName);
    return rules.getEdgeHost(ruleName, hostname).orElseThrow(() ->
        new EntityNotFoundException(ConditionEntity.class, "hostname", hostname));
  }

  public List<EdgeHostEntity> getEdgeHosts(String ruleName) {
    assertRuleExists(ruleName);
    return rules.getEdgeHosts(ruleName);
  }

  public void addEdgeHost(String ruleName, String hostname) {
    log.debug("Adding edge host {} to rule {}", hostname, ruleName);
    EdgeHostEntity edgeHost = edgeHostsService.getEdgeHost(hostname);
    HostRuleEntity rule = getRule(ruleName);
    rule = rule.toBuilder().edgeHost(edgeHost).build();
    rules.save(rule);
    setLastUpdateHostRules();
  }

  public void addEdgeHosts(String ruleName, List<String> hostnames) {
    hostnames.forEach(hostname -> addEdgeHost(ruleName, hostname));
  }

  public void removeEdgeHost(String ruleName, String hostname) {
    removeEdgeHosts(ruleName, List.of(hostname));
  }

  public void removeEdgeHosts(String ruleName, List<String> hostnames) {
    log.info("Removing edge hosts {}", hostnames);
    var rule = getRule(ruleName);
    rule.getEdgeHosts()
        .removeIf(edgeHost -> hostnames.contains(edgeHost.getHostname()));
    rules.save(rule);
    setLastUpdateHostRules();
  }

  private void assertRuleExists(String ruleName) {
    if (!rules.hasRule(ruleName)) {
      throw new EntityNotFoundException(HostRuleEntity.class, "ruleName", ruleName);
    }
  }

  public HostDecisionResult processHostEvent(String hostname, HostEvent hostEvent) {
    if (droolsService.shouldCreateNewRuleSession(hostname, lastUpdateHostRules.get())) {
      List<Rule> rules = generateHostRules(hostname);
      Map<Long, String> drools = droolsService.executeDroolsRules(hostEvent, rules, hostRuleTemplateFile);
      droolsService.createNewHostRuleSession(hostname, drools);
    }
    return droolsService.evaluate(hostEvent);
  }

  private List<Rule> generateHostRules(String hostname) {
    //FIXME what about cloud hosts?
    List<HostRuleEntity> hostRules = getRules(hostname);
    var rules = new ArrayList<Rule>(hostRules.size());
    log.info("Generating host rules... (count: {})", rules.size());
    hostRules.forEach(hostRule -> rules.add(generateRule(hostRule)));
    return rules;
  }

  private Rule generateRule(HostRuleEntity hostRule) {
    Long id = hostRule.getId();
    List<Condition> conditions = getConditions(hostRule.getName()).stream().map(condition -> {
      String fieldName = String.format("%s-%S", condition.getField().getName(),
          condition.getValueMode().getName());
      double value = condition.getValue();
      Operator operator = Operator.fromValue(condition.getOperator().getName());
      return new Condition(fieldName, value, operator);
    }).collect(Collectors.toList());
    RuleDecision decision = RuleDecision.fromValue(hostRule.getDecision().getName());
    int priority = hostRule.getPriority();
    return new Rule(id, conditions, decision, priority);
  }




}
