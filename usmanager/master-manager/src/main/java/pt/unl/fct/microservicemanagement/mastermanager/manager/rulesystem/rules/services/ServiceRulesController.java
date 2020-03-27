package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.services;

import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;
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
@RequestMapping("/rules/services")
public class ServiceRulesController {
  
  private final ServiceRulesService appRulesService;

  public ServiceRulesController(ServiceRulesService appRulesService) {
    this.appRulesService = appRulesService;
  }

  @GetMapping
  public Iterable<ServiceRuleEntity> getRules() {
    return appRulesService.getServiceRules();
  }

  @GetMapping("/{ruleName}")
  public ServiceRuleEntity getRule(@PathVariable String ruleName) {
    return appRulesService.getRule(ruleName);
  }

  @PostMapping
  public ServiceRuleEntity addRule(@RequestBody ServiceRuleEntity rule) {
    Validation.validatePostRequest(rule.getId());
    return appRulesService.addRule(rule);
  }

  @PutMapping("/{ruleName}")
  public ServiceRuleEntity updateRule(@PathVariable String ruleName, @RequestBody ServiceRuleEntity rule) {
    Validation.validatePutRequest(rule.getId());
    return appRulesService.updateRule(ruleName, rule);
  }

  @DeleteMapping("/{ruleName}")
  public void deleteRule(@PathVariable String ruleName) {
    appRulesService.deleteRule(ruleName);
  }

  @GetMapping("/{ruleName}/conditions")
  public List<ConditionEntity> getRuleConditions(@PathVariable String ruleName) {
    return appRulesService.getConditions(ruleName);
  }

  @PostMapping("/{ruleName}/conditions")
  public void addRuleConditions(@PathVariable String ruleName, @RequestBody List<String> conditions) {
    appRulesService.addConditions(ruleName, conditions);
  }

  @DeleteMapping("/{ruleName}/conditions")
  public void removeRuleConditions(@PathVariable String ruleName, @RequestBody List<String> conditionNames) {
    appRulesService.removeConditions(ruleName, conditionNames);
  }

  @DeleteMapping("/{ruleName}/conditions/{conditionName}")
  public void removeRuleCondition(@PathVariable String ruleName, @PathVariable String conditionName) {
    appRulesService.removeCondition(ruleName, conditionName);
  }
  
}
