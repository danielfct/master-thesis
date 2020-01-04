package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.HostRule;

@Repository
public interface HostRuleRepository extends CrudRepository<HostRule, Long> {

    @Query("select hostrule from HostRule hostrule where hostrule.hostname = :hostname")
    List<HostRule> getHostRulesByHostname(@Param("hostname") String hostname);

    @Query("select hostrule from HostRule hostrule"
        + " inner join hostrule.rule rule where hostrule.hostname = :hostname and rule.id = :ruleId")
    List<HostRule> getHostRuleByHostnameAndRuleId(@Param("hostname") String hostname, @Param("ruleId") long ruleId);

}
