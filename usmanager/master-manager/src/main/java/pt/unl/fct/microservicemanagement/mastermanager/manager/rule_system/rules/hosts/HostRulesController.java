package pt.unl.fct.microservicemanagement.mastermanager.manager.rule_system.rules.hosts;

import pt.unl.fct.microservicemanagement.mastermanager.manager.rule_system.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.util.Validation;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rules")
public class HostRulesController {
  
  private final HostRulesService hostRulesService;

  public HostRulesController(HostRulesService appRulesService) {
    this.hostRulesService = appRulesService;
  }

  @GetMapping("/hosts")
  public Iterable<HostRuleEntity> getHostRules() {
    return hostRulesService.getHostRules();
  }

  @GetMapping("/hosts/{ruleName}")
  public HostRuleEntity getHostRule(@PathVariable String ruleName) {
    return hostRulesService.getHostRule(ruleName);
  }

  @PostMapping("/hosts")
  public HostRuleEntity addRule(@RequestBody HostRuleEntity rule) {
    Validation.validatePostRequest(rule.getId());
    return hostRulesService.addRule(rule);
  }

  @PutMapping("/hosts/{ruleName}")
  public HostRuleEntity updateRule(@PathVariable String ruleName, @RequestBody HostRuleEntity rule) {
    Validation.validatePutRequest(rule.getId());
    return hostRulesService.updateRule(ruleName, rule);
  }

  @DeleteMapping("/hosts/{ruleName}")
  public void deleteRule(@PathVariable String ruleName) {
    hostRulesService.deleteRule(ruleName);
  }

  @GetMapping("/generic/hosts")
  public List<HostRuleEntity> getGenericRules() {
    return hostRulesService.getGenericHostRules();
  }

  @GetMapping("/generic/hosts/{ruleName}")
  public HostRuleEntity getGenericRule(@PathVariable String ruleName) {
    return hostRulesService.getGenericHostRule(ruleName);
  }

  @GetMapping("/hosts/{ruleName}/conditions")
  public List<ConditionEntity> getRuleConditions(@PathVariable String ruleName) {
    return hostRulesService.getConditions(ruleName);
  }

  @PostMapping("/hosts/{ruleName}/conditions")
  public void addRuleConditions(@PathVariable String ruleName, @RequestBody List<String> conditions) {
    hostRulesService.addConditions(ruleName, conditions);
  }

  @DeleteMapping("/hosts/{ruleName}/conditions")
  public void removeRuleConditions(@PathVariable String ruleName, @RequestBody List<String> conditionNames) {
    hostRulesService.removeConditions(ruleName, conditionNames);
  }

  @DeleteMapping("/hosts/{ruleName}/conditions/{conditionName}")
  public void removeRuleCondition(@PathVariable String ruleName, @PathVariable String conditionName) {
    hostRulesService.removeCondition(ruleName, conditionName);
  }
  
}
