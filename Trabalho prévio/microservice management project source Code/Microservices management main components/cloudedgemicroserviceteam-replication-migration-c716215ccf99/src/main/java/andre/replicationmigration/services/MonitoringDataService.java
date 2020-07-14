package andre.replicationmigration.services;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.ContainerFieldAvg;
import andre.replicationmigration.entities.HostFieldAvg;
import andre.replicationmigration.entities.ServiceFieldAvg;
import andre.replicationmigration.model.MonitoringHostLog;
import andre.replicationmigration.model.MonitoringServiceLog;
import andre.replicationmigration.repositories.MonitoringHostLogRepository;
import andre.replicationmigration.repositories.MonitoringServiceLogRepository;
import andre.replicationmigration.services.testslogs.TestsLogsService;

@Service
public class MonitoringDataService {

    @Autowired
    private MonitoringServiceLogRepository monitoringServiceLogRepo;

    @Autowired
    private MonitoringHostLogRepository monitoringHostLogRepo;

    @Autowired
    private TestsLogsService testsLogsService;

    public Iterable<MonitoringServiceLog> getMonitoringServiceLogs() {
        return monitoringServiceLogRepo.findAll();
    }

    public List<MonitoringServiceLog> getMonitoringServiceLogsByContainerId(String containerId) {
        return monitoringServiceLogRepo.getMonitoringServiceLogByContainer(containerId);
    }

    public List<MonitoringServiceLog> getMonitoringServiceLogsByContainerIdAndField(String containerId, String field) {
        return monitoringServiceLogRepo.getMonitoringServiceLogByContainerAndField(containerId, field);
    }    

    public void saveMonitoringServiceLogs(String containerId, String serviceName, Map<String, Double> fields) {
        for (Entry<String, Double> field : fields.entrySet()) {
            saveMonitoringServiceLog(containerId, serviceName, field.getKey(), field.getValue());
            testsLogsService.saveMonitoringServiceLogTests(containerId, serviceName, field.getKey(), field.getValue());
        }
    }

    public long saveMonitoringServiceLog(String containerId, String serviceName, String field, double value) {
        List<MonitoringServiceLog> monitoringServiceLogs = monitoringServiceLogRepo
                .getMonitoringServiceLogByContainerAndField(containerId, field);
        MonitoringServiceLog monitoringServiceLog = null;
        Timestamp lastUpdate = Timestamp.from(Instant.now());
        if (monitoringServiceLogs.isEmpty()) {
            monitoringServiceLog = new MonitoringServiceLog(containerId, serviceName, field, value, value, value, value, 1,
                    lastUpdate);
        } else {
            monitoringServiceLog = monitoringServiceLogs.get(0);
            if (value < monitoringServiceLog.getMinValue())
                monitoringServiceLog.setMinValue(value);
            if (value > monitoringServiceLog.getMaxValue())
                monitoringServiceLog.setMaxValue(value);

            monitoringServiceLog.setLastValue(value);
            monitoringServiceLog.setSumValue(monitoringServiceLog.getSumValue() + value);
            monitoringServiceLog.setCount(monitoringServiceLog.getCount() + 1);
            monitoringServiceLog.setLastUpdate(lastUpdate);
        }

        return monitoringServiceLogRepo.save(monitoringServiceLog).getId();
    }

    public List<ServiceFieldAvg> getAvgServiceFields(String serviceName) {
        return monitoringServiceLogRepo.getAvgServiceFields(serviceName);
    }

    public ServiceFieldAvg getAvgServiceField(String serviceName, String field) {
        return monitoringServiceLogRepo.getAvgServiceField(serviceName, field);
    }

    public List<ContainerFieldAvg> getAvgContainerFields(String containerId) {
        return monitoringServiceLogRepo.getAvgContainerFields(containerId);
    }

    public ContainerFieldAvg getAvgContainerField(String containerId, String field) {
        return monitoringServiceLogRepo.getAvgContainerField(containerId, field);
    }

    public List<MonitoringServiceLog> getTopContainersByField(List<String> containerIds, String field) {
        return monitoringServiceLogRepo.getTopContainersByField(containerIds, field);
    }

    public Iterable<MonitoringHostLog> getMonitoringHostLogs() {
        return monitoringHostLogRepo.findAll();
    }

    public List<MonitoringHostLog> getMonitoringHostLogsByHostname(String hostname) {
        return monitoringHostLogRepo.getMonitoringHostLogByHost(hostname);
    }

    public void saveMonitoringHostLogs(String hostname, Map<String, Double> fields) {
        for (Entry<String, Double> field : fields.entrySet()) {
            saveMonitoringHostLog(hostname, field.getKey(), field.getValue());
        }
    }

    public long saveMonitoringHostLog(String hostname, String field, double value) {
        List<MonitoringHostLog> monitoringHostLogs = monitoringHostLogRepo.getMonitoringHostLogByHostAndField(hostname,
                field);
        MonitoringHostLog monitoringHostLog = null;
        Timestamp lastUpdate = Timestamp.from(Instant.now());
        if (monitoringHostLogs.isEmpty()) {
            monitoringHostLog = new MonitoringHostLog(hostname, field, value, value, value, value, 1, lastUpdate);
        } else {
            monitoringHostLog = monitoringHostLogs.get(0);
            if (value < monitoringHostLog.getMinValue())
                monitoringHostLog.setMinValue(value);
            if (value > monitoringHostLog.getMaxValue())
                monitoringHostLog.setMaxValue(value);
            
            monitoringHostLog.setLastValue(value);
            monitoringHostLog.setSumValue(monitoringHostLog.getSumValue() + value);
            monitoringHostLog.setCount(monitoringHostLog.getCount() + 1);
            monitoringHostLog.setLastUpdate(lastUpdate);
        }

        return monitoringHostLogRepo.save(monitoringHostLog).getId();
    }

    public List<HostFieldAvg> getAvgHostFields(String hostname) {
        return monitoringHostLogRepo.getAvgHostFields(hostname);
    }

    public HostFieldAvg getAvgHostField(String hostname, String field) {
        return monitoringHostLogRepo.getAvgHostField(hostname, field);
    }

}