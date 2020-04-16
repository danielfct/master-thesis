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

package pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring;

import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.SimpleContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.NodesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.NodeRole;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.SimpleNode;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.HostDetails;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.HostFieldAvg;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.HostProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.HostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.HostEvent;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.decision.DecisionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.decision.HostDecisionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.decision.HostDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.RuleDecision;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.event.HostEventEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.rules.hosts.HostRulesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
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

  private final NodesService nodesService;
  private final DockerContainersService dockerContainersService;
  private final HostRulesService hostRulesService;
  private final HostsService hostsService;
  private final HostMetricsService hostMetricsService;
  private final ServicesService servicesService;
  private final HostsEventsService hostsEventsService;
  private final DecisionsService decisionsService;

  private final long monitorInterval;
  private final int startHostOnEventsCount;
  private final int stopHostOnEventsCount;
  private final int maximumHosts;
  private final int minimumHosts;

  public HostsMonitoringService(HostMonitoringRepository hostsMonitoring, NodesService nodesService,
                                DockerContainersService dockerContainersService, HostRulesService hostRulesService,
                                HostsService hostsService, HostMetricsService hostMetricsService,
                                ServicesService servicesService, HostsEventsService hostsEventsService,
                                DecisionsService decisionsService, HostProperties hostProperties) {
    this.nodesService = nodesService;
    this.dockerContainersService = dockerContainersService;
    this.hostRulesService = hostRulesService;
    this.hostsService = hostsService;
    this.hostMetricsService = hostMetricsService;
    this.servicesService = servicesService;
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
    List<HostMonitoringEntity> hostMonitoringLogs = hostsMonitoring.getMonitoringHostLogByHostAndField(hostname, field);
    final HostMonitoringEntity hostMonitoringEntity;
    Timestamp updateTime = Timestamp.from(Instant.now());
    if (hostMonitoringLogs.isEmpty()) {
      hostMonitoringEntity = HostMonitoringEntity.builder()
          .hostname(hostname).field(field).minValue(value).maxValue(value).sumValue(value).lastValue(value).count(1)
          .lastUpdate(updateTime).build();
    } else {
      hostMonitoringEntity = hostMonitoringLogs.get(0);
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
    new Timer("MonitorHostTimer", true).schedule(new TimerTask() {
      @Override
      public void run() {
        monitorHostsTask();
      }
    }, monitorInterval, monitorInterval);
  }

  private void monitorHostsTask() {
    log.info("Starting host monitoring task...");
    var hostDecisions = new LinkedList<HostDecisionResult>();
    List<SimpleNode> nodes = nodesService.getAvailableNodes();
    for (SimpleNode node : nodes) {
      log.info("On {}", node);
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
        : hostRulesService.processHostEvent(hostname, hostEvent);
  }

  //TODO move to decisionsService?
  private void processHostDecisions(List<HostDecisionResult> hostDecisions, List<SimpleNode> nodes) {
    var relevantHostDecisions = new LinkedList<HostDecisionResult>();
    log.info("Processing host decisions...");
    for (HostDecisionResult hostDecision : hostDecisions) {
      String hostname = hostDecision.getHostname();
      RuleDecision decision = hostDecision.getDecision();
      log.info("Hostname '{}' had decision '{}'", hostname, decision);
      HostEventEntity hostEvent = hostsEventsService.saveHostEvent(hostname, decision.toString());
      int hostEventCount = hostEvent.getCount();
      if ((decision == RuleDecision.START && hostEventCount >= startHostOnEventsCount)
          || (decision == RuleDecision.STOP && hostEventCount >= stopHostOnEventsCount)) {
        relevantHostDecisions.add(hostDecision);
        HostDecisionEntity hostDecisionEntity = decisionsService.addHostDecision(
            hostDecision.getHostname(),
            hostDecision.getDecision().name(),
            hostDecision.getRuleId());
        decisionsService.addHostDecisionValueFromFields(hostDecisionEntity, hostDecision.getFields());
      }
    }
    if (!relevantHostDecisions.isEmpty()) {
      processRelevantHostDecisions(relevantHostDecisions, nodes);
    }
  }

  private void processRelevantHostDecisions(List<HostDecisionResult> relevantHostDecisions,
                                            final List<SimpleNode> nodes) {
    Collections.sort(relevantHostDecisions);
    HostDecisionResult topPriorityHostDecision = relevantHostDecisions.get(0);
    RuleDecision decision = topPriorityHostDecision.getDecision();
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
    HostDetails hostDetails = hostsService.getHostDetails(hostname);
    Pair<String, String> container = getRandomContainerToMigrate(hostname);
    String serviceName = container.getFirst();
    String containerId = container.getSecond();
    if (!containerId.isEmpty()) {
      ServiceEntity serviceConfig = servicesService.getService(serviceName);
      double serviceAvgMem = serviceConfig.getExpectedMemoryConsumption();
      String toHostname = hostsService.getAvailableNodeHostname(serviceAvgMem, hostDetails);
      // TODO porquê migrar logo um container?
      dockerContainersService.migrateContainer(containerId, hostname, toHostname);
      log.info("RuleDecision executed: Started host '{}' and migrated container '{}' to it", toHostname, containerId);
    }
  }

  private void stopHost(List<HostDecisionResult> relevantHostDecisions, List<SimpleNode> nodes) {
    //TODO : review stop host
    var stopHostname = "";
    ListIterator<HostDecisionResult> decisionIterator =
        relevantHostDecisions.listIterator(relevantHostDecisions.size());
    while (decisionIterator.hasPrevious()) {
      String hostname = decisionIterator.previous().getHostname();
      if (nodes.stream().anyMatch(n -> n.getHostname().equals(hostname) && n.getRole() != NodeRole.MANAGER)) {
        // Node with least priority that is not a manager
        stopHostname = hostname;
        break;
      }
    }
    String migrateToHostname = getHostToMigrate(stopHostname, nodes);
    List<SimpleContainer> containers = dockerContainersService.migrateContainers(stopHostname, migrateToHostname);
    String hostnameToRemove = stopHostname;
    //TODO os containers não migram em paralelo?
    new Timer("RemoveHostFromSwarmTimer").schedule(new TimerTask() {
      @Override
      public void run() {
        hostsService.removeHost(hostnameToRemove);
      }
    }, containers.size() * DELAY_STOP_HOST);
    //TODO garantir que o host é removido dinamicamente só depois de serem migrados todos os containers
    log.info("RuleDecision executed: Stopped host '{}' and migrated containers to host '{}'",
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
    List<SimpleContainer> hostContainers = dockerContainersService.getAppContainers(hostname);
    if (hostContainers.isEmpty()) {
      return Pair.of("", "");
    }
    SimpleContainer container = hostContainers.get(0);
    return Pair.of(container.getLabels().get(DockerContainer.Label.SERVICE_NAME), container.getId());
  }

}
