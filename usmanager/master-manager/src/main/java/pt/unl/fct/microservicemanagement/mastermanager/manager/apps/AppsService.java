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

import org.springframework.dao.DataIntegrityViolationException;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.containers.ContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.containers.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.location.RegionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceOrder;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceType;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AppsService {

  private final ServicesService servicesService;
  private final ContainersService containersService;
  private final AppRepository apps;

  public AppsService(ServicesService servicesService, ContainersService containersService, AppRepository apps) {
    this.servicesService = servicesService;
    this.containersService = containersService;
    this.apps = apps;
  }

  public List<AppEntity> getApps() {
    return apps.findAll();
  }

  public AppEntity getApp(Long id) {
    return apps.findById(id).orElseThrow(() ->
        new EntityNotFoundException(AppEntity.class, "id", id.toString()));
  }

  public AppEntity getApp(String appName) {
    return apps.findByNameIgnoreCase(appName).orElseThrow(() ->
        new EntityNotFoundException(AppEntity.class, "name", appName));
  }

  public AppEntity addApp(AppEntity app) {
    assertAppDoesntExist(app);
    log.debug("Saving app {}", ToStringBuilder.reflectionToString(app));
    return apps.save(app);
  }

  public AppEntity updateApp(String appName, AppEntity newApp) {
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
    var app = getApp(name);
    apps.delete(app);
  }

  public List<AppServiceEntity> getServices(String appName) {
    assertAppExists(appName);
    return apps.getServices(appName);
  }

  public List<ServiceOrder> getServicesOrder(String appName) {
    return apps.getServicesOrder(appName);
  }

  public void addService(String appName, String serviceName, int order) {
    var app = getApp(appName);
    var service = servicesService.getService(serviceName);
    var appService = AppServiceEntity.builder()
        .app(app)
        .service(service)
        .launchOrder(order)
        .build();
    app = app.toBuilder().appService(appService).build();
    apps.save(app);
  }

  public void addServices(String appName, Map<String, Integer> services) {
    services.forEach((service, launchOrder) -> addService(appName, service, launchOrder));
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

  private void assertAppExists(String appName) {
    if (!apps.hasApp(appName)) {
      throw new EntityNotFoundException(AppEntity.class, "name", appName);
    }
  }

  private void assertAppDoesntExist(AppEntity app) {
    var name = app.getName();
    if (apps.hasApp(name)) {
      throw new DataIntegrityViolationException("App '" + name + "' already exists");
    }
  }

  public Map<String, List<DockerContainer>> launch(String appName, RegionEntity region, String country, String city) {
    log.info("Launching app {} at {}/{}/{}", appName, region.getName(), country, city);
    List<ServiceEntity> services = getServicesOrder(appName).stream()
        .filter(serviceOrder -> serviceOrder.getService().getServiceType() != ServiceType.DATABASE)
        .map(ServiceOrder::getService).collect(Collectors.toList());
    return containersService.launchApp(services, region.getName(), country, city);
  }

}
