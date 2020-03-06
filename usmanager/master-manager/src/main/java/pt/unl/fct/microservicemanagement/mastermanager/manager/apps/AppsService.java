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

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rule.AppRule;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rule.RulesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.AddServiceApp;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceOrder;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AppsService {

  private final AppPackageRepository apps;
  private final ServicesService services;
  private final RulesService rules;

  public AppsService(AppPackageRepository apps, ServicesService services, RulesService rules) {
    this.apps = apps;
    this.services = services;
    this.rules = rules;
  }

  public Iterable<AppPackage> getApps() {
    return apps.findAll();
  }

  public AppPackage getApp(Long id) {
    return apps.findById(id).orElseThrow(() ->
        new EntityNotFoundException(AppPackage.class, "id", id.toString()));
  }

  public AppPackage getApp(String appName) {
    return apps.findByNameIgnoreCase(appName).orElseThrow(() ->
        new EntityNotFoundException(AppPackage.class, "name", appName));
  }

  public AppPackage addApp(AppPackage app) {
    log.debug("Saving app {}", ToStringBuilder.reflectionToString(app));
    return apps.save(app);
  }

  public AppPackage updateApp(String appName, AppPackage newApp) {
    var app = getApp(appName);
    log.debug("Updating app {} with {}",
        ToStringBuilder.reflectionToString(app), ToStringBuilder.reflectionToString(newApp));
    log.debug("Service before copying properties: {}",
        ToStringBuilder.reflectionToString(app));
    ObjectUtils.copyValidProperties(newApp, app);
    log.debug("Service after copying properties: {}",
        ToStringBuilder.reflectionToString(app));
    return apps.save(app);
  }

  public void deleteApp(String name) {
    final var appPackage = getApp(name);
    apps.delete(appPackage);
  }

  public List<AppServiceEntity> getServices(String appName) {
    assertAppExists(appName);
    return apps.getServices(appName);
  }

  //FIXME
  public List<ServiceOrder> getServiceByAppId(long appId) {
    return apps.getServiceOrderByService(appId);
  }

  public void addService(String appName, AddServiceApp addServiceApp) {
    var app = getApp(appName);
    var service = services.getService(addServiceApp.getName());
    var appService = AppServiceEntity.builder()
        .appPackage(app)
        .service(service)
        .launchOrder(addServiceApp.getLaunchOrder())
        .build();
    app = app.toBuilder().appService(appService).build();
    apps.save(app);
  }

  public void addServices(String appName, List<AddServiceApp> addServiceApps) {
    addServiceApps.forEach(serviceApp -> addService(appName, serviceApp));
  }

  public void removeService(String appName, String service) {
    removeServices(appName, List.of(service));
  }

  public void removeServices(String appName, List<String> services) {
    var app = getApp(appName);
    log.info("Removing services {}", services);
    app.getAppServices()
        .removeIf(service -> services.contains(service.getService().getServiceName()));
    apps.save(app);
  }

  public List<AppRule> getRules(String appName) {
    assertAppExists(appName);
    return apps.getRules(appName);
  }

  public void addRule(String appName, String ruleName) {
    var app = getApp(appName);
    var rule = rules.getRule(ruleName);
    var appRule = AppRule.builder().appPackage(app).rule(rule).build();
    app = app.toBuilder().appRule(appRule).build();
    apps.save(app);
  }

  public void addRules(String appName, List<String> rules) {
    rules.forEach(ruleName -> addRule(appName, ruleName));
  }

  public void removeRule(String appName, String rule) {
    removeRules(appName, List.of(rule));
  }

  public void removeRules(String appName, List<String> rules) {
    var app = getApp(appName);
    log.info("Removing rules {}", rules);
    app.getAppRules()
        .removeIf(rule -> rules.contains(rule.getRule().getName()));
    apps.save(app);
  }

  private void assertAppExists(Long appId) {
    if (!apps.hasApp(appId)) {
      throw new EntityNotFoundException(AppPackage.class, "id", appId.toString());
    }
  }

  private void assertAppExists(String appName) {
    if (!apps.hasApp(appName)) {
      throw new EntityNotFoundException(AppPackage.class, "appName", appName.toString());
    }
  }

}
