package andre.replicationmigration.repositories.metrics;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import andre.replicationmigration.model.metrics.ContainerSimulatedMetrics;

public interface ContainerSimulatedMetricsRepository extends CrudRepository<ContainerSimulatedMetrics, Long> {

    List<ContainerSimulatedMetrics> findByContainerId(@Param("containerId") String containerId);

    List<ContainerSimulatedMetrics> findByContainerIdAndField(@Param("containerId") String containerId,
    														  @Param("field") String field);

}