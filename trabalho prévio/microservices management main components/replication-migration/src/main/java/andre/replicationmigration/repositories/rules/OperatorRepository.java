package andre.replicationmigration.repositories.rules;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.Operator;

@Repository
public interface OperatorRepository extends CrudRepository<Operator, Long> {

}
