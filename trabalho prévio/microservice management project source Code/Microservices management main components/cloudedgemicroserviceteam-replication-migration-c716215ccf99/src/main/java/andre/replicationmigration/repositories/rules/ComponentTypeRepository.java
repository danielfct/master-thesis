package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ComponentType;

@Repository
public interface ComponentTypeRepository extends CrudRepository<ComponentType, Long> {

    List<ComponentType> findByComponentTypeName(@Param("componentTypeName") String componentTypeName);

}
