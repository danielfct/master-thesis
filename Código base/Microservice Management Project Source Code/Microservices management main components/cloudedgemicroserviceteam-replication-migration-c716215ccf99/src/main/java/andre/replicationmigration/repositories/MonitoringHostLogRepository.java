package andre.replicationmigration.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.entities.HostFieldAvg;
import andre.replicationmigration.model.MonitoringHostLog;

@Repository
public interface MonitoringHostLogRepository extends CrudRepository<MonitoringHostLog, Long> {

    @Query("select COUNT(1) from MonitoringHostLog log where log.hostname = :hostname and log.field = :field")
    long getCountHostField(@Param("hostname") String hostname, @Param("field") String field);

    @Query("select log from MonitoringHostLog log where log.hostname = :hostname and log.field = :field")
    List<MonitoringHostLog> getMonitoringHostLogByHostAndField(@Param("hostname") String hostname, @Param("field") String field);

    @Query("select log from MonitoringHostLog log where log.hostname = :hostname")
    List<MonitoringHostLog> getMonitoringHostLogByHost(@Param("hostname") String hostname);

    @Query("select new andre.replicationmigration.entities.HostFieldAvg(log.hostname, log.field, log.sumValue / log.count, log.count)"
            + " from MonitoringHostLog log where log.hostname = :hostname and log.field = :field")
    HostFieldAvg getAvgHostField(@Param("hostname") String hostname, @Param("field") String field);

    @Query("select new andre.replicationmigration.entities.HostFieldAvg(log.hostname, log.field, log.sumValue / log.count, log.count)"
            + " from MonitoringHostLog log" + " where log.hostname = :hostname")
    List<HostFieldAvg> getAvgHostFields(@Param("hostname") String serviceName);

}