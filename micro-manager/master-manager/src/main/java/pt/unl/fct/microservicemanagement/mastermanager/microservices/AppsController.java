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

package pt.unl.fct.microservicemanagement.mastermanager.microservices;

import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.AppRule;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.AppRuleReq;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RulesService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/apps")
public final class AppsController {

  private final AppPackagesService appPackagesService;
  private final RulesService ruleService;

  public AppsController(AppPackagesService appPackagesService, RulesService ruleService) {
    this.appPackagesService = appPackagesService;
    this.ruleService = ruleService;
  }

  @GetMapping
  public Iterable<AppPackage> getApps() {
    return appPackagesService.getApps();
  }

  @GetMapping("/{appId}")
  public AppPackage getApp(@PathVariable long appId) {
    return appPackagesService.getApp(appId);
  }

  @PostMapping("/{appId}")
  public long saveApp(@PathVariable long appId, @RequestBody SaveAppReq saveAppReq) {
    return appPackagesService.saveApp(appId, saveAppReq);
  }

  /*@PostMapping
  public long addApp(@JsonValue final String appName) {
    return appPackageService.addApp(appName);
  }

  @PutMapping("/{appId}")
  public void updateApp(@PathVariable long appId,
                        @JsonValue String appName) {
    appPackageService.updateApp(appId, appName);
  }*/

  @DeleteMapping("/{appId}")
  public void deleteApp(@PathVariable long appId) {
    appPackagesService.deleteApp(appId);
  }

  @GetMapping("/{appId}/services")
  public List<ServiceOrder> getServicesByAppId(@PathVariable long appId) {
    return appPackagesService.getServiceByAppId(appId);
  }


  //TODO move to rules service

  @GetMapping("/{appId}/rules")
  public List<AppRule> getAppRulesByAppId(@PathVariable long appId) {
    return ruleService.getAppRulesByAppId(appId);
  }

  @PostMapping("/{appId}/rules")
  public long saveAppRule(@PathVariable long appId, @RequestBody AppRuleReq appRule) {
    return ruleService.saveAppRule(appId, appRule.getRuleId());
  }

  @DeleteMapping("/{appId}/rules")
  public boolean deleteAppRule(@PathVariable long appId, @RequestBody AppRuleReq appRule) {
    return ruleService.deleteAppRule(appId, appRule.getRuleId());
  }

}
