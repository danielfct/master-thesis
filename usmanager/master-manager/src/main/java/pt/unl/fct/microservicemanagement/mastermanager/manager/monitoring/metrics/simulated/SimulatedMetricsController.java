/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metrics.simulated;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/simulated-metrics")
public class SimulatedMetricsController {

  /*  private final SimulatedMetricsService simulatedMetricsService;

  public SimulatedMetricsController(SimulatedMetricsService simulatedMetricsService) {
    this.simulatedMetricsService = simulatedMetricsService;
  }

  @GetMapping("/containers")
  public Iterable<ContainerSimulatedMetricsEntity> getContainerSimulatedMetric() {
    return simulatedMetricsService.getAllContainerSimulatedMetrics();
  }

  @GetMapping("/containers/{id}")
  public ContainerSimulatedMetricsEntity getContainerSimulatedMetricsById(@PathVariable long id) {
    return simulatedMetricsService.getContainerSimulatedMetric(id);
  }

  @PostMapping("/containers/{id}")
  public long saveContainerSimulatedMetrics(@PathVariable long id,
                                            @RequestBody
                                                ContainerSimulatedMetricsEntity containerSimulatedMetricsEntity) {
    return simulatedMetricsService.saveContainerSimulatedMetrics(id, containerSimulatedMetricsEntity);
  }

@PostMapping("/containers")
  public long addContainerSimulatedMetric(@RequestBody
                                          final ContainerSimulatedMetrics containerSimulatedMetric) {
    Validation.validatePostRequest(containerSimulatedMetric.getId());
    return simulatedMetricsService.addContainerSimulatedMetric(containerSimulatedMetric);
  }

  @PutMapping("/containers/{id}")
  public void updateContainerSimulatedMetric(@PathVariable long id,
                                             @RequestBody
                                             final ContainerSimulatedMetrics containerSimulatedMetric)
                                             {
    Validation.validatePutRequest(id, containerSimulatedMetric.getId());
    simulatedMetricsService.updateContainerSimulatedMetric(id, containerSimulatedMetric);
  }

  @DeleteMapping("/containers/{id}")
  public void deleteContainerSimulatedMetrics(@PathVariable long id) {
    simulatedMetricsService.deleteContainerSimulatedMetric(id);
  }*/


}
