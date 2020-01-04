package andre.replicationmigration.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.EdgeHost;

@Repository
public interface EdgeHostRepository extends CrudRepository<EdgeHost, Long> {

    List<EdgeHost> findByHostname(@Param("hostname") String hostname);

    List<EdgeHost> findByisLocal(@Param("isLocal") boolean isLocal);

    List<EdgeHost> findByHostnameContaining(@Param("partialHostname") String partialHostname);

    List<EdgeHost> findByRegion(@Param("region") String region);

    List<EdgeHost> findByCountry(@Param("country") String country);

}
