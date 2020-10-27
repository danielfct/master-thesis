package andre.replicationmigration.repositories.rules;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ComponentDecisionHostLog;

@Repository
public interface ComponentDecisionHostLogRepository extends CrudRepository<ComponentDecisionHostLog, Long> {

}