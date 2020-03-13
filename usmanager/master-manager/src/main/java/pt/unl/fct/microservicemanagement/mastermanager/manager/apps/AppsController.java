/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
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

package pt.unl.fct.microservicemanagement.mastermanager.manager.apps;

import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.app.AppRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.AddServiceApp;
import pt.unl.fct.microservicemanagement.mastermanager.util.Validation;

import java.util.Arrays;
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
@RequestMapping("/apps")
public final class AppsController {

  private final AppsService appsService;

  public AppsController(AppsService appsService) {
    this.appsService = appsService;
  }

  @GetMapping
  public Iterable<AppPackage> getApps() {
    return appsService.getApps();
  }

  @GetMapping("/{appId}")
  public AppPackage getApp(@PathVariable Long appId) {
    return appsService.getApp(appId);
  }

  @GetMapping("/{appName}")
  public AppPackage getApp(@PathVariable String appName) {
    return appsService.getApp(appName);
  }

  @PostMapping
  public AppPackage addApp(@RequestBody AppPackage app) {
    Validation.validatePostRequest(app.getId());
    return appsService.addApp(app);
  }

  @PutMapping("/{appName}")
  public AppPackage updateApp(@PathVariable String appName, @RequestBody AppPackage app) {
    Validation.validatePutRequest(app.getId());
    return appsService.updateApp(appName, app);
  }

  @DeleteMapping("/{appName}")
  public void deleteApp(@PathVariable String serviceName) {
    appsService.deleteApp(serviceName);
  }

  @GetMapping("/{appName}/services")
  public List<AppServiceEntity> getAppServices(@PathVariable String appName) {
    return appsService.getServices(appName);
  }

  @PostMapping("/{appName}/services")
  public void addAppServices(@PathVariable String appName,
                             @RequestBody AddServiceApp[] services) {
    appsService.addServices(appName, Arrays.asList(services));
  }

  @DeleteMapping("/{appName}/services")
  public void removeAppServices(@PathVariable String appName,
                                @RequestBody String[] services) {
    appsService.removeServices(appName, Arrays.asList(services));
  }

  @DeleteMapping("/{appName}/services/{serviceName}")
  public void removeAppService(@PathVariable String appName,
                               @PathVariable String serviceName) {
    appsService.removeService(appName, serviceName);
  }

  @GetMapping("/{appName}/rules")
  public List<AppRuleEntity> getAppRules(@PathVariable String appName) {
    return appsService.getRules(appName);
  }

  @PostMapping("/{appName}/rules")
  public void addAppRules(@PathVariable String appName,
                          @RequestBody String[] rules) {
    appsService.addRules(appName, Arrays.asList(rules));
  }

  @DeleteMapping("/{appName}/rules")
  public void removeAppRules(@PathVariable String appName,
                             @RequestBody String[] rules) {
    appsService.removeRules(appName, Arrays.asList(rules));
  }

  @DeleteMapping("/{appName}/rules/{ruleName}")
  public void removeAppRule(@PathVariable String appName,
                            @PathVariable String ruleName) {
    appsService.removeRule(appName, ruleName);
  }

}
