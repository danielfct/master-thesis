package andre.replicationmigration.repositories.metrics;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import andre.replicationmigration.model.metrics.SpecificHostSimulatedMetrics;

public interface SpecificHostSimulatedMetricsRepository extends CrudRepository<SpecificHostSimulatedMetrics, Long> {

    List<SpecificHostSimulatedMetrics> findByHostname(@Param("hostname") String hostname);

    List<SpecificHostSimulatedMetrics> findByHostnameAndField(@Param("hostname") String hostname,
            @Param("field") String field);
}