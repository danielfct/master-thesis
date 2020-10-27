package andre.replicationmigration.repositories;

import java.util.Date;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.ServiceEventPrediction;

@Repository
public interface ServiceEventPredictionRepository extends CrudRepository<ServiceEventPrediction, Long> {

    @Query("select sp.minReplics" 
        + " from ServiceEventPrediction sp inner join sp.serviceConfig s"  
        + " where s.serviceName = :serviceName and sp.startDate <= :date and sp.endDate > :date"
        + " order by sp.lastUpdate desc")
    Integer getMinReplicsByServiceName(@Param("serviceName") String serviceName, @Param("date") Date date);
}