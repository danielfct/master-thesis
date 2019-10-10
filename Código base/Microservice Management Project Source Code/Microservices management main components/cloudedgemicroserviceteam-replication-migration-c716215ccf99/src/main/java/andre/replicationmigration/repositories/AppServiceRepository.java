package andre.replicationmigration.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.AppService;

@Repository
public interface AppServiceRepository extends CrudRepository<AppService, Long> {

}