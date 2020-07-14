package andre.replicationmigration.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.entities.ContainerFieldAvg;
import andre.replicationmigration.entities.ServiceFieldAvg;
import andre.replicationmigration.model.MonitoringServiceLog;

@Repository
public interface MonitoringServiceLogRepository extends CrudRepository<MonitoringServiceLog, Long> {

    @Query("select COUNT(1) from MonitoringServiceLog log where log.containerId = :containerId and log.field = :field")
    long getCountServiceField(@Param("containerId") String containerId, @Param("field") String field);

    @Query("select log from MonitoringServiceLog log where log.containerId = :containerId and log.field = :field")
    List<MonitoringServiceLog> getMonitoringServiceLogByContainerAndField(@Param("containerId") String containerId,
            @Param("field") String field);

    @Query("select log from MonitoringServiceLog log where log.containerId = :containerId")
    List<MonitoringServiceLog> getMonitoringServiceLogByContainer(@Param("containerId") String containerId);

    @Query("select new andre.replicationmigration.entities.ServiceFieldAvg(log.serviceName, log.field, log.sumValue / log.count, log.count)"
            + " from MonitoringServiceLog log where log.serviceName = :serviceName and log.field = :field")
    ServiceFieldAvg getAvgServiceField(@Param("serviceName") String serviceName, @Param("field") String field);

    @Query("select new andre.replicationmigration.entities.ServiceFieldAvg(log.serviceName, log.field, log.sumValue / log.count, log.count)"
            + " from MonitoringServiceLog log where log.serviceName = :serviceName")
    List<ServiceFieldAvg> getAvgServiceFields(@Param("serviceName") String serviceName);

    @Query("select new andre.replicationmigration.entities.ContainerFieldAvg(log.containerId, log.field, log.sumValue / log.count, log.count)"
            + " from MonitoringServiceLog log where log.containerId = :containerId and log.field = :field")
    ContainerFieldAvg getAvgContainerField(@Param("containerId") String containerId, @Param("field") String field);

    @Query("select new andre.replicationmigration.entities.ContainerFieldAvg(log.containerId, log.field, log.sumValue / log.count, log.count)"
            + " from MonitoringServiceLog log where log.containerId = :containerId")
    List<ContainerFieldAvg> getAvgContainerFields(@Param("containerId") String containerId);

    @Query("select log from MonitoringServiceLog log where log.containerId in :containerIds and log.field = :field"
            + " order by (log.sumValue / log.count) desc")
    List<MonitoringServiceLog> getTopContainersByField(@Param("containerIds") List<String> containerIds,
            @Param("field") String field);

}