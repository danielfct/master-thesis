package andre.replicationmigration.repositories.rules;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.Condition;

@Repository
public interface ConditionRepository extends CrudRepository<Condition, Long> {

}
