package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.data.util.Pair;

import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.entities.DockerSimpleNode;
import andre.replicationmigration.entities.HostDetails;
import andre.replicationmigration.model.MonitoringHostLog;
import andre.replicationmigration.model.rules.ComponentDecisionHostLog;
import andre.replicationmigration.model.rules.HostEventLog;
import andre.replicationmigration.services.metrics.HostMetricsService;
import andre.replicationmigration.services.rules.RuleDataService;
import andre.replicationmigration.services.rules.RuleService;
import andre.replicationmigration.util.rules.HostDecisionResult;
import andre.replicationmigration.util.rules.HostEvent;
import andre.replicationmigration.util.rules.RuleDecision;

@Service
public class HostMonitoringService {

    // Host minimum logs to start applying rules
    private static final int HOST_MINIMUM_LOGS_COUNT = 1;

    // Delay to stop hosts
    private static final int DELAY_STOP_HOST = 60 * 1000;

    private int hostMonitorInterval;
    private int hostEventLogsCount;
    private long timerScheduleCount;
    private int minHosts;
    private int maxHosts;

    private Timer monitorHostTimer;

    @Autowired
    private DockerCore dockerCore;

    @Autowired
    private DockerServiceApi dockerService;

    @Autowired
    private MonitoringDataService monitoringDataService;

    @Autowired
    private RuleService ruleService;

    @Autowired
    private RuleDataService ruleDataService;

    @Autowired
    private HostService hostService;

    @Autowired
    private HostMetricsService hostMetricsService;

    @Autowired
    private ServicesConfigsService servicesConfigService;

    @Autowired
    public HostMonitoringService(@Value("${replic.prop.host-monitor-interval}") int hostMonitorInterval,
            @Value("${replic.prop.host-event-logs-count}") int hostEventLogsCount,
            @Value("${replic.prop.min-hosts}") int minHosts, @Value("${replic.prop.max-hosts}") int maxHosts) {
        this.hostMonitorInterval = hostMonitorInterval;
        this.hostEventLogsCount = hostEventLogsCount;
        this.minHosts = minHosts;
        this.maxHosts = maxHosts;
        this.monitorHostTimer = new Timer("monitorHostTimer", true);
        this.timerScheduleCount = 0;
    }

    public void initHostMonitorTimer() {
        long delay = timerScheduleCount == 0 ? hostMonitorInterval : 0;
        monitorHostTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                try {
                    monitorHostsTask();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, delay, hostMonitorInterval);
        timerScheduleCount++;
    }

    private void monitorHostsTask() {
        List<DockerSimpleNode> nodes = dockerCore.getAvailableNodes();
        List<HostDecisionResult> decisions = new ArrayList<>(nodes.size());
        for (DockerSimpleNode node : nodes) {
            List<MonitoringHostLog> oldFields = monitoringDataService.getMonitoringHostLogsByHostname(node.getHostname());
            Map<String, Double> newFields = hostMetricsService.getHostStats(node.getHostname());
            HostEvent hostEvent = new HostEvent(node.getHostname());
            int fieldsSet = 0;
            for (MonitoringHostLog oldField : oldFields) {
                if (oldField.getCount() >= HOST_MINIMUM_LOGS_COUNT) {
                    Double currentValue = newFields.get(oldField.getField());
                    if (currentValue != null) {
                        double average = oldField.getSumValue() / (oldField.getCount() * 1.0);
                        double deviationVal = HostMetricsService.getDeviationPercent(average, currentValue);
                        double deviationValLast = HostMetricsService.getDeviationPercent(oldField.getLastValue(),
                                currentValue);
                        hostEvent.getFields().put(oldField.getField() + "-deviation-%-on-avg-val", deviationVal);
                        hostEvent.getFields().put(oldField.getField() + "-effective-val", currentValue);
                        hostEvent.getFields().put(oldField.getField() + "-avg-val", average);
                        hostEvent.getFields().put(oldField.getField() + "-deviation-%-on-last-val", deviationValLast);
                        fieldsSet += 4;
                    }
                }
            }
            if (fieldsSet > 0) {
                HostDecisionResult hostDecisionRes = ruleService.executeHostEvent(node.getHostname(), hostEvent);
                decisions.add(hostDecisionRes);
            }
            if (!newFields.isEmpty())
                monitoringDataService.saveMonitoringHostLogs(node.getHostname(), newFields);
        }
        processHostDecisions(nodes, decisions);
    }

    private void processHostDecisions(List<DockerSimpleNode> nodes, List<HostDecisionResult> decisions) {
        if (!decisions.isEmpty()) {
            List<HostDecisionResult> finalDecisions = new ArrayList<>();
            System.out.println("-> Processing host decisions...");
            for (HostDecisionResult hostDecision : decisions) {
                RuleDecision.Decision decision = hostDecision.getDecision();
                System.out.println("   Hostname: " + hostDecision.getHostname() + " ; decision: " + decision);
                HostEventLog hostEventLog = ruleDataService.saveHostEventLog(hostDecision.getHostname(),
                        decision.toString());
                if (!decision.equals(RuleDecision.Decision.NONE)) {
                    if (hostEventLog.getCount() >= hostEventLogsCount) {
                        saveComponentDecisionHostLog(hostDecision.getHostname(), decision.toString(),
                                hostDecision.getRuleId(), hostDecision.getFields());
                        finalDecisions.add(hostDecision);
                    }
                }
            }
            processFinalHostDecisions(nodes, finalDecisions);
        }
    }

    private void processFinalHostDecisions(List<DockerSimpleNode> nodes, List<HostDecisionResult> finalDecisions) {
        Collections.sort(finalDecisions);
        if (!finalDecisions.isEmpty()) {
            HostDecisionResult firstHostDecision = finalDecisions.get(0);
            if (firstHostDecision.getDecision().equals(RuleDecision.Decision.START)) {
                startHost(nodes, firstHostDecision.getHostname());
            } else if (firstHostDecision.getDecision().equals(RuleDecision.Decision.STOP)) {
                stopHost(nodes, finalDecisions);
            }
        } else {
            // All decisions == NONE
        }

    }

    private void startHost(List<DockerSimpleNode> nodes, String hostname) {
        if (nodes.size() < maxHosts || maxHosts == 0) {
            HostDetails hostDetails = hostService.getHostDetails(hostname);
            Pair<String, String> container = getRandomContainerToMigrate(hostname);
            double serviceAvgMem = servicesConfigService.getServiceLaunchConfig(container.getFirst()).getAvgMem();
            String toHostname = hostService.getAvailableNode(hostDetails.getRegion(), hostDetails.getCountry(),
                    hostDetails.getCity(), serviceAvgMem);

            if (!container.getSecond().equals("")) {
                dockerService.migrateContainer(hostname, container.getSecond(), toHostname);
            }
        }
    }

    private void stopHost(List<DockerSimpleNode> nodes, List<HostDecisionResult> finalDecisions) {
        String hostToRemove = "";
        if (nodes.size() > minHosts) {
            for (int i = finalDecisions.size() - 1; i >= 0; i--) {
                HostDecisionResult decision = finalDecisions.get(i);
                if (!getHostRole(decision.getHostname(), nodes).equals("manager")) {
                    hostToRemove = decision.getHostname();
                    break;
                }
            }
            String toHostname = getHostToMigrate(hostToRemove, nodes);
            int migratedContainers = migrateAllContainers(hostToRemove, toHostname);
            final String hostToRemoveFinal = hostToRemove;
            Timer timer = new Timer();
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    hostService.removeHostFromSwarm(hostToRemoveFinal);
                }
            }, migratedContainers * DELAY_STOP_HOST);
        }
    }

    private String getHostRole(String hostname, List<DockerSimpleNode> nodes) {
        for (DockerSimpleNode node : nodes) {
            if (node.getHostname().equals(hostname))
                return node.getRole();
        }
        return "";
    }

    private String getHostToMigrate(String hostToRemove, List<DockerSimpleNode> nodes) {
        String hostname = "";
        for (int i = 0; i < nodes.size(); i++) {
            DockerSimpleNode node = nodes.get(i);
            if (!node.getHostname().equals(hostToRemove)) {
                hostname = node.getHostname();
                String fromRegion = hostService.getHostDetails(hostToRemove).getRegion();
                String toRegion = hostService.getHostDetails(node.getHostname()).getRegion();
                if (fromRegion.equals(toRegion)) {
                    return hostname;
                }
            }
        }
        return hostname;
    }

    private void saveComponentDecisionHostLog(String hostname, String decision, long ruleId,
            Map<String, Double> fields) {
        ComponentDecisionHostLog componentDecisionHostLog = ruleDataService.saveComponentDecisionHostLog(hostname,
                decision, ruleId);
        ruleDataService.saveComponentDecisionValueLogsFromFields(componentDecisionHostLog.getComponentDecisionLog(),
                fields);
    }

    public Pair<String, String> getRandomContainerToMigrate(String hostname) {
        // TODO: Improve container choise
        List<DockerSimpleContainer> hostContainers = dockerCore.getContainers(hostname);
        for (DockerSimpleContainer container : hostContainers) {
            String serviceType = container.getLabels().get("serviceType");
            if (serviceType.equals("backend") || serviceType.equals("frontend")) {
                String serviceName = container.getLabels().get("serviceName");
                return Pair.of(serviceName, container.getId());
            }
        }
        return Pair.of("", "");
    }

    public int migrateAllContainers(String fromHostname, String toHostname) {
        int migratedContainers = 0;
        List<DockerSimpleContainer> hostContainers = dockerCore.getContainers(fromHostname);
        for (DockerSimpleContainer container : hostContainers) {
            String serviceType = container.getLabels().get("serviceType");
            if (serviceType.equals("backend") || serviceType.equals("frontend")) {
                dockerService.migrateContainer(fromHostname, container.getId(), toHostname);
                migratedContainers++;
            }
        }
        return migratedContainers;
    }

}