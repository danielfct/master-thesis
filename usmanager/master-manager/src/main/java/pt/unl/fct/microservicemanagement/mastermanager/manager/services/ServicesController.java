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

import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppPackage;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.EventPredictionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.SaveServiceEventPredictionReq;
import pt.unl.fct.microservicemanagement.mastermanager.util.BatchRequest;
import pt.unl.fct.microservicemanagement.mastermanager.util.Validation;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/services")
public class ServicesController {

  private final ServicesService servicesService;

  public ServicesController(ServicesService servicesService) {
    this.servicesService = servicesService;
  }

  @GetMapping
  public Iterable<ServiceEntity> getServices() {
    return servicesService.getServices();
  }

  @GetMapping("/{serviceName}")
  public ServiceEntity getService(@PathVariable String serviceName) {
    return servicesService.getService(serviceName);
  }

  @PostMapping
  public ServiceEntity addService(@RequestBody ServiceEntity service) {
    Validation.validatePostRequest(service.getId());
    return servicesService.addService(service);
  }

  @PutMapping("/{serviceName}")
  public ServiceEntity updateService(@PathVariable String serviceName, @RequestBody ServiceEntity service) {
    Validation.validatePutRequest(service.getId());
    return servicesService.updateService(serviceName, service);
  }

  @DeleteMapping("/{serviceName}")
  public void deleteService(@PathVariable String serviceName) {
    servicesService.deleteService(serviceName);
  }

  @GetMapping("/{serviceName}/apps")
  public List<AppPackage> getServiceApps(@PathVariable String serviceName) {
    return servicesService.getApps(serviceName);
  }

  @PatchMapping("/{serviceName}/apps")
  public void batchApps(@PathVariable String serviceName, @RequestBody BatchRequest<String> batchRequest) {
    BatchRequest.Request request = batchRequest.getRequest();
    String[] body = batchRequest.getBody();
    var apps = Arrays.asList(body);
    switch (request) {
      case POST:
        servicesService.addApps(serviceName, apps);
        break;
      case DELETE:
        servicesService.removeApps(serviceName, apps);
        break;
      default:
        break;
    }
  }

  @DeleteMapping("/{serviceName}/apps/{appName}")
  public void removeApp(@PathVariable String serviceName, @PathVariable String appName) {
    servicesService.removeApp(serviceName, appName);
  }

  @GetMapping("/{serviceName}/dependencies")
  public List<ServiceEntity> getServiceDependencies(@PathVariable String serviceName) {
    return servicesService.getDependencies(serviceName);
  }

  @PatchMapping("/{serviceName}/dependencies")
  public void batchDependencies(@PathVariable String serviceName, @RequestBody BatchRequest<String> batchRequest) {
    BatchRequest.Request request = batchRequest.getRequest();
    String[] body = batchRequest.getBody();
    var dependencies = Arrays.asList(body);
    switch (request) {
      case POST:
        servicesService.addDependencies(serviceName, dependencies);
        break;
      case DELETE:
        servicesService.removeDependencies(serviceName, dependencies);
        break;
      default:
        break;
    }
  }

  @DeleteMapping("/{serviceName}/dependencies/{dependencyName}")
  public void removeDependency(@PathVariable String serviceName, @PathVariable String dependencyName) {
    servicesService.removeDependency(serviceName, dependencyName);
  }

  @GetMapping("/{id}/eventPredictions")
  public Iterable<EventPredictionEntity> getServiceEventPredictions(@PathVariable Long id) {
    return servicesService.getServiceEventPredictions(id);
  }

  @GetMapping("/{serviceId}/eventPredictions/{eventPredictionId}")
  public EventPredictionEntity getServiceEventPrediction(@PathVariable Long serviceId,
                                                         @PathVariable Long eventPredictionId) {
    return servicesService.getEventPrediction(serviceId, eventPredictionId);
  }

  /*@PostMapping("/{id}/serviceEventPredictions")
  public Long addServiceEventPrediction(@PathVariable Long id,
                                        @RequestBody
                                        final ServiceEventPrediction serviceEventPrediction) {
    Validation.validatePostRequest(id);
    return servicesService.addServiceEventPrediction(id, serviceEventPrediction);
  }

  @PostMapping("/{serviceId}/serviceEventPredictions/{serviceEventPredictionId}")
  public void updateServiceEventPrediction(@PathVariable Long serviceId,
                                           @PathVariable Long serviceEventPredictionId,
                                           @RequestBody
                                           final ServiceEventPrediction serviceEventPrediction) {
    Validation.validatePutRequest(serviceEventPredictionId, serviceEventPrediction.getId());
    servicesService.updateServiceEventPrediction(serviceId, serviceEventPredictionId, serviceEventPrediction);
  }*/


  @RequestMapping(value = "/{serviceId}/eventPrediction/", method = RequestMethod.POST)
  public @ResponseBody Long saveServiceEventPrediction(@PathVariable Long serviceId,
                                                       @RequestBody SaveServiceEventPredictionReq
                                                           serviceEventPredictionReq) {
    return servicesService.saveServiceEventPrediction(serviceId, serviceEventPredictionReq);
  }

  @DeleteMapping("/{serviceId}/serviceEventPredictions/{serviceEventPredictionId}")
  public void deleteServiceEventPrediction(@PathVariable Long serviceId,
                                           @PathVariable Long serviceEventPredictionId) {
    servicesService.deleteServiceEventPrediction(serviceId, serviceEventPredictionId);
  }

  //TODO change to ?search=
  @PostMapping("/search/dockerRepo")
  public List<ServiceEntity> getServiceByDockerRepo(@RequestBody SearchDockerRepository searchDockerRepository) {
    return servicesService.getServicesByDockerRepository(searchDockerRepository.getDockerRepo());
  }

  //TODO change to ?search=
  @GetMapping("/search/name/{serviceName}")
  public ServiceEntity getServiceByDockerRepo(@PathVariable String serviceName) {
    return servicesService.getService(serviceName);
  }

}
