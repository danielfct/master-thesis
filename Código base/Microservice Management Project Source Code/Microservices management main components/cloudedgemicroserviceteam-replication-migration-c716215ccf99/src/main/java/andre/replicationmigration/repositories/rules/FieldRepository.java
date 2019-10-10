package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.Field;

@Repository
public interface FieldRepository extends CrudRepository<Field, Long> {

    List<Field> findByFieldName(@Param("fieldName") String fieldName);

}
