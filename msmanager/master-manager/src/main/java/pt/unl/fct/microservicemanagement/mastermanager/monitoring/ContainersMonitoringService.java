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

import pt.unl.fct.microservicemanagement.mastermanager.docker.container.ContainerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.SimpleContainer;
import pt.unl.fct.microservicemanagement.mastermanager.host.HostDetails;
import pt.unl.fct.microservicemanagement.mastermanager.host.HostsService;
import pt.unl.fct.microservicemanagement.mastermanager.location.LocationRequestService;
import pt.unl.fct.microservicemanagement.mastermanager.microservices.ServicesService;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.event.ContainerEvent;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.SimulatedMetricsService;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.ContainerDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.DecisionsService;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.RuleDecision;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.event.ServiceEvent;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RulesService;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import com.spotify.docker.client.messages.ContainerStats;
import com.spotify.docker.client.messages.CpuStats;
import com.spotify.docker.client.messages.MemoryStats;
import com.spotify.docker.client.messages.NetworkStats;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ContainersMonitoringService {

  // Container minimum logs to start applying rules
  private static final int CONTAINER_MINIMUM_LOGS_COUNT = 1;

  private final ContainerMonitoringRepository containersMonitoring;

  private final DockerContainersService dockerContainersService;
  private final ServicesService servicesConfigService;
  private final RulesService rulesService;
  private final ServicesEventsService servicesEventsService;
  private final HostsService hostsService;
  private final LocationRequestService requestLocationMonitoringService;
  private final DecisionsService decisionsService;
  private final SimulatedMetricsService simulatedMetricsService;
  private final TestLogsService testLogsService;

  private final long monitorPeriod;
  private final int stopContainerOnEventCount;
  private final int replicateContainerOnEventCount;
  private final int migrateContainerOnEventCount;

  public ContainersMonitoringService(ContainerMonitoringRepository containersMonitoring,
                                     DockerContainersService dockerContainersService,
                                     ServicesService servicesConfigService, RulesService rulesService,
                                     ServicesEventsService servicesEventsService, HostsService hostsService,
                                     LocationRequestService requestLocationMonitoringService,
                                     DecisionsService decisionsService,
                                     SimulatedMetricsService simulatedMetricsService,
                                     TestLogsService testLogsService,
                                     ContainerProperties containerProperties) {
    this.containersMonitoring = containersMonitoring;
    this.dockerContainersService = dockerContainersService;
    this.servicesConfigService = servicesConfigService;
    this.rulesService = rulesService;
    this.servicesEventsService = servicesEventsService;
    this.hostsService = hostsService;
    this.requestLocationMonitoringService = requestLocationMonitoringService;
    this.decisionsService = decisionsService;
    this.simulatedMetricsService = simulatedMetricsService;
    this.testLogsService = testLogsService;
    this.monitorPeriod = containerProperties.getMonitorPeriod();
    this.stopContainerOnEventCount = containerProperties.getStopContainerOnEventCount();
    this.replicateContainerOnEventCount = containerProperties.getReplicateContainerOnEventCount();
    this.migrateContainerOnEventCount = containerProperties.getMigrateContainerOnEventCount();
  }

  //TODO rename methods to container

  public Iterable<ServiceMonitoring> getMonitoringServiceLogs() {
    return containersMonitoring.findAll();
  }

  public List<ServiceMonitoring> getMonitoringServiceLogs(String containerId) {
    return containersMonitoring.getMonitoringServiceLogByContainer(containerId);
  }

  public ServiceMonitoring getServiceMonitoring(String containerId, String field) {
    return containersMonitoring.getServiceMonitoringByContainerAndField(containerId, field);
  }

  public long saveMonitoringServiceLog(String containerId, String serviceName, String field, double value) {
    final ServiceMonitoring newServiceMonitoring;
    Timestamp updateTime = Timestamp.from(Instant.now());
    ServiceMonitoring previousServiceMonitoring =
        containersMonitoring.getServiceMonitoringByContainerAndField(containerId, field);
    if (previousServiceMonitoring == null) {
      newServiceMonitoring = new ServiceMonitoring(containerId, serviceName, field, value, value, value, value, 1,
          updateTime);
    } else {
      newServiceMonitoring = previousServiceMonitoring;
      newServiceMonitoring.logValue(value, updateTime);
    }
    return containersMonitoring.save(newServiceMonitoring).getId();
  }

  public List<ServiceFieldAvg> getAvgServiceFields(String serviceName) {
    return containersMonitoring.getAvgServiceFields(serviceName);
  }

  public ServiceFieldAvg getAvgServiceField(String serviceName, String field) {
    return containersMonitoring.getAvgServiceField(serviceName, field);
  }

  public List<ContainerFieldAvg> getAvgContainerFields(String containerId) {
    return containersMonitoring.getAvgContainerFields(containerId);
  }

  public ContainerFieldAvg getAvgContainerField(String containerId, String field) {
    return containersMonitoring.getAvgContainerField(containerId, field);
  }

  public List<ServiceMonitoring> getTopContainersByField(List<String> containerIds, String field) {
    return containersMonitoring.getTopContainersByField(containerIds, field);
  }

  public void initContainerMonitorTimer() {
    new Timer("monitorContainersTimer", true).schedule(new TimerTask() {
      private long lastRun = System.currentTimeMillis();
      @Override
      public void run() {
        long currRun = System.currentTimeMillis();
        //TODO replace diffSeconds with calculation from previous database save
        int diffSeconds = (int) ((currRun - lastRun) / TimeUnit.SECONDS.toMillis(1));
        lastRun = currRun;
        monitorContainersTask(diffSeconds);
      }
    }, monitorPeriod, monitorPeriod);
  }

  private void monitorContainersTask(int secondsFromLastRun) {
    log.info("\nStarting container monitoring task...");
    var servicesDecisions = new HashMap<String, List<ContainerDecisionResult>>();
    List<SimpleContainer> containers = dockerContainersService.getAppContainers();
    for (SimpleContainer container : containers) {
      log.info("\nOn {}", container);
      String containerId = container.getId();
      String serviceName = container.getLabels().get(DockerContainer.Label.SERVICE_NAME);
      String serviceHostname = container.getHostname();
      final Map<String, Double> newFields = getContainerStats(container, secondsFromLastRun);
      newFields.forEach((field, value) -> {
        saveMonitoringServiceLog(containerId, serviceName, field, value);
        //TODO utilidade?
        testLogsService.saveMonitoringServiceLogTests(containerId, serviceName, field, value);
      });
      long appId = servicesConfigService.getAppByServiceName(serviceName).getId();
      final var containerDecisionResult = runAppRules(appId, serviceHostname, containerId, serviceName, newFields);
      var serviceDecisions = servicesDecisions.get(serviceName);
      if (serviceDecisions != null) {
        serviceDecisions.add(containerDecisionResult);
      } else {
        serviceDecisions = new LinkedList<>(List.of(containerDecisionResult));
        servicesDecisions.put(serviceName, serviceDecisions);
      }
    }
    processContainerDecisions(servicesDecisions, secondsFromLastRun);
  }

  private ContainerDecisionResult runAppRules(long appId, String serviceHostname, String containerId,
                                              String serviceName, Map<String, Double> newFields) {
    List<ServiceMonitoring> loggedFields = getMonitoringServiceLogs(containerId);
    var containerEvent = new ContainerEvent(containerId, serviceName);
    Map<String, Double> containerEventFields = containerEvent.getFields();
    for (var loggedField : loggedFields) {
      long count = loggedField.getCount();
      if (count < CONTAINER_MINIMUM_LOGS_COUNT) {
        continue;
      }
      String field = loggedField.getField();
      Double newValue = newFields.get(field);
      if (newValue == null) {
        continue;
      }
      containerEventFields.put(field + "-effective-val", newValue);
      //TODO conta com este newValue?
      final var sumValue = loggedField.getSumValue();
      final double average = sumValue / (count * 1.0);
      containerEventFields.put(field + "-avg-val", average);
      final double deviationFromAvgValue = ((newValue - average) / average) * 100;
      containerEventFields.put(field + "-deviation-%-on-avg-val", deviationFromAvgValue);
      final var lastValue = loggedField.getLastValue();
      final double deviationFromLastValue = ((newValue - lastValue) / lastValue) * 100;
      containerEventFields.put(field + "-deviation-%-on-last-val", deviationFromLastValue);
    }
    return containerEventFields.isEmpty()
        ? new ContainerDecisionResult(serviceHostname, containerId, serviceName)
        : rulesService.processContainerEvent(appId, serviceHostname, containerEvent);
  }

  private void processContainerDecisions(Map<String, List<ContainerDecisionResult>> servicesDecisions,
                                         int secondsFromLastRun) {
    log.info("\nProcessing container decisions...");
    var relevantServicesDecisions = new HashMap<String, List<ContainerDecisionResult>>();
    for (List<ContainerDecisionResult> serviceDecisions : servicesDecisions.values()) {
      for (ContainerDecisionResult containerDecision : serviceDecisions) {
        String serviceName = containerDecision.getServiceName();
        String containerId = containerDecision.getContainerId();
        RuleDecision decision = containerDecision.getDecision();
        log.info("\nServiceName '{}' on containerId '{}' had decision '{}'", serviceName, containerId, decision);
        ServiceEvent serviceEvent =
            servicesEventsService.saveServiceEvent(containerId, serviceName, decision.toString());
        int serviceEventCount = serviceEvent.getCount();
        if (decision == RuleDecision.STOP && serviceEventCount >= stopContainerOnEventCount
            || decision == RuleDecision.REPLICATE && serviceEventCount >= replicateContainerOnEventCount
            || decision == RuleDecision.MIGRATE && serviceEventCount >= migrateContainerOnEventCount) {
          var relevantServiceDecisions = relevantServicesDecisions.get(serviceName);
          if (relevantServiceDecisions != null) {
            relevantServiceDecisions.add(containerDecision);
          } else {
            relevantServiceDecisions = new ArrayList<>(List.of(containerDecision));
            relevantServicesDecisions.put(serviceName, relevantServiceDecisions);
          }
        }
      }
    }
    if (!relevantServicesDecisions.isEmpty()) {
      processRelevantContainerDecisions(relevantServicesDecisions, servicesDecisions, secondsFromLastRun);
    }
  }

  private void processRelevantContainerDecisions(Map<String, List<ContainerDecisionResult>> relevantServicesDecisions,
                                                 Map<String, List<ContainerDecisionResult>> allServicesDecisions,
                                                 int secondsFromLastRun) {
    final Map<String, HostDetails> servicesLocationsRegions =
        requestLocationMonitoringService.getBestLocationToStartServices(allServicesDecisions, secondsFromLastRun);
    for (Entry<String, List<ContainerDecisionResult>> servicesDecisions : allServicesDecisions.entrySet()) {
      final var serviceName = servicesDecisions.getKey();
      final var containerDecisions = servicesDecisions.getValue();
      final var relevantContainerDecisions = relevantServicesDecisions.getOrDefault(serviceName, new ArrayList<>());
      final var currentReplicas = containerDecisions.size();
      final var minimumReplicas = servicesConfigService.getMinReplicsByServiceName(serviceName);
      final var maximumReplicas = servicesConfigService.getMaxReplicsByServiceName(serviceName);
      if (currentReplicas < minimumReplicas) {
        startContainer(containerDecisions, relevantContainerDecisions, servicesLocationsRegions);
      } else if (!relevantContainerDecisions.isEmpty()) {
        Collections.sort(relevantContainerDecisions);
        final var topPriorityDecisionResult = relevantContainerDecisions.get(0);
        final var topPriorityDecision = topPriorityDecisionResult.getDecision();
        if (topPriorityDecision == RuleDecision.REPLICATE) {
          if (maximumReplicas == 0 || currentReplicas < maximumReplicas) {
            startContainer(topPriorityDecisionResult, servicesLocationsRegions);
          }
        } else if (topPriorityDecision == RuleDecision.STOP) {
          if (currentReplicas > minimumReplicas) {
            final var leastPriorityContainer = relevantContainerDecisions.get(relevantContainerDecisions.size() - 1);
            stopContainer(leastPriorityContainer);
          }
        }
      }
    }
  }

  private void startContainer(List<ContainerDecisionResult> allContainersDecisions,
                              List<ContainerDecisionResult> relevantContainersDecisions,
                              Map<String, HostDetails> servicesLocationsRegions) {
    Optional<ContainerDecisionResult> containerDecision = Optional.empty();
    if (!relevantContainersDecisions.isEmpty()) {
      Collections.sort(relevantContainersDecisions);
      final var topPriorityContainerDecision = relevantContainersDecisions.get(0);
      if (topPriorityContainerDecision.getDecision() == RuleDecision.REPLICATE) {
        containerDecision = Optional.of(topPriorityContainerDecision);
      }
    }
    if (containerDecision.isEmpty()) {
      Collections.sort(allContainersDecisions);
      containerDecision = allContainersDecisions.stream()
          .filter(d -> d.getDecision() == RuleDecision.REPLICATE)
          .findFirst();
      if (containerDecision.isEmpty()) {
        containerDecision = allContainersDecisions.stream()
            .filter(d -> d.getDecision() == RuleDecision.NONE)
            .findFirst();
      }
    }
    containerDecision.ifPresent(containerDecisionResult ->
        startContainer(containerDecisionResult, servicesLocationsRegions));
  }

  private void startContainer(ContainerDecisionResult topPriorityContainerDecision,
                              final Map<String, HostDetails> servicesLocationsRegions) {
    final var containerId = topPriorityContainerDecision.getContainerId();
    final var hostname = topPriorityContainerDecision.getHostname();
    final var serviceName = topPriorityContainerDecision.getServiceName();
    final HostDetails startLocation;
    if (servicesLocationsRegions.containsKey(serviceName)) {
      startLocation = servicesLocationsRegions.get(serviceName);
      log.info("\nStarting service '{}'. Location from request-location-monitor: '{}' ({})",
          serviceName, hostname, startLocation.getRegion());
    } else {
      startLocation = hostsService.getHostDetails(hostname);
      log.info("\nStarting service '{}'. Location: '{}' ({})",
          serviceName, hostname, startLocation.getRegion());
    }
    final var serviceAvgMem = servicesConfigService.getServiceLaunchConfig(serviceName).getExpectedMemoryConsumption();
    final var toHostname = hostsService.getAvailableNodeHostname(serviceAvgMem, startLocation);
    final var replicatedContainerId = dockerContainersService.replicateContainer(containerId, hostname, toHostname);
    final var selectedHostDetails = hostsService.getHostDetails(toHostname);
    log.info("\nRuleDecision executed: Replicated container '{}' of service '{}' to container '{}' "
            + "on host '{} ({}_{}_{})'",
        containerId, serviceName, replicatedContainerId, toHostname, selectedHostDetails.getRegion(),
        selectedHostDetails.getCountry(), selectedHostDetails.getCity());
    /*if (selectedHostDetails instanceof EdgeHostDetails) {
      final var edgeHostDetails = (EdgeHostDetails) selectedHostDetails;
      log.info("\nRuleDecision executed: Replicated container '{}' of service '{}' to container '{}' " +
              "on edge host '{} ({}_{}_{})'",
          containerId, serviceName, replicatedContainerId, toHostname, edgeHostDetails.getRegion(),
          edgeHostDetails.getCountry(), edgeHostDetails.getCity());
    } else if (selectedHostDetails instanceof AwsHostDetails) {
      final var awsHostDetails = (AwsHostDetails) selectedHostDetails;
      log.info("\nRuleDecision executed: Replicated container '{}' of service '{}' to  container '{}' " +
              "on aws host '{} ({})'",
          containerId, serviceName, replicatedContainerId, toHostname, awsHostDetails.getRegion());
    }*/
    saveComponentDecisionService(hostname, selectedHostDetails, topPriorityContainerDecision);
  }

  private void stopContainer(ContainerDecisionResult leastPriorityContainerDecision) {
    final var containerId = leastPriorityContainerDecision.getContainerId();
    final var hostname = leastPriorityContainerDecision.getHostname();
    final var serviceName = leastPriorityContainerDecision.getServiceName();
    dockerContainersService.stopContainer(containerId, hostname);
    final var selectedHostDetails = hostsService.getHostDetails(hostname);
    log.info("\nRuleDecision executed: Stopped container '{}' of service '{}' on edge host '{} ({}_{}_{})'",
        containerId, serviceName, hostname, selectedHostDetails.getRegion(), selectedHostDetails.getCountry(),
        selectedHostDetails.getCity());
    /*if (selectedHostDetails instanceof EdgeHostDetails) {
      final var edgeHostDetails = (EdgeHostDetails) selectedHostDetails;
      log.info("\nRuleDecision executed: Stopped container '{}' of service '{}' on edge host '{} ({}_{}_{})'",
          containerId, serviceName, hostname, edgeHostDetails.getRegion(), edgeHostDetails.getCountry(),
          edgeHostDetails.getCity());
    } else if (selectedHostDetails instanceof AwsHostDetails) {
      final var awsHostDetails = (AwsHostDetails) selectedHostDetails;
      log.info("\nRuleDecision executed: Stopped container '{}' of service '{}' on aws host '{} ({})'",
          containerId, serviceName, hostname, awsHostDetails.getRegion());
    }*/
    saveComponentDecisionService(hostname, selectedHostDetails, leastPriorityContainerDecision);
  }

  private void saveComponentDecisionService(String hostname, HostDetails host,
                                            final ContainerDecisionResult containerDecision) {
    /* final String hostname = host.getHostname();*/
    final String containerId = containerDecision.getContainerId();
    final String serviceName = containerDecision.getServiceName();
    final String decision = containerDecision.getDecision().toString();
    final long ruleId = containerDecision.getRuleId();
    final Map<String, Double> fields = containerDecision.getFields();
    var otherInfo = "";
    otherInfo = String.format("RuleDecision on host: %s (%s_%s_%s)", hostname,
        host.getRegion(), host.getCountry(), host.getCity());
    /*if (host instanceof EdgeHostDetails) {
      final var edgeHostDetails = (EdgeHostDetails)host;
      otherInfo = String.format("RuleDecision on Edge host: %s (%s_%s_%s)", hostname,
          edgeHostDetails.getRegion(), edgeHostDetails.getCountry(), edgeHostDetails.getCity());
    } else if (host instanceof AwsHostDetails) {
      final var awsHostDetails = (AwsHostDetails)host;
      otherInfo = String.format("RuleDecision on Aws host: %s (%s)", hostname, awsHostDetails.getRegion());
    }*/
    servicesEventsService.resetServiceEvent(serviceName);
    final var componentDecisionServiceLog =
        decisionsService.saveComponentDecisionServiceLog(containerId, serviceName, decision, ruleId, otherInfo);
    decisionsService.saveComponentDecisionValueLogsFromFields(componentDecisionServiceLog.getComponentDecisionLog(),
        fields);
  }


  //TODO from containerMetricsService


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
      Map<String, Double> simulatedFields = simulatedMetricsService.getContainerFieldsValue(serviceName, containerId);
      fields.putAll(simulatedFields);
    }
    // Calculated metrics
    //TODO use monitoring previous update to calculate interval, instead of passing through argument
    Map.of("rx-bytes", rxBytes, "tx-bytes", txBytes).forEach((field, value) -> {
      ServiceMonitoring monitoring = getServiceMonitoring(containerId, field);
      double lastValue = monitoring == null ? 0 : monitoring.getLastValue();
      double bytesPerSec = Math.max(0, (value - lastValue) / secondsInterval);
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
