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

package pt.unl.fct.microservicemanagement.mastermanager.monitoring;

import pt.unl.fct.microservicemanagement.mastermanager.host.HostProperties;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.SimulatedMetricsService;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.prometheus.PrometheusService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class HostMetricsService {

  private final PrometheusService prometheusService;
  private final SimulatedMetricsService simulatedMetricsService;
  private final double maximumRamPercentage;

  public HostMetricsService(PrometheusService prometheusService,
                            SimulatedMetricsService simulatedMetricsService,
                            HostProperties hostProperties) {
    this.prometheusService = prometheusService;
    this.simulatedMetricsService = simulatedMetricsService;
    this.maximumRamPercentage = hostProperties.getMaximumRamPercentage();
  }

  public boolean nodeHasAvailableResources(String hostname, double avgContainerMem) {
    double totalRam = prometheusService.getTotalMemory(hostname);
    double availableRam = prometheusService.getAvailableMemory(hostname);
    //double cpuUsagePerc = prometheusService.getCpuUsagePercent(hostname);
    final var predictedRamUsage = (1.0 - ((availableRam - avgContainerMem) / totalRam)) * 100.0;
    //TODO Ignoring CPU: cpuUsagePerc < maxCpuPerc
    return predictedRamUsage < maximumRamPercentage;
  }

  public Map<String, Double> getHostStats(String hostname) {
    final var fields = new HashMap<String, Double>();
    final var cpuPercentage = prometheusService.getCpuUsagePercent(hostname);
    if (cpuPercentage != -1) {
      fields.put("cpu-%", cpuPercentage);
    }
    final var ramPercentage = prometheusService.getMemoryUsagePercent(hostname);
    if (ramPercentage != -1) {
      fields.put("ram-%", ramPercentage);
    }
    List.of("cpu-%", "ram-%", "cpu", "ram", "bandwidth-%").forEach(field ->
        simulatedMetricsService.getHostFieldValue(hostname, field).ifPresent(value -> fields.put(field, value))
    );
    return fields;
  }

}
