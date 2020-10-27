package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.entities.HostDetails;
import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.model.MonitoringServiceLog;
import andre.replicationmigration.model.rules.ComponentDecisionServiceLog;
import andre.replicationmigration.model.rules.ServiceEventLog;
import andre.replicationmigration.reqlocationmonitor.RequestLocationMonitoringService;
import andre.replicationmigration.services.metrics.ContainerMetricsService;
import andre.replicationmigration.services.rules.RuleDataService;
import andre.replicationmigration.services.rules.RuleService;
import andre.replicationmigration.util.rules.ContainerDecisionResult;
import andre.replicationmigration.util.rules.ContainerEvent;
import andre.replicationmigration.util.rules.RuleDecision;

@Service
public class ContainerMonitoringService {

    private static Logger log = LoggerFactory.getLogger(ContainerMonitoringService.class);

    // Container minimum logs to start applying rules
    private static final int CONTAINER_MINIMUM_LOGS_COUNT = 1;

    private int containerMonitorInterval;
    private int containerEventLogsCountStop;
    private int containerEventLogsCountRepMig;
    private long timerScheduleCount;

    private Timer monitorContainersTimer;

    @Autowired
    private DockerCore dockerCore;

    @Autowired
    private DockerServiceApi docker;

    @Autowired
    private MonitoringDataService monitoringDataService;

    @Autowired
    private ServicesConfigsService servicesConfigService;

    @Autowired
    private RuleService ruleService;

    @Autowired
    private RuleDataService ruleDataService;

    @Autowired
    private ContainerMetricsService containerMetricsService;

    @Autowired
    private HostService hostService;

    @Autowired
    private RequestLocationMonitoringService requestLocationMonitoringService;

    @Autowired
    public ContainerMonitoringService(@Value("${replic.prop.container-monitor-interval}") int containerMonitorInterval,
            @Value("${replic.prop.container-event-logs-count-stop}") int containerEventLogsCountStop,
            @Value("${replic.prop.container-event-logs-count-rep-mig}") int containerEventLogsCountRepMig) {
        this.containerMonitorInterval = containerMonitorInterval;
        this.containerEventLogsCountStop = containerEventLogsCountStop;
        this.containerEventLogsCountRepMig = containerEventLogsCountRepMig;
        this.monitorContainersTimer = new Timer("monitorContainersTimer", true);
        this.timerScheduleCount = 0;
    }

    public void initContainerMonitorTimer() {
        long delay = timerScheduleCount == 0 ? containerMonitorInterval : 0;
        monitorContainersTimer.schedule(new TimerTask() {
            long lastRun = System.currentTimeMillis();
            @Override
            public void run() {
                try {
                    long currRun = System.currentTimeMillis();
                    int diffSeconds = (int)((currRun - lastRun) / 1000);
                    lastRun = currRun;
                    monitorContainersTask(diffSeconds);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, delay, containerMonitorInterval);
        timerScheduleCount++;
    }

    private void monitorContainersTask(int secondsFromLastRun) {
        List<DockerSimpleContainer> containers = dockerCore.getContainers();
        Map<String, List<ContainerDecisionResult>> decisions = new HashMap<>();

        for (DockerSimpleContainer container : containers) {
            String serviceType = container.getLabels().get("serviceType");
            if (!serviceType.equals("system") && !serviceType.equals("database")) {
                String containerId = container.getId();
                String serviceName = container.getLabels().get("serviceName");
                String serviceHostname = container.getHostname();

                Map<String, Double> fields = getNewContainerFieldsProcessed(container);

                List<AppPackage> apps = servicesConfigService.getAppsByServiceName(serviceName);
                if (!apps.isEmpty()) {
                    long appId = apps.get(0).getId();
                    ContainerDecisionResult decisionResult = runAppRules(appId, serviceHostname, containerId,
                            serviceName, fields);
                    if (decisionResult != null) {
                        if (decisions.containsKey(decisionResult.getServiceName())) {
                            decisions.get(decisionResult.getServiceName()).add(decisionResult);
                        } else {
                            List<ContainerDecisionResult> containerDecisions = new ArrayList<>();
                            containerDecisions.add(decisionResult);
                            decisions.put(decisionResult.getServiceName(), containerDecisions);
                        }
                    }
                }
                monitoringDataService.saveMonitoringServiceLogs(containerId, serviceName, fields);
            }
        }
        processContainerDecisions(decisions, secondsFromLastRun);
    }

    private ContainerDecisionResult runAppRules(long appId, String serviceHostname, String containerId,
            String serviceName, Map<String, Double> newFields) {
        ContainerDecisionResult decisionResult = new ContainerDecisionResult(serviceHostname, containerId, serviceName);
        List<MonitoringServiceLog> oldFields = monitoringDataService.getMonitoringServiceLogsByContainerId(containerId);
        ContainerEvent containerEvent = new ContainerEvent(containerId, serviceName);
        int fieldsSet = 0;
        for (MonitoringServiceLog oldField : oldFields) {
            if (oldField.getCount() >= CONTAINER_MINIMUM_LOGS_COUNT) {
                Double currentValue = newFields.get(oldField.getField());
                if (currentValue != null) {
                    double average = oldField.getSumValue() / (oldField.getCount() * 1.0);
                    double deviationValAvg = ContainerMetricsService.getDeviationPercent(average, currentValue);
                    double deviationValLast = ContainerMetricsService.getDeviationPercent(oldField.getLastValue(), currentValue);

                    containerEvent.getFields().put(oldField.getField() + "-deviation-%-on-avg-val", deviationValAvg);
                    containerEvent.getFields().put(oldField.getField() + "-effective-val", currentValue);
                    containerEvent.getFields().put(oldField.getField() + "-avg-val", average);
                    containerEvent.getFields().put(oldField.getField() + "-deviation-%-on-last-val", deviationValLast);
                    fieldsSet += 4;
                }
            }
        }
        if (fieldsSet > 0)
            decisionResult = ruleService.executeContainerEvent(appId, serviceHostname, containerEvent);

        return decisionResult;
    }

    private void processContainerDecisions(Map<String, List<ContainerDecisionResult>> decisions, int secondsFromLastRun) {
        if (!decisions.isEmpty()) {            
            Map<String, List<ContainerDecisionResult>> finalDecisions = new HashMap<>();
            System.out.println("-> Processing container decisions...");
            for (Entry<String, List<ContainerDecisionResult>> containerDecisions : decisions.entrySet()) {
                String serviceName = containerDecisions.getKey();

                for (ContainerDecisionResult decision : containerDecisions.getValue()) {
                    System.out.println("   ServiceName: " + serviceName + " ; containerId: " + decision.getContainerId()
                            + " ; decision: " + decision.getDecision());

                    ServiceEventLog serviceEventLog = ruleDataService.saveServiceEventLog(decision.getContainerId(),
                            serviceName, decision.getDecision().toString());
                    if(serviceEventLog != null) {
                        if (!decision.getDecision().equals(RuleDecision.Decision.NONE)) {
                            boolean addToFinalDecisionsStop = decision.getDecision().equals(RuleDecision.Decision.STOP) && (serviceEventLog.getCount() >= containerEventLogsCountStop);
                            boolean addToFinalDecisionsRepMig = (decision.getDecision().equals(RuleDecision.Decision.REPLICATE) || decision.getDecision().equals(RuleDecision.Decision.MIGRATE)) && (serviceEventLog.getCount() >= containerEventLogsCountRepMig);
                            if (addToFinalDecisionsStop || addToFinalDecisionsRepMig) {
                                //saveComponentDecisionServiceLog(decision.getContainerId(), serviceName, decision.getDecision().toString(), decision.getRuleId(), decision.getFields());
                                if (finalDecisions.containsKey(serviceName)) {
                                    finalDecisions.get(serviceName).add(decision);
                                } else {
                                    List<ContainerDecisionResult> containerFinalDecisions = new ArrayList<>();
                                    containerFinalDecisions.add(decision);
                                    finalDecisions.put(serviceName, containerFinalDecisions);
                                }
                            }
                        }
                    }
                }
            }            
            processFinalContainerDecisions(finalDecisions, decisions, secondsFromLastRun);
        }
    }

    private void processFinalContainerDecisions(Map<String, List<ContainerDecisionResult>> finalDecisions,
            Map<String, List<ContainerDecisionResult>> allDecisions, int secondsFromLastRun) {        
        Map<String, HostDetails> servicesLocationsRegions = requestLocationMonitoringService.getBestLocationToStartServices(allDecisions, secondsFromLastRun);

        for (Entry<String, List<ContainerDecisionResult>> services : allDecisions.entrySet()) {
            String serviceName = services.getKey();
            List<ContainerDecisionResult> currentDecisions = new ArrayList<>();
            if(finalDecisions.containsKey(serviceName))
                currentDecisions = finalDecisions.get(serviceName);
            int currReplics = services.getValue().size();
            int minReplics = servicesConfigService.getMinReplicsByServiceName(serviceName);
            int maxReplics = servicesConfigService.getMaxReplicsByServiceName(serviceName);
            if (currReplics < minReplics) { // Current replics < minimum replics               
                startContainer(serviceName, currentDecisions, services.getValue(), servicesLocationsRegions);
            } else if (!currentDecisions.isEmpty()) {
                Collections.sort(currentDecisions);
                ContainerDecisionResult firstContainerDecision = currentDecisions.get(0);
                if (firstContainerDecision.getDecision().equals(RuleDecision.Decision.REPLICATE)) {
                    if (maxReplics == 0 || currReplics < maxReplics) {
                        startContainer(firstContainerDecision.getServiceHostname(), serviceName,
                                firstContainerDecision.getContainerId(), servicesLocationsRegions, firstContainerDecision);
                    }
                } else if (firstContainerDecision.getDecision().equals(RuleDecision.Decision.STOP)) {
                    if (currReplics > minReplics) {
                        ContainerDecisionResult lastContainerDecision = currentDecisions
                                .get(currentDecisions.size() - 1);                        
                        stopContainer(lastContainerDecision.getServiceHostname(), serviceName,
                                lastContainerDecision.getContainerId(), lastContainerDecision);
                    }
                }
            } else {
                // All decisions == NONE
            }
        }
    }

    private void startContainer(String serviceName, List<ContainerDecisionResult> filterContainersDecisions,
            List<ContainerDecisionResult> allContainersDecisions, Map<String, HostDetails> servicesLocationsRegions) {
        ContainerDecisionResult container = null;
        boolean foundContainer = false;
        if (!filterContainersDecisions.isEmpty()) {
            Collections.sort(filterContainersDecisions);
            container = filterContainersDecisions.get(0);
            if (container.getDecision().equals(RuleDecision.Decision.REPLICATE))
                foundContainer = true;
        }
        if (!foundContainer) {
            Collections.sort(allContainersDecisions);
            for (ContainerDecisionResult containerDecisionRes : allContainersDecisions) {
                if (containerDecisionRes.getDecision().equals(RuleDecision.Decision.REPLICATE)) {
                    container = containerDecisionRes;
                    foundContainer = true;
                    break;
                }
            }
            if(!foundContainer) {
                for (ContainerDecisionResult containerDecisionRes : allContainersDecisions) {
                    if (containerDecisionRes.getDecision().equals(RuleDecision.Decision.NONE)) {
                        container = containerDecisionRes;
                        break;
                    }
                }
            }
        }

        String fromHostname = container.getServiceHostname();
        String fromContainerId = container.getContainerId();
        startContainer(fromHostname, serviceName, fromContainerId, servicesLocationsRegions, container);
    }

    private void startContainer(String serviceHostname, String serviceName, String containerId, Map<String, HostDetails> servicesLocationsRegions, ContainerDecisionResult firstContainerDecision) {
        HostDetails startLocation = null;
        if (servicesLocationsRegions.containsKey(serviceName)) {
            startLocation = servicesLocationsRegions.get(serviceName);
            log.info("-> Starting service '" + serviceName +  "'. Location from request-location-monitor: " + startLocation.getRegion() + "_" + startLocation.getCountry() + "_" + startLocation.getCity());
        } else {
            startLocation = hostService.getHostDetails(serviceHostname);
        }
        double serviceAvgMem = servicesConfigService.getServiceLaunchConfig(serviceName).getAvgMem();
        String toHostname = hostService.getAvailableNode(startLocation.getRegion(), startLocation.getCountry(),
            startLocation.getCity(), serviceAvgMem);
        docker.replicateContainer(serviceHostname, containerId, toHostname);
        HostDetails choosenHostDetails = hostService.getHostDetails(toHostname);
        log.info("-> Decision executed!\n   Started container: " + serviceName + " ; On host:" + toHostname
                + " (" + choosenHostDetails.getRegion() + "_" + choosenHostDetails.getCountry() + "_" + choosenHostDetails.getCity() + ")");
        ruleDataService.resetServiceEventLog(serviceName);
        String otherInfo = "Decision on Host: " + serviceHostname + " (" + choosenHostDetails.getRegion() + "_" + choosenHostDetails.getCountry() + "_" + choosenHostDetails.getCity() + ")";
        saveComponentDecisionServiceLog(firstContainerDecision.getContainerId(), serviceName, firstContainerDecision.getDecision().toString(),
                    firstContainerDecision.getRuleId(), firstContainerDecision.getFields(), otherInfo);
        }

    private void stopContainer(String serviceHostname, String serviceName, String containerId, ContainerDecisionResult lastContainerDecision) {
        docker.stopContainer(serviceHostname, containerId);
        HostDetails choosenHostDetails = hostService.getHostDetails(serviceHostname);
        log.info("-> Decision executed!\n   Stoped container: " + serviceName + " ; Container Id:" + containerId + " ; On host:" + serviceHostname 
                + " (" + choosenHostDetails.getRegion() + "_" + choosenHostDetails.getCountry() + "_" + choosenHostDetails.getCity() + ")");
        ruleDataService.resetServiceEventLog(serviceName);        
        String otherInfo = "Decision on Host: " + serviceHostname + " (" + choosenHostDetails.getRegion() + "_" + choosenHostDetails.getCountry() + "_" + choosenHostDetails.getCity() + ")";
        saveComponentDecisionServiceLog(lastContainerDecision.getContainerId(), serviceName, lastContainerDecision.getDecision().toString(),
                                lastContainerDecision.getRuleId(), lastContainerDecision.getFields(), otherInfo);
    }

    private void saveComponentDecisionServiceLog(String containerId, String serviceName, String decision, long ruleId,
            Map<String, Double> fields, String otherInfo) {
        ComponentDecisionServiceLog componentDecisionServiceLog = ruleDataService
                .saveComponentDecisionServiceLog(containerId, serviceName, decision, ruleId, otherInfo);
        ruleDataService.saveComponentDecisionValueLogsFromFields(componentDecisionServiceLog.getComponentDecisionLog(),
                fields);
    }

    private Map<String, Double> getNewContainerFieldsProcessed(DockerSimpleContainer container) {
        Map<String, Double> newFields = containerMetricsService.getContainerStats(container);
        if(!newFields.isEmpty()) {
            double newRxBytes = newFields.getOrDefault("rx-bytes", 0.0);
            double newTxBytes = newFields.getOrDefault("tx-bytes", 0.0);
            List<MonitoringServiceLog> oldRxBytesList = monitoringDataService.getMonitoringServiceLogsByContainerIdAndField(container.getId(), "rx-bytes");
            List<MonitoringServiceLog> oldTxBytesList = monitoringDataService.getMonitoringServiceLogsByContainerIdAndField(container.getId(), "tx-bytes");
            double oldRxBytes = 0;
            double oldTxBytes = 0;
            double secondsInterval = (containerMonitorInterval * 1.0) / 1000.0;

            if(!oldRxBytesList.isEmpty())
                oldRxBytes = oldRxBytesList.get(0).getLastValue();

            if(!oldTxBytesList.isEmpty())
                oldTxBytes = oldTxBytesList.get(0).getLastValue();

            double rxBytesPerSec = (newRxBytes - oldRxBytes) / secondsInterval;
            double txBytesPerSec = (newTxBytes - oldTxBytes) / secondsInterval;
            rxBytesPerSec = rxBytesPerSec < 0 ? 0 : rxBytesPerSec;
            txBytesPerSec = txBytesPerSec < 0 ? 0 : txBytesPerSec;

            newFields.put("rx-bytes-per-sec", rxBytesPerSec);
            newFields.put("tx-bytes-per-sec", txBytesPerSec);
        }
        return newFields;
    }

}