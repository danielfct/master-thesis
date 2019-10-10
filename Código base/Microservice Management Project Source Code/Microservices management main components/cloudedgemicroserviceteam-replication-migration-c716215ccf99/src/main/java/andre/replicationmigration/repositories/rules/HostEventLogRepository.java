package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.HostEventLog;

@Repository
public interface HostEventLogRepository extends CrudRepository<HostEventLog, Long> {

    List<HostEventLog> findByHostname(@Param("hostname") String hostname);

}