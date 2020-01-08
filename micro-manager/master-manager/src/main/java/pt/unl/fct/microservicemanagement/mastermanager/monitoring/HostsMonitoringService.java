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
import pt.unl.fct.microservicemanagement.mastermanager.docker.swarm.node.DockerNodesService;
import pt.unl.fct.microservicemanagement.mastermanager.docker.swarm.node.NodeRole;
import pt.unl.fct.microservicemanagement.mastermanager.docker.swarm.node.SimpleNode;
import pt.unl.fct.microservicemanagement.mastermanager.host.HostFieldAvg;
import pt.unl.fct.microservicemanagement.mastermanager.host.HostProperties;
import pt.unl.fct.microservicemanagement.mastermanager.host.HostsService;
import pt.unl.fct.microservicemanagement.mastermanager.microservices.ServicesService;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.event.HostEvent;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.DecisionsService;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RulesService;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.HostDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.RuleDecision;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Timer;
import java.util.TimerTask;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class HostsMonitoringService {

  private static final double PERCENTAGE = 0.01;
  private static final int HOST_MINIMUM_LOGS_COUNT = 1;
  private static final int DELAY_STOP_HOST = 60 * 1000;

  private final HostMonitoringRepository hostsMonitoring;

  private final DockerNodesService dockerNodesService;
  private final DockerContainersService dockerContainersService;
  private final RulesService rulesService;
  private final HostsService hostsService;
  private final HostMetricsService hostMetricsService;
  private final ServicesService servicesConfigService;
  private final HostsEventsService hostsEventsService;
  private final DecisionsService decisionsService;

  private final long monitorInterval;
  private final int startHostOnEventsCount;
  private final int stopHostOnEventsCount;
  private final int maximumHosts;
  private final int minimumHosts;

  public HostsMonitoringService(HostMonitoringRepository hostsMonitoring,
                                final DockerNodesService dockerNodesService,
                                final DockerContainersService dockerContainersService,
                                final RulesService rulesService,
                                final HostsService hostsService,
                                final HostMetricsService hostMetricsService,
                                final ServicesService servicesConfigService,
                                final HostsEventsService hostsEventsService,
                                final DecisionsService decisionsService,
                                final HostProperties hostProperties) {
    this.dockerNodesService = dockerNodesService;
    this.dockerContainersService = dockerContainersService;
    this.rulesService = rulesService;
    this.hostsService = hostsService;
    this.hostMetricsService = hostMetricsService;
    this.servicesConfigService = servicesConfigService;
    this.hostsEventsService = hostsEventsService;
    this.decisionsService = decisionsService;
    this.hostsMonitoring = hostsMonitoring;
    this.monitorInterval = hostProperties.getMonitorPeriod();
    this.startHostOnEventsCount = hostProperties.getStartHostOnEventsCount();
    this.stopHostOnEventsCount = hostProperties.getStopHostOnEventsCount();
    this.maximumHosts = hostProperties.getMaximumHosts();
    this.minimumHosts = hostProperties.getMinimumHosts();
  }

  public Iterable<HostMonitoringEntity> getMonitoringHostLogs() {
    return hostsMonitoring.findAll();
  }

  List<HostMonitoringEntity> getMonitoringHostLogsByHostname(String hostname) {
    return hostsMonitoring.getMonitoringHostLogByHost(hostname);
  }

  public long saveMonitoringHostLog(String hostname, String field, double value) {
    final var monitoringHostLogs = hostsMonitoring.getMonitoringHostLogByHostAndField(hostname, field);
    final HostMonitoringEntity hostMonitoringEntity;
    final var updateTime = Timestamp.from(Instant.now());
    if (monitoringHostLogs.isEmpty()) {
      hostMonitoringEntity = new HostMonitoringEntity(hostname, field, value, value, value, value, 1, updateTime);
    } else {
      hostMonitoringEntity = monitoringHostLogs.get(0);
      hostMonitoringEntity.logValue(value, updateTime);
    }
    return hostsMonitoring.save(hostMonitoringEntity).getId();
  }

  public List<HostFieldAvg> getAvgHostFields(String hostname) {
    return hostsMonitoring.getAvgHostFields(hostname);
  }

  public HostFieldAvg getAvgHostField(String hostname, String field) {
    return hostsMonitoring.getAvgHostField(hostname, field);
  }

  public void initHostMonitorTimer() {
    new Timer("monitorHostTimer", true).schedule(new TimerTask() {
      @Override
      public void run() {
        monitorHostsTask();
      }
    }, monitorInterval, monitorInterval);
  }

  private void monitorHostsTask() {
    log.info("\nStarting host monitoring task...");
    var hostDecisions = new LinkedList<HostDecisionResult>();
    var nodes = dockerNodesService.getAvailableNodes();
    for (SimpleNode node : nodes) {
      log.info("\nOn {}", node);
      String hostname = node.getHostname();
      Map<String, Double> newFields = hostMetricsService.getHostStats(hostname);
      newFields.forEach((field, value) -> saveMonitoringHostLog(hostname, field, value));
      HostDecisionResult hostDecisionResult = runHostRules(hostname, newFields);
      hostDecisions.add(hostDecisionResult);
    }
    if (!hostDecisions.isEmpty()) {
      processHostDecisions(hostDecisions, nodes);
    }
  }

  private HostDecisionResult runHostRules(String hostname, Map<String, Double> newFields) {
    var hostEvent = new HostEvent(hostname);
    Map<String, Double> hostEventFields = hostEvent.getFields();
    getMonitoringHostLogsByHostname(hostname)
        .stream()
        .filter(loggedField -> loggedField.getCount() >= HOST_MINIMUM_LOGS_COUNT
            && newFields.get(loggedField.getField()) != null)
        .forEach(loggedField -> {
          long count = loggedField.getCount();
          String field = loggedField.getField();
          //TODO conta com este newValue?
          double sumValue = loggedField.getSumValue();
          double lastValue = loggedField.getLastValue();
          double newValue = newFields.get(field);
          hostEventFields.put(field + "-effective-val", newValue);
          double average = sumValue / (count * 1.0);
          hostEventFields.put(field + "-avg-val", average);
          double deviationFromAvgValue = ((newValue - average) / average) / PERCENTAGE;
          hostEventFields.put(field + "-deviation-%-on-avg-val", deviationFromAvgValue);
          double deviationFromLastValue = ((newValue - lastValue) / lastValue) / PERCENTAGE;
          hostEventFields.put(field + "-deviation-%-on-last-val", deviationFromLastValue);
        });
    return hostEventFields.isEmpty()
        ? new HostDecisionResult(hostname)
        : rulesService.processHostEvent(hostname, hostEvent);
  }

  private void processHostDecisions(List<HostDecisionResult> hostDecisions, List<SimpleNode> nodes) {
    final var relevantHostDecisions = new LinkedList<HostDecisionResult>();
    log.info("\nProcessing host decisions...");
    for (HostDecisionResult hostDecision : hostDecisions) {
      final var hostname = hostDecision.getHostname();
      final var decision = hostDecision.getDecision();
      log.info("\nHostname '{}' had decision '{}'", hostname, decision);
      final var hostEvent = hostsEventsService.saveHostEvent(hostname, decision.toString());
      final var hostEventCount = hostEvent.getCount();
      if ((decision == RuleDecision.START && hostEventCount >= startHostOnEventsCount)
          || (decision == RuleDecision.STOP && hostEventCount >= stopHostOnEventsCount)) {
        relevantHostDecisions.add(hostDecision);
        saveComponentDecisionHostLog(hostDecision);
      }
    }
    if (!relevantHostDecisions.isEmpty()) {
      processRelevantHostDecisions(relevantHostDecisions, nodes);
    }
  }

  private void processRelevantHostDecisions(List<HostDecisionResult> relevantHostDecisions,
                                            final List<SimpleNode> nodes) {
    Collections.sort(relevantHostDecisions);
    final var topPriorityHostDecision = relevantHostDecisions.get(0);
    final var decision = topPriorityHostDecision.getDecision();
    if (decision == RuleDecision.START) {
      if (maximumHosts <= 0 || nodes.size() < maximumHosts) {
        startHost(topPriorityHostDecision.getHostname());
      }
    } else if (decision == RuleDecision.STOP) {
      if (nodes.size() > minimumHosts) {
        stopHost(relevantHostDecisions, nodes);
      }
    }
  }

  private void startHost(String hostname) {
    final var hostDetails = hostsService.getHostDetails(hostname);
    final Pair<String, String> container = getRandomContainerToMigrate(hostname);
    final var serviceName = container.getFirst();
    final var containerId = container.getSecond();
    if (!containerId.isEmpty()) {
      pt.unl.fct.microservicemanagement.mastermanager.microservices.Service serviceConfig =
          servicesConfigService.getServiceLaunchConfig(serviceName);
      double serviceAvgMem = serviceConfig.getExpectedMemoryConsumption();
      final String toHostname = hostsService.getAvailableNodeHostname(serviceAvgMem, hostDetails);
      // TODO porquê migrar logo um container?
      dockerContainersService.migrateContainer(containerId, hostname, toHostname);
      log.info("\nRuleDecision executed: Started host '{}' and migrated container '{}' to it", toHostname, containerId);
    }
  }

  private void stopHost(List<HostDecisionResult> relevantHostDecisions, List<SimpleNode> nodes) {
    //TODO : review stop host
    var stopHostname = "";
    final var decisionIterator = relevantHostDecisions.listIterator(relevantHostDecisions.size());
    while (decisionIterator.hasPrevious()) {
      final var hostname = decisionIterator.previous().getHostname();
      if (nodes.stream().anyMatch(n -> n.getHostname().equals(hostname) && n.getRole() != NodeRole.MANAGER)) {
        // Node with least priority that is not a manager
        stopHostname = hostname;
        break;
      }
    }
    final var migrateToHostname = getHostToMigrate(stopHostname, nodes);
    final var containerIds = dockerContainersService.migrateContainers(stopHostname, migrateToHostname);
    final var hostnameToRemove = stopHostname;
    //TODO os containers não migram em paralelo?
    new Timer("removeHostFromSwarmTimer").schedule(new TimerTask() {
      @Override
      public void run() {
        hostsService.removeHost(hostnameToRemove);
      }
    }, containerIds.size() * DELAY_STOP_HOST);
    //TODO garantir que o host é removido dinamicamente só depois de serem migrados todos os containers
    log.info("\nRuleDecision executed: Stopped host '{}' and migrated containers to host '{}'",
        stopHostname, migrateToHostname);
  }

  private String getHostToMigrate(String hostToRemove, List<SimpleNode> nodes) {
    //TODO e se não existir mais nenhum node na mesma zona?
    return nodes.stream()
        .filter(n -> !n.getHostname().equals(hostToRemove)
            && Objects.equals(hostsService.getHostDetails(hostToRemove).getRegion(),
                hostsService.getHostDetails(n.getHostname()).getRegion()))
        .map(SimpleNode::getHostname)
        .findFirst()
        .orElseThrow(() -> new StopHostException("Failed to find new host to migrate containers to."));
  }

  private Pair<String, String> getRandomContainerToMigrate(String hostname) {
    // TODO: Improve container choice
    final List<SimpleContainer> hostContainers = dockerContainersService.getAppContainers(hostname);
    if (hostContainers.isEmpty()) {
      return Pair.of("", "");
    }
    final var container = hostContainers.get(0);
    return Pair.of(container.getLabels().get(DockerContainer.Label.SERVICE_NAME), container.getId());
  }

  private void saveComponentDecisionHostLog(HostDecisionResult hostDecision) {
    final var hostname = hostDecision.getHostname();
    final var decision = hostDecision.getDecision().toString();
    final var ruleId = hostDecision.getRuleId();
    final var fields = hostDecision.getFields();
    final var componentDecisionHostLog = decisionsService.saveComponentDecisionHostLog(hostname, decision, ruleId);
    decisionsService.saveComponentDecisionValueLogsFromFields(componentDecisionHostLog.getComponentDecisionLog(),
        fields);
  }

}
