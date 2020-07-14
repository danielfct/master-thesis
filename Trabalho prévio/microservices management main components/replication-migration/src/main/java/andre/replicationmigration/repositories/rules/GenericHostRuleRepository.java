package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.GenericHostRule;

@Repository
public interface GenericHostRuleRepository extends CrudRepository<GenericHostRule, Long> {

    @Query("select hostrule from GenericHostRule hostrule"
        + " inner join hostrule.rule rule where rule.id = :ruleId")
    List<GenericHostRule> getGenericHostRuleByRuleId(@Param("ruleId") long ruleId);

}
