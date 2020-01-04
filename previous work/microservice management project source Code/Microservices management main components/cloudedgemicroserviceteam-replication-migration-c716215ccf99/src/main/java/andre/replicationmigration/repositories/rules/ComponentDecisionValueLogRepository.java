package andre.replicationmigration.repositories.rules;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ComponentDecisionValueLog;

@Repository
public interface ComponentDecisionValueLogRepository extends CrudRepository<ComponentDecisionValueLog, Long> {

}