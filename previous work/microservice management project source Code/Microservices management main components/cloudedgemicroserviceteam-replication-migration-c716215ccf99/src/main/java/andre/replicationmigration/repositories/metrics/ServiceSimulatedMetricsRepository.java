package andre.replicationmigration.repositories.metrics;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import andre.replicationmigration.model.metrics.ServiceSimulatedMetrics;

public interface ServiceSimulatedMetricsRepository extends CrudRepository<ServiceSimulatedMetrics, Long> {

    List<ServiceSimulatedMetrics> findByServiceName(@Param("serviceName") String serviceName);

    List<ServiceSimulatedMetrics> findByServiceNameAndField(@Param("serviceName") String serviceName,
            @Param("field") String field);

}