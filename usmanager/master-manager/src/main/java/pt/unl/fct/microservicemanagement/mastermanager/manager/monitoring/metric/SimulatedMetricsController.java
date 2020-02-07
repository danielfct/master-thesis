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

package pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metric;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;

@RestController
@RequestMapping("/simulatedMetrics")
public class SimulatedMetricsController {

  // TODO merge with metricsController

  private final SimulatedMetricsService simulatedMetricsService;

  public SimulatedMetricsController(SimulatedMetricsService simulatedMetricsService) {
    this.simulatedMetricsService = simulatedMetricsService;
  }

  //TODO move to ServicesController

  @GetMapping("/services")
  public Iterable<ServiceSimulatedMetricsEntity> getServiceSimulatedMetrics() {
    return simulatedMetricsService.getServiceSimulatedMetrics();
  }

  @GetMapping("/services/{id}")
  public ServiceSimulatedMetricsEntity getServiceSimulatedMetric(@PathVariable long id) throws EntityNotFoundException {
    return simulatedMetricsService.getServiceSimulatedMetric(id);
  }

  @PostMapping("/services/{id}")
  public long saveServiceSimulatedMetrics(@PathVariable long id,
                                          @RequestBody ServiceSimulatedMetricsEntity serviceSimulatedMetrics) {
    return simulatedMetricsService.saveServiceSimulatedMetrics(id, serviceSimulatedMetrics);
  }

  /*@PostMapping("/services")
  public long addServiceSimulatedMetric(@RequestBody
                                        final ServiceSimulatedMetrics serviceSimulatedMetric) {
    Validation.validatePostRequest(serviceSimulatedMetric.getId());
    return simulatedMetricsService.addServiceSimulatedMetric(serviceSimulatedMetric);
  }

  @PutMapping("/services/{id}")
  public void updateServiceSimulatedMetric(@PathVariable long id,
                                           @RequestBody ServiceSimulatedMetrics serviceSimulatedMetric)
                                           throws EntityNotFoundException {
    Validation.validatePutRequest(id, serviceSimulatedMetric.getId());
    simulatedMetricsService.updateServiceSimulatedMetric(id, serviceSimulatedMetric);
  }*/

  @DeleteMapping("/services/{id}")
  public void deleteServiceSimulatedMetric(@PathVariable long id) throws EntityNotFoundException {
    simulatedMetricsService.deleteServiceSimulatedMetrics(id);
  }

  @GetMapping("/containers")
  public Iterable<ContainerSimulatedMetricsEntity> getContainerSimulatedMetric() {
    return simulatedMetricsService.getAllContainerSimulatedMetrics();
  }

  @GetMapping("/containers/{id}")
  public ContainerSimulatedMetricsEntity getContainerSimulatedMetricsById(@PathVariable long id)
      throws EntityNotFoundException {
    return simulatedMetricsService.getContainerSimulatedMetric(id);
  }

  @PostMapping("/containers/{id}")
  public long saveContainerSimulatedMetrics(@PathVariable long id,
                                            @RequestBody
                                                ContainerSimulatedMetricsEntity containerSimulatedMetricsEntity) {
    return simulatedMetricsService.saveContainerSimulatedMetrics(id, containerSimulatedMetricsEntity);
  }

  /*@PostMapping("/containers")
  public long addContainerSimulatedMetric(@RequestBody
                                          final ContainerSimulatedMetrics containerSimulatedMetric) {
    Validation.validatePostRequest(containerSimulatedMetric.getId());
    return simulatedMetricsService.addContainerSimulatedMetric(containerSimulatedMetric);
  }

  @PutMapping("/containers/{id}")
  public void updateContainerSimulatedMetric(@PathVariable long id,
                                             @RequestBody
                                             final ContainerSimulatedMetrics containerSimulatedMetric)
                                             throws EntityNotFoundException {
    Validation.validatePutRequest(id, containerSimulatedMetric.getId());
    simulatedMetricsService.updateContainerSimulatedMetric(id, containerSimulatedMetric);
  }*/

  @DeleteMapping("/containers/{id}")
  public void deleteContainerSimulatedMetrics(@PathVariable long id) throws EntityNotFoundException {
    simulatedMetricsService.deleteContainerSimulatedMetric(id);
  }

  @GetMapping("/hosts/default")
  public Iterable<DefaultHostSimulatedMetricsEntity> getDefaultHostSimulatedMetrics() {
    return simulatedMetricsService.getAllDefaultHostSimulatedMetrics();
  }

  @GetMapping("/hosts/default/{id}")
  public DefaultHostSimulatedMetricsEntity getDefaultHostSimulatedMetric(@PathVariable long id)
      throws EntityNotFoundException {
    return simulatedMetricsService.getDefaultHostSimulatedMetric(id);
  }

  @PostMapping("/hosts/default/{id}")
  public long saveDefaultHostSimulatedMetrics(@PathVariable long id,
                                              @RequestBody
                                                  DefaultHostSimulatedMetricsEntity defaultHostSimulatedMetricsEntity) {
    return simulatedMetricsService.saveDefaultHostSimulatedMetrics(id, defaultHostSimulatedMetricsEntity);
  }

  /*@PostMapping("/hosts/default")
  public long addDefaultHostSimulatedMetric(@RequestBody DefaultHostSimulatedMetrics defaultHostSimulatedMetric) {
    Validation.validatePostRequest(defaultHostSimulatedMetric.getId());
    return simulatedMetricsService.addDefaultHostSimulatedMetric(defaultHostSimulatedMetric);
  }

  @PutMapping("/hosts/default/{id}")
  public void updateContainerSimulatedMetric(@PathVariable long id,
                                             @RequestBody DefaultHostSimulatedMetrics defaultHostSimulatedMetric)
                                             throws EntityNotFoundException {
    Validation.validatePutRequest(id, defaultHostSimulatedMetric.getId());
    simulatedMetricsService.updateDefaultHostSimulatedMetric(id, defaultHostSimulatedMetric);
  }*/

  @DeleteMapping("/hosts/default/{id}")
  public void deleteDefaultHostSimulatedMetrics(@PathVariable long id) throws EntityNotFoundException {
    simulatedMetricsService.deleteDefaultHostSimulatedMetric(id);
  }


  @GetMapping("/hosts/specific")
  public Iterable<SpecificHostSimulatedMetricsEntity> getSpecificHostSimulatedMetrics() {
    return simulatedMetricsService.getAllSpecificHostSimulatedMetrics();
  }

  @GetMapping("/hosts/specific/{id}")
  public SpecificHostSimulatedMetricsEntity getSpecificHostSimulatedMetric(@PathVariable long id)
      throws EntityNotFoundException {
    return simulatedMetricsService.getSpecificHostSimulatedMetric(id);
  }

  @PostMapping("/hosts/specific/{id}")
  public long saveSpecificHostSimulatedMetrics(@PathVariable long id,
                                               @RequestBody SpecificHostSimulatedMetricsEntity
                                                   specificHostSimulatedMetricsEntity) {
    return simulatedMetricsService.saveSpecificHostSimulatedMetrics(id, specificHostSimulatedMetricsEntity);
  }

  /*@PostMapping("/specificHosts")
  public long addSpecificHostSimulatedMetric(@RequestBody SpecificHostSimulatedMetrics specificHostSimulatedMetrics) {
    Validation.validatePostRequest(specificHostSimulatedMetrics.getId());
    return simulatedMetricsService.addSpecificHostSimulatedMetric(specificHostSimulatedMetrics);
  }

  @PutMapping("/specificHosts/{id}")
  public void updateSpecificHostSimulatedMetric(@PathVariable long id,
                                                @RequestBody
                                                SpecificHostSimulatedMetrics specificHostSimulatedMetrics)
                                                throws EntityNotFoundException {
    Validation.validatePutRequest(id, specificHostSimulatedMetrics.getId());
    simulatedMetricsService.updateSpecificHostSimulatedMetric(id, specificHostSimulatedMetrics);
  }*/

  @DeleteMapping("/hosts/specific/{id}")
  public void deleteSpecificHostSimulatedMetric(@PathVariable long id) throws EntityNotFoundException {
    simulatedMetricsService.deleteSpecificHostSimulatedMetric(id);
  }

}
