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

package pt.unl.fct.microservicemanagement.mastermanager.monitoring;

import pt.unl.fct.microservicemanagement.mastermanager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.SimpleContainer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.spotify.docker.client.messages.ContainerStats;
import com.spotify.docker.client.messages.CpuStats;
import com.spotify.docker.client.messages.MemoryStats;
import com.spotify.docker.client.messages.NetworkStats;
import org.springframework.stereotype.Service;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.SimulatedMetricsService;

@Service
public class ContainerMetricsService {

  private final DockerContainersService dockerContainersService;
  private final SimulatedMetricsService simulatedMetricsService;
  private final ContainersMonitoringService containersMonitoringService;

  public ContainerMetricsService(DockerContainersService dockerContainersService,
                                 SimulatedMetricsService simulatedMetricsService,
                                 ContainersMonitoringService containersMonitoringService) {
    this.dockerContainersService = dockerContainersService;
    this.simulatedMetricsService = simulatedMetricsService;
    this.containersMonitoringService = containersMonitoringService;
  }

  Map<String, Double> getContainerStats(SimpleContainer container, double secondsInterval) {
    String containerId = container.getId();
    String containerHostname = container.getHostname();
    String containerName = container.getNames().get(0);
    String serviceName = container.getLabels().getOrDefault(DockerContainer.Label.SERVICE_NAME, containerName);
    ContainerStats containerStats = dockerContainersService.getContainerStats(containerId, containerHostname);
    CpuStats cpuStats = containerStats.cpuStats();
    CpuStats preCpuStats = containerStats.precpuStats();
    double cpu = cpuStats.cpuUsage().totalUsage().doubleValue();
    double cpuPercent = getContainerCpuPercent(preCpuStats, cpuStats);
    MemoryStats memoryStats = containerStats.memoryStats();
    double ram = memoryStats.usage().doubleValue();
    double ramPercent = getContainerRamPercent(memoryStats);
    double rxBytes = 0;
    double txBytes = 0;
    for (NetworkStats stats : containerStats.networks().values()) {
      rxBytes += stats.rxBytes().doubleValue();
      txBytes += stats.txBytes().doubleValue();
    }
    // Metrics from docker
    final var fields = new HashMap<>(Map.of(
        "cpu", cpu,
        "ram", ram,
        "cpu-%", cpuPercent,
        "ram-%", ramPercent,
        "rx-bytes", rxBytes,
        "tx-bytes", txBytes));
    // Simulated metrics
    if (container.getLabels().containsKey(DockerContainer.Label.SERVICE_NAME)) {
      final var simulatedFields = simulatedMetricsService.getContainerFieldsValue(serviceName, containerId);
      fields.putAll(simulatedFields);
    }
    // Calculated metrics
    //TODO use monitoring previous update to calculate interval, instead of passing through argument
    Map.of("rx-bytes", rxBytes, "tx-bytes", txBytes).forEach((field, value) -> {
      final ServiceMonitoring monitoring = containersMonitoringService
          .getServiceMonitoring(containerId, field);
      final double lastValue = monitoring == null ? 0 : monitoring.getLastValue();
      final double bytesPerSec = Math.max(0, (value - lastValue) / secondsInterval);
      fields.put(field + "-per-sec", bytesPerSec);
    });
    return fields;
  }

  private double getContainerCpuPercent(CpuStats preCpuStats, CpuStats cpuStats) {
    final var systemDelta = cpuStats.systemCpuUsage().doubleValue() - preCpuStats.systemCpuUsage().doubleValue();
    final var cpuDelta = cpuStats.cpuUsage().totalUsage().doubleValue()
        - preCpuStats.cpuUsage().totalUsage().doubleValue();
    double cpuPercent = 0.0;
    if (systemDelta > 0.0 && cpuDelta > 0.0) {
      final double onlineCpus = cpuStats.cpuUsage().percpuUsage().stream().filter(cpuUsage -> cpuUsage >= 1).count();
      assert onlineCpus == getOnlineCpus(cpuStats.cpuUsage().percpuUsage());
      cpuPercent = (cpuDelta / systemDelta) * onlineCpus * 100.0;
    }
    return cpuPercent;
  }

  //TODO apagar
  private int getOnlineCpus(List<Long> perCpuUsage) {
    var count = 0;
    for (Long cpuUsage : perCpuUsage) {
      if (cpuUsage < 1) {
        break;
      }
      count++;
    }
    return count;
  }

  private double getContainerRamPercent(MemoryStats memStats) {
    return memStats.limit() < 1 ? 0.0 : (memStats.usage().doubleValue() / memStats.limit().doubleValue()) * 100.0;
  }

}
