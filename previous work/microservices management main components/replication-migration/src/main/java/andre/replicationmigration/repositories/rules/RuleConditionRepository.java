package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.Condition;
import andre.replicationmigration.model.rules.RuleCondition;

@Repository
public interface RuleConditionRepository extends CrudRepository<RuleCondition, Long> {

    @Query("select c from RuleCondition rc inner join rc.rule r inner join rc.condition c where r.id = :ruleId")
    List<Condition> getConditionsByRuleId(@Param("ruleId") long ruleId);

    @Query("select rc from RuleCondition rc inner join rc.rule r inner join rc.condition c where r.id = :ruleId and c.id = :conditionId")
    List<RuleCondition> getRuleConditionByRuleIdAndConditionId(@Param("ruleId") long ruleId, @Param("conditionId") long conditionId);

}
