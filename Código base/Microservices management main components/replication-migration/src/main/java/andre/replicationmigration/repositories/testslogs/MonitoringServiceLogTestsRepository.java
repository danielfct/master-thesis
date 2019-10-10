package andre.replicationmigration.repositories.testslogs;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.testslogs.MonitoringServiceLogTests;

@Repository
public interface MonitoringServiceLogTestsRepository extends CrudRepository<MonitoringServiceLogTests, Long>{

    List<MonitoringServiceLogTests> findByServiceName(@Param("serviceName") String serviceName);

    List<MonitoringServiceLogTests> findByContainerId(@Param("containerId") String containerId);
    
}