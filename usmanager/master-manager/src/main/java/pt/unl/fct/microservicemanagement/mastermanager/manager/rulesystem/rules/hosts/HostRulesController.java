package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts;

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
@RequestMapping("/rules/hosts")
public class HostRulesController {
  
  private final HostRulesService hostRulesService;

  public HostRulesController(HostRulesService appRulesService) {
    this.hostRulesService = appRulesService;
  }

  @GetMapping
  public Iterable<HostRuleEntity> getRules() {
    return hostRulesService.getRules();
  }

  @GetMapping("/{ruleName}")
  public HostRuleEntity getRule(@PathVariable String ruleName) {
    return hostRulesService.getRule(ruleName);
  }

  @PostMapping
  public HostRuleEntity addRule(@RequestBody HostRuleEntity rule) {
    Validation.validatePostRequest(rule.getId());
    return hostRulesService.addRule(rule);
  }

  @PutMapping("/{ruleName}")
  public HostRuleEntity updateRule(@PathVariable String ruleName, @RequestBody HostRuleEntity rule) {
    Validation.validatePutRequest(rule.getId());
    return hostRulesService.updateRule(ruleName, rule);
  }

  @DeleteMapping("/{ruleName}")
  public void deleteRule(@PathVariable String ruleName) {
    hostRulesService.deleteRule(ruleName);
  }

  @GetMapping("/{ruleName}/conditions")
  public List<ConditionEntity> getRuleConditions(@PathVariable String ruleName) {
    return hostRulesService.getConditions(ruleName);
  }

  @PostMapping("/{ruleName}/conditions/{conditionName}")
  public void addRuleCondition(@PathVariable String ruleName, @PathVariable String conditionName) {
    hostRulesService.addCondition(ruleName, conditionName);
  }

  @DeleteMapping("/{ruleName}/conditions/{conditionName}")
  public void removeRuleCondition(@PathVariable String ruleName, @PathVariable String conditionName) {
    hostRulesService.removeCondition(ruleName, conditionName);
  }
  
}
