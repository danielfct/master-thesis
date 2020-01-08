package andre.replicationmigration.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.Region;

@Repository
public interface RegionRepository extends CrudRepository<Region, Long> {

}