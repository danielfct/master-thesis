package andre.replicationmigration.repositories.rules;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ComponentDecisionLog;

@Repository
public interface ComponentDecisionLogRepository extends CrudRepository<ComponentDecisionLog, Long> {

}