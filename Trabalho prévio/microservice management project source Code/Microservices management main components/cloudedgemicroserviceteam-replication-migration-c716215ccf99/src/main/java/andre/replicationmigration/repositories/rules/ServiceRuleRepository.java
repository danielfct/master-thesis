package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.ServiceRule;

@Repository
public interface ServiceRuleRepository extends CrudRepository<ServiceRule, Long> {

    @Query("select servicerule from ServiceRule servicerule inner join servicerule.serviceConfig service where service.id = :serviceId")
    List<ServiceRule> getServiceRulesByServiceId(@Param("serviceId") long serviceId);

    @Query("select servicerule from ServiceRule servicerule inner join servicerule.serviceConfig service where service.serviceName = :serviceName")
    List<ServiceRule> getServiceRulesByServiceName(@Param("serviceName") String serviceName);

    @Query("select servicerule from ServiceRule servicerule inner join servicerule.serviceConfig service"
        + " inner join servicerule.rule rule where service.id = :serviceId and rule.id = :ruleId")
    List<ServiceRule> getServiceRuleByServiceIdAndRuleId(@Param("serviceId") long serviceId, @Param("ruleId") long ruleId);

}
