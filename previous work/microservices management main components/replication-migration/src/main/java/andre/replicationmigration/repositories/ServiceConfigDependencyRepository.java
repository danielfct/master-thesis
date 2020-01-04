package andre.replicationmigration.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.ServiceConfigDependency;

@Repository
public interface ServiceConfigDependencyRepository extends CrudRepository<ServiceConfigDependency, Long> {

}