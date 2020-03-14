package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.apps;

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
@RequestMapping("/rules/apps")
public class AppRulesController {
  
  private final AppRulesService appRulesService;

  public AppRulesController(AppRulesService appRulesService) {
    this.appRulesService = appRulesService;
  }

  @GetMapping
  public Iterable<AppRuleEntity> getRules() {
    return appRulesService.getRules();
  }

  @GetMapping("/{ruleId}")
  public AppRuleEntity getRule(@PathVariable Long ruleId) {
    return appRulesService.getRule(ruleId);
  }

  @GetMapping("/{ruleName}")
  public AppRuleEntity getRule(@PathVariable String ruleName) {
    return appRulesService.getRule(ruleName);
  }

  @PostMapping
  public AppRuleEntity addRule(@RequestBody AppRuleEntity rule) {
    Validation.validatePostRequest(rule.getId());
    return appRulesService.addRule(rule);
  }

  @PutMapping("/{ruleName}")
  public AppRuleEntity updateRule(@PathVariable String ruleName, @RequestBody AppRuleEntity rule) {
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

  @PostMapping("/{ruleName}/conditions/{conditionName}")
  public void addRuleCondition(@PathVariable String ruleName, @PathVariable String conditionName) {
    appRulesService.addCondition(ruleName, conditionName);
  }

  @DeleteMapping("/{ruleName}/conditions/{conditionName}")
  public void removeRuleCondition(@PathVariable String ruleName, @PathVariable String conditionName) {
    appRulesService.removeCondition(ruleName, conditionName);
  }
  
}
