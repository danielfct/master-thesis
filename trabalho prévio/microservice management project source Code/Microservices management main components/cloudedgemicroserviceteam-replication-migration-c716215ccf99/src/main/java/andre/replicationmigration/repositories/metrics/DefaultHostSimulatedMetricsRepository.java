package andre.replicationmigration.repositories.metrics;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import andre.replicationmigration.model.metrics.DefaultHostSimulatedMetrics;

public interface DefaultHostSimulatedMetricsRepository extends CrudRepository<DefaultHostSimulatedMetrics, Long> {

    List<DefaultHostSimulatedMetrics> findByField(@Param("field") String field);
}