package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ServiceEventLog;

@Repository
public interface ServiceEventLogRepository extends CrudRepository<ServiceEventLog, Long> {

    List<ServiceEventLog> findByContainerId(@Param("containerId") String containerId);

    List<ServiceEventLog> findByServiceName(@Param("serviceName") String serviceName);

}