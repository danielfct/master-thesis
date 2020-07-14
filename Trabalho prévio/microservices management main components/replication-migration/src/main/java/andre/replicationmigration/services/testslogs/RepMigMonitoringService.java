package andre.replicationmigration.services.testslogs;

import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.model.MonitoringServiceLog;
import andre.replicationmigration.services.CommandSshService;
import andre.replicationmigration.services.DockerCore;
import andre.replicationmigration.services.MonitoringDataService;
import andre.replicationmigration.services.metrics.ContainerMetricsService;

@Service
public class RepMigMonitoringService {

    private boolean testsLogsActive;
    private int repMigMonitorInterval;
    private String repMigHostname;
    private Timer monitorRepMigTimer;

    private boolean isProxyRunning;

    @Autowired
    private DockerCore dockerCore;

    @Autowired
    private ContainerMetricsService containerMetricsService;

    @Autowired
    private MonitoringDataService monitoringDataService;

    @Autowired
    private CommandSshService commandSshService;

    @Autowired
    public RepMigMonitoringService(@Value("${replic.prop.tests-logs-active}") boolean testsLogsActive,
            @Value("${replic.prop.rep-mig-monitor-interval}") int repMigMonitorInterval,
            @Value("${replic.prop.rep-mig-hostname}") String repMigHostname) {
        this.testsLogsActive = testsLogsActive;
        this.repMigMonitorInterval = repMigMonitorInterval;
        this.repMigHostname = repMigHostname;
        this.isProxyRunning = false;
        this.monitorRepMigTimer = new Timer("monitorRepMigTimer", true);
    }

    public void initRepMigMonitorTimer() {
        if (testsLogsActive && !repMigHostname.equals("none")) {
            monitorRepMigTimer.schedule(new TimerTask() {
                @Override
                public void run() {
                    try {
                        monitorRepMigTask();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }, repMigMonitorInterval, repMigMonitorInterval);
        }
    }

    private void monitorRepMigTask() {
        if (isProxyRunning) {
            List<DockerSimpleContainer> containers = dockerCore.getContainers(repMigHostname);
            for (DockerSimpleContainer container : containers) {
                if (!container.getNames().isEmpty()) {
                    if (container.getNames().get(0).contains("replication_migration")) {
                        saveRepMigContainerFields(container);
                        break;
                    }
                }
            }
        } else {
            if (commandSshService.isHostRunning(repMigHostname)) {
                isProxyRunning = commandSshService.launchDockerApiProxy(repMigHostname);
            }
        }        
    }

    private void saveRepMigContainerFields(DockerSimpleContainer container) {
        Map<String, Double> newFields = containerMetricsService.getContainerStats(container);
        if (!newFields.isEmpty()) {
            double newRxBytes = newFields.getOrDefault("rx-bytes", 0.0);
            double newTxBytes = newFields.getOrDefault("tx-bytes", 0.0);
            List<MonitoringServiceLog> oldRxBytesList = monitoringDataService
                    .getMonitoringServiceLogsByContainerIdAndField(container.getId(), "rx-bytes");
            List<MonitoringServiceLog> oldTxBytesList = monitoringDataService
                    .getMonitoringServiceLogsByContainerIdAndField(container.getId(), "tx-bytes");
            double oldRxBytes = 0;
            double oldTxBytes = 0;
            double secondsInterval = (repMigMonitorInterval * 1.0) / 1000.0;

            if (!oldRxBytesList.isEmpty())
                oldRxBytes = oldRxBytesList.get(0).getLastValue();

            if (!oldTxBytesList.isEmpty())
                oldTxBytes = oldTxBytesList.get(0).getLastValue();

            double rxBytesPerSec = (newRxBytes - oldRxBytes) / secondsInterval;
            double txBytesPerSec = (newTxBytes - oldTxBytes) / secondsInterval;
            rxBytesPerSec = rxBytesPerSec < 0 ? 0 : rxBytesPerSec;
            txBytesPerSec = txBytesPerSec < 0 ? 0 : txBytesPerSec;

            newFields.put("rx-bytes-per-sec", rxBytesPerSec);
            newFields.put("tx-bytes-per-sec", txBytesPerSec);
            monitoringDataService.saveMonitoringServiceLogs(container.getId(), "microservices-management", newFields);
        }
    }

}