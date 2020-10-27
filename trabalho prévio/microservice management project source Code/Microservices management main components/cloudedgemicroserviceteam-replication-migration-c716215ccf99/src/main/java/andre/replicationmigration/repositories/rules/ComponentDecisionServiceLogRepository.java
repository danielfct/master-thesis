package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ComponentDecisionServiceLog;

@Repository
public interface ComponentDecisionServiceLogRepository extends CrudRepository<ComponentDecisionServiceLog, Long> {

    List<ComponentDecisionServiceLog> findByServiceName(@Param("serviceName") String serviceName);

    List<ComponentDecisionServiceLog> findByContainerId(@Param("containerId") String containerId);
    
}