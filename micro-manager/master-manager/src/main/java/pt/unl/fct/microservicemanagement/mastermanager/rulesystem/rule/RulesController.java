/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.Field;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.ComponentTypeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.ValueMode;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.condition.ConditionEntity;

@RestController
@RequestMapping("/rules")
public class RulesController {

  private final RulesService rulesService;

  public RulesController(RulesService rulesService) {
    this.rulesService = rulesService;
  }

  @GetMapping
  public Iterable<RuleEntity> getRules() {
    return rulesService.getRules();
  }

  @GetMapping("/{ruleId}")
  public RuleEntity getRule(@PathVariable long ruleId) {
    return rulesService.getRule(ruleId);
  }

  @PostMapping("/{ruleId}")
  public long saveRule(@PathVariable long ruleId, @RequestBody RuleReq ruleReq) {
    return rulesService.saveRule(ruleId, ruleReq);
  }

  @DeleteMapping("/{ruleId}")
  public void deleteRule(@PathVariable long ruleId) {
    rulesService.deleteRule(ruleId);
  }

  @GetMapping("/{ruleId}/conditions")
  public List<ConditionEntity> getRuleConditions(@PathVariable long ruleId) {
    return rulesService.getRuleConditions(ruleId);
  }

  @PostMapping("/{ruleId}/conditions/{conditionId}")
  public long addConditionToRule(@PathVariable long ruleId, @PathVariable long conditionId) {
    return rulesService.addConditionToRule(ruleId, conditionId);
  }

  @DeleteMapping("/{ruleId}/conditions/{conditionId}")
  public long deleteConditionFromRule(@PathVariable long ruleId, @PathVariable long conditionId) {
    return rulesService.deleteConditionFromRule(ruleId, conditionId);
  }

  //TODO move to HostsController

  @GetMapping("/hosts")
  public List<RuleEntity> getHostRules() {
    return rulesService.getHostRules();
  }

  @GetMapping("/hosts/{hostname}")
  public List<HostRule> getHostRulesByHostname(@PathVariable String hostname) {
    return rulesService.getHostRulesByHostname(hostname);
  }

  @PostMapping("/hosts/{hostname}")
  public long saveHostRule(@PathVariable String hostname, @RequestBody HostRuleReq hostRule) {
    return rulesService.saveHostRule(hostname, hostRule.getRuleId());
  }

  @DeleteMapping("/hosts/{hostname}")
  public boolean deleteHostRule(@PathVariable String hostname, @RequestBody HostRuleReq hostRule) {
    return rulesService.deleteHostRule(hostname, hostRule.getRuleId());
  }

  @GetMapping("/hosts/genericRules")
  public Iterable<GenericHostRule> getGenericHostRules() {
    return rulesService.getGenericHostRules();
  }

  @PostMapping("/hosts/genericRules/{ruleId}")
  public long saveGenericHostRule(@PathVariable long ruleId) {
    return rulesService.saveGenericHostRule(ruleId);
  }

  @DeleteMapping("/hosts/genericRules/{ruleId}")
  public boolean deleteGenericHostRule(@PathVariable long ruleId) {
    return rulesService.deleteGenericHostRule(ruleId);
  }


  @GetMapping("/fields")
  public Iterable<Field> getFields() {
    return rulesService.getFields();
  }

  @GetMapping("/valueModes")
  public Iterable<ValueMode> getValueModes() {
    return rulesService.getValueModes();
  }

  @GetMapping("/operators")
  public Iterable<OperatorEntity> getOperators() {
    return rulesService.getOperators();
  }

  @GetMapping("/componentTypes")
  public Iterable<ComponentTypeEntity> getRuleTyIterable() {
    return rulesService.getComponentTypes();
  }


  @GetMapping("/container")
  public List<RuleEntity> getContainerRules() {
    return rulesService.getContainerRules();
  }


  @GetMapping("/services/{serviceId}")
  public List<ServiceRule> getAppRulesByServiceId(@PathVariable long serviceId) {
    return rulesService.getServiceRulesByServiceId(serviceId);
  }

  @PostMapping("/services/{serviceId}")
  public long saveServiceRule(@PathVariable long serviceId,
                              @RequestBody ServiceRuleReq serviceRule) {
    return rulesService.saveServiceRule(serviceId, serviceRule.getRuleId());
  }

  @DeleteMapping("/services/{serviceId}")
  public boolean deleteServiceRule(@PathVariable long serviceId,
                                   @RequestBody ServiceRuleReq serviceRule) {
    return rulesService.deleteServiceRule(serviceId, serviceRule.getRuleId());
  }

}
