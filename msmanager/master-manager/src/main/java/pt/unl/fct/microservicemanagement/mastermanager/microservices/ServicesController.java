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

import pt.unl.fct.microservicemanagement.mastermanager.prediction.SaveServiceEventPredictionReq;
import pt.unl.fct.microservicemanagement.mastermanager.prediction.ServiceEventPrediction;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
  public Iterable<Service> getServices() {
    return servicesService.getServices();
  }

  @GetMapping("/{serviceId}")
  public Service getService(@PathVariable long serviceId) {
    return servicesService.getService(serviceId);
  }

  /*@PostMapping
  public long addService(@RequestBody Service service) {
    Validation.validatePostRequest(service.getId());
    return servicesService.addService(service);
  }

  @PutMapping("/{id}")
  public long updateService(@PathVariable long id, @RequestBody Service service) {
    Validation.validatePutRequest(id, service.getId());
    return servicesService.updateService(id, service);
  }*/

  @PostMapping("/{id}")
  public long saveService(@PathVariable long id, @RequestBody SaveServiceReq saveServiceConfigReq) {
    return servicesService.saveService(id, saveServiceConfigReq);
  }

  @DeleteMapping("/{id}")
  public void deleteService(@PathVariable long id) {
    servicesService.deleteService(id);
  }

  @GetMapping("/{id}/dependencies")
  public List<Service> getServicesDependencies(@PathVariable long id) {
    return servicesService.getServiceDependencies(id);
  }

  @GetMapping("/{id}/eventPredictions")
  public Iterable<ServiceEventPrediction> getServiceEventPredictions(@PathVariable long id) {
    return servicesService.getServiceEventPredictions(id);
  }

  @GetMapping("/{serviceId}/eventPredictions/{eventPredictionId}")
  public ServiceEventPrediction getServiceEventPrediction(@PathVariable long serviceId,
                                                          @PathVariable long eventPredictionId) {
    return servicesService.getServiceEventPrediction(serviceId, eventPredictionId);
  }

  /*@PostMapping("/{id}/serviceEventPredictions")
  public long addServiceEventPrediction(@PathVariable long id,
                                        @RequestBody
                                        final ServiceEventPrediction serviceEventPrediction) {
    Validation.validatePostRequest(id);
    return servicesService.addServiceEventPrediction(id, serviceEventPrediction);
  }

  @PostMapping("/{serviceId}/serviceEventPredictions/{serviceEventPredictionId}")
  public void updateServiceEventPrediction(@PathVariable long serviceId,
                                           @PathVariable long serviceEventPredictionId,
                                           @RequestBody
                                           final ServiceEventPrediction serviceEventPrediction) {
    Validation.validatePutRequest(serviceEventPredictionId, serviceEventPrediction.getId());
    servicesService.updateServiceEventPrediction(serviceId, serviceEventPredictionId, serviceEventPrediction);
  }*/

  //TODO move to an eventpredictioncontroller

  @RequestMapping(value = "/{serviceId}/eventPrediction/", method = RequestMethod.POST)
  public @ResponseBody long saveServiceEventPrediction(@PathVariable long serviceId,
                                                       @RequestBody SaveServiceEventPredictionReq
                                                           serviceEventPredictionReq) {
    return servicesService.saveServiceEventPrediction(serviceId, serviceEventPredictionReq);
  }

  @DeleteMapping("/{serviceId}/serviceEventPredictions/{serviceEventPredictionId}")
  public void deleteServiceEventPrediction(@PathVariable long serviceId,
                                           @PathVariable long serviceEventPredictionId) {
    servicesService.deleteServiceEventPrediction(serviceId, serviceEventPredictionId);
  }

  //TODO change to ?search=
  @PostMapping("/search/dockerRepo")
  public List<Service> getServiceByDockerRepo(@RequestBody SearchDockerRepository searchDockerRepository) {
    return servicesService.getServicesByDockerRepo(searchDockerRepository.getDockerRepo());
  }

  //TODO change to ?search=
  @GetMapping("/search/name/{serviceName}")
  public Service getServiceByDockerRepo(@PathVariable String serviceName) {
    return servicesService.getServiceLaunchConfig(serviceName);
  }

}
