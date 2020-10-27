package andre.replicationmigration.services.testslogs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.testslogs.MonitoringServiceLogTests;
import andre.replicationmigration.repositories.testslogs.MonitoringServiceLogTestsRepository;

@Service
public class TestsLogsService {

    private boolean testsLogsActive;   

    @Autowired
    private MonitoringServiceLogTestsRepository monitoringServiceLogTestsRepo;   

    @Autowired
    public TestsLogsService(@Value("${replic.prop.tests-logs-active}") boolean testsLogsActive) {
        this.testsLogsActive = testsLogsActive;
    }  

    public void saveMonitoringServiceLogTests(String containerId, String serviceName, String field, double effectiveValue) {
        if(testsLogsActive) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String lastUpdate = dtf.format(LocalDateTime.now());
            MonitoringServiceLogTests monitoringServiceLogTests = new MonitoringServiceLogTests(containerId, serviceName, field, lastUpdate, effectiveValue);
            monitoringServiceLogTestsRepo.save(monitoringServiceLogTests);
        }        
    }

    public Iterable<MonitoringServiceLogTests> getMonitoringServiceLogTests() {
        return monitoringServiceLogTestsRepo.findAll();
    }

    public List<MonitoringServiceLogTests> getMonitoringServiceLogTestsByServiceName(String serviceName) {
        return monitoringServiceLogTestsRepo.findByServiceName(serviceName);
    }

    public List<MonitoringServiceLogTests> getMonitoringServiceLogTestsByContainerId(String containerId) {
        return monitoringServiceLogTestsRepo.findByContainerId(containerId);
    }

}