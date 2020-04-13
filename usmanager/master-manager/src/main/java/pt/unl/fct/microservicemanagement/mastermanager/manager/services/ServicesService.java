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

package pt.unl.fct.microservicemanagement.mastermanager.manager.services;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.ServiceEventPredictionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.ServiceEventPredictionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.services.ServiceRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.services.ServiceRulesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.dependencies.ServiceDependency;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ServicesService {

  private final ServiceRepository services;
  private final ServiceEventPredictionRepository serviceEventPredictions;
  private final ServiceRulesService serviceRulesService;
  private final AppsService appsService;

  public ServicesService(ServiceRepository services, ServiceEventPredictionRepository serviceEventPredictions,
                         ServiceRulesService serviceRulesService, @Lazy AppsService appsService) {
    this.services = services;
    this.serviceEventPredictions = serviceEventPredictions;
    this.serviceRulesService = serviceRulesService;
    this.appsService = appsService;
  }

  public Iterable<ServiceEntity> getServices() {
    return services.findAll();
  }

  public ServiceEntity getService(Long id) {
    return services.findById(id).orElseThrow(() ->
        new EntityNotFoundException(ServiceEntity.class, "id", id.toString()));
  }

  public ServiceEntity getService(String serviceName) {
    return services.findByServiceNameIgnoreCase(serviceName).orElseThrow(() ->
        new EntityNotFoundException(ServiceEntity.class, "serviceName", serviceName));
  }

  public List<ServiceEntity> getServicesByDockerRepository(String dockerRepository) {
    return services.findByDockerRepository(dockerRepository);
  }

  public ServiceEntity addService(ServiceEntity service) {
    log.debug("Saving service {}", ToStringBuilder.reflectionToString(service));
    return services.save(service);
  }

  public ServiceEntity updateService(String serviceName, ServiceEntity newService) {
    var service = getService(serviceName);
    log.debug("Updating service {} with {}",
        ToStringBuilder.reflectionToString(service), ToStringBuilder.reflectionToString(newService));
    log.debug("Service before copying properties: {}",
        ToStringBuilder.reflectionToString(service));
    ObjectUtils.copyValidProperties(newService, service);
    log.debug("Service after copying properties: {}",
        ToStringBuilder.reflectionToString(service));
    return services.save(service);
  }

  public void deleteService(String serviceName) {
    var service = getService(serviceName);
    services.delete(service);
  }

  public AppEntity getApp(String serviceName, String appName) {
    assertServiceExists(serviceName);
    return services.getApp(serviceName, appName).orElseThrow(() ->
        new EntityNotFoundException(ServiceEntity.class, "appName", appName));
  }

  public List<AppEntity> getApps(String serviceName) {
    assertServiceExists(serviceName);
    return services.getAppsByServiceName(serviceName);
  }

  public void addApp(String serviceName, AddServiceApp addServiceApp) {
    var service = getService(serviceName);
    var appName = addServiceApp.getName();
    var launchOrder = addServiceApp.getLaunchOrder();
    var app = appsService.getApp(appName);
    var appService = AppServiceEntity.builder()
        .app(app)
        .service(service)
        .launchOrder(launchOrder)
        .build();
    service = service.toBuilder().appService(appService).build();
    services.save(service);
  }

  public void addApps(String serviceName, List<AddServiceApp> addServiceApps) {
    addServiceApps.forEach(addServiceApp -> addApp(serviceName, addServiceApp));
  }

  public void removeApp(String serviceName, String app) {
    removeApps(serviceName, List.of(app));
  }

  public void removeApps(String serviceName, List<String> apps) {
    var service = getService(serviceName);
    log.info("Removing apps {}", apps);
    service.getAppServices()
        .removeIf(app -> apps.contains(app.getApp().getName()));
    services.save(service);
  }

  public List<ServiceEntity> getDependencies(String serviceName) {
    assertServiceExists(serviceName);
    return services.getDependencies(serviceName);
  }

  public List<ServiceEntity> getDependenciesByType(Long serviceId, String serviceType) {
    assertServiceExists(serviceId);
    return services.getDependenciesByType(serviceId, serviceType);
  }

  public boolean serviceDependsOnOtherService(Long serviceId, String otherServiceName) {
    assertServiceExists(serviceId);
    assertServiceExists(otherServiceName);
    return services.serviceDependsOnOtherService(serviceId, otherServiceName);
  }

  public void addDependency(String serviceName, String dependencyName) {
    var service = getService(serviceName);
    var dependency = getService(dependencyName);
    var serviceDependency = ServiceDependency.builder().service(service).dependency(dependency).build();
    service = service.toBuilder().dependency(serviceDependency).build();
    services.save(service);
  }

  public void addDependencies(String serviceName, List<String> dependenciesNames) {
    dependenciesNames.forEach(dependencyName -> addDependency(serviceName, dependencyName));
  }

  public void removeDependency(String serviceName, String dependency) {
    removeDependencies(serviceName, List.of(dependency));
  }

  public void removeDependencies(String serviceName, List<String> dependencies) {
    var service = getService(serviceName);
    log.info("Removing dependencies {}", dependencies);
    service.getDependencies()
        .removeIf(dependency -> dependencies.contains(dependency.getDependency().getServiceName()));
    services.save(service);
  }

  public List<ServiceEntity> getDependees(String serviceName) {
    assertServiceExists(serviceName);
    return services.getDependees(serviceName);
  }

  public Iterable<ServiceEventPredictionEntity> getPredictions(String serviceName) {
    assertServiceExists(serviceName);
    return services.getPredictions(serviceName);
  }

  public void addPrediction(String serviceName, ServiceEventPredictionEntity prediction) {
    var service = getService(serviceName);
    var servicePrediction = prediction.toBuilder().service(service).lastUpdate(Timestamp.from(Instant.now())).build();
    service = service.toBuilder().eventPrediction(servicePrediction).build();
    services.save(service);
  }

  public void addPredictions(String serviceName, List<ServiceEventPredictionEntity> predictions) {
    predictions.forEach(prediction -> addPrediction(serviceName, prediction));
  }

  public void removePrediction(String serviceName, String predictionName) {
    removePredictions(serviceName, List.of(predictionName));
  }

  public void removePredictions(String serviceName, List<String> predictionsName) {
    var service = getService(serviceName);
    service.getEventPredictions()
        .removeIf(prediction -> predictionsName.contains(prediction.getName()));
    services.save(service);
  }

  // FIXME
  public ServiceEventPredictionEntity getEventPrediction(Long serviceId, Long eventPredictionId) {
    assertServiceExists(serviceId);
    return services.getPrediction(serviceId, eventPredictionId).orElseThrow(() ->
        new EntityNotFoundException(ServiceEventPredictionEntity.class, "eventPredictionId", eventPredictionId.toString())
    );
  }

  public Iterable<ServiceRuleEntity> getRules(String serviceName) {
    assertServiceExists(serviceName);
    return services.getRules(serviceName);
  }

  public ServiceRuleEntity getRule(String serviceName, String ruleName) {
    assertServiceExists(serviceName);
    return services.getRule(serviceName, ruleName).orElseThrow(() ->
        new EntityNotFoundException(ServiceRuleEntity.class, "name", ruleName)
    );
  }

  public void addRule(String serviceName, String ruleName) {
    var service = getService(serviceName);
    var rule = serviceRulesService.getRule(ruleName);
    log.info("Adding rule {}", ruleName);
    service = service.toBuilder().rule(rule).build();
    services.save(service);
  }

  public void addRules(String serviceName, List<String> ruleNames) {
    ruleNames.forEach(ruleName -> addRule(serviceName, ruleName));
  }

  public void removeRule(String serviceName, String ruleName) {
    removeRules(serviceName, List.of(ruleName));
  }

  public void removeRules(String serviceName, List<String> rulesName) {
    var service = getService(serviceName);
    log.info("Removing rules {}", rulesName);
    service.getRules()
        .removeIf(rule -> rulesName.contains(rule.getName()));
    services.save(service);
  }

  public void deleteServiceEventPrediction(Long serviceId, Long serviceEventPredictionId) {
    var serviceEventPrediction = getEventPrediction(serviceId, serviceEventPredictionId);
    serviceEventPredictions.delete(serviceEventPrediction);
  }

  public int getMinReplicasByServiceName(String serviceName) {
    final var date = new Date(System.currentTimeMillis());
    Integer customMinReplicas = serviceEventPredictions.getMinReplicasByServiceName(serviceName, date);
    return customMinReplicas == null ? services.getMinReplicasByServiceName(serviceName) : customMinReplicas;
  }

  public int getMaxReplicasByServiceName(String serviceName) {
    return services.getMaxReplicasByServiceName(serviceName);
  }

  private void assertServiceExists(Long serviceId) {
    if (!services.hasService(serviceId)) {
      throw new EntityNotFoundException(ServiceEntity.class, "id", serviceId.toString());
    }
  }

  private void assertServiceExists(String serviceName) {
    if (!services.hasService(serviceName)) {
      throw new EntityNotFoundException(ServiceEntity.class, "serviceName", serviceName);
    }
  }

}
