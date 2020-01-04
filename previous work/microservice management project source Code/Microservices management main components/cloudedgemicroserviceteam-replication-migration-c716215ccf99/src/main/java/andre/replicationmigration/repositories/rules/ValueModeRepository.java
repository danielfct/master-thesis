package andre.replicationmigration.repositories.rules;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ValueMode;

@Repository
public interface ValueModeRepository extends CrudRepository<ValueMode, Long> {

}
