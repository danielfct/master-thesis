package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.apps;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AppRulesService {

  private final ConditionsService conditionsService;
  private final AppRuleRepository rules;
  private final AtomicLong lastUpdateAppRules;
  
  public AppRulesService(ConditionsService conditionsService, AppRuleRepository rules) {
    this.conditionsService = conditionsService;
    this.rules = rules;
    this.lastUpdateAppRules = new AtomicLong(0);
  }

  public void setLastUpdateAppRules() {
    long currentTime = System.currentTimeMillis();
    lastUpdateAppRules.getAndSet(currentTime);
  }

  public AtomicLong getLastUpdateAppRules() {
    return this.lastUpdateAppRules;
  }
  
  public Iterable<AppRuleEntity> getRules() {
    return rules.findAll();
  }

  public List<AppRuleEntity> getRulesByAppName(String appName) {
    return rules.getRulesByAppName(appName);
  }

  public AppRuleEntity getRule(Long id) {
    return rules.findById(id).orElseThrow(() ->
        new EntityNotFoundException(AppRuleEntity.class, "id", id.toString()));
  }

  public AppRuleEntity getRule(String name) {
    return rules.findByNameIgnoreCase(name).orElseThrow(() ->
        new EntityNotFoundException(AppRuleEntity.class, "name", name));
  }

  public AppRuleEntity addRule(AppRuleEntity rule) {
    log.debug("Saving rule {}", ToStringBuilder.reflectionToString(rule));
    AppRuleEntity persistedRule = rules.save(rule);
    setLastUpdateAppRules();
    return persistedRule;
  }

  public AppRuleEntity updateRule(String ruleName, AppRuleEntity newRule) {
    AppRuleEntity rule = getRule(ruleName);
    log.debug("Updating rule {} with {}",
        ToStringBuilder.reflectionToString(rule), ToStringBuilder.reflectionToString(newRule));
    log.debug("Rule before copying properties: {}",
        ToStringBuilder.reflectionToString(rule));
    ObjectUtils.copyValidProperties(newRule, rule);
    log.debug("Rule after copying properties: {}",
        ToStringBuilder.reflectionToString(rule));
    rule = rules.save(rule);
    setLastUpdateAppRules();
    return rule;
  }

  public void deleteRule(String ruleName) {
    AppRuleEntity rule = getRule(ruleName);
    rules.delete(rule);
    setLastUpdateAppRules();
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
    AppRuleEntity rule = getRule(ruleName);
    var condition = conditionsService.getCondition(conditionName);
    AppRuleConditionEntity ruleCondition = AppRuleConditionEntity.builder()
        .appRule(rule)
        .appCondition(condition)
        .build();
    rule = rule.toBuilder().condition(ruleCondition).build();
    rules.save(rule);
    setLastUpdateAppRules();
  }

  public void addConditions(String ruleName, List<String> conditionNames) {
    conditionNames.forEach(conditionName -> addCondition(ruleName, conditionName));
  }

  public void removeCondition(String ruleName, String conditionName) {
    removeConditions(ruleName, List.of(conditionName));
  }

  public void removeConditions(String ruleName, List<String> conditionNames) {
    AppRuleEntity rule = getRule(ruleName);
    log.info("Removing conditions {}", conditionNames);
    rule.getConditions()
        .removeIf(condition -> conditionNames.contains(condition.getAppCondition().getName()));
    rules.save(rule);
    setLastUpdateAppRules();
  }

  private void assertRuleExists(String ruleName) {
    if (!rules.hasRule(ruleName)) {
      throw new EntityNotFoundException(ServiceEntity.class, "ruleName", ruleName);
    }
  }

}
