package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.AppRule;

@Repository
public interface AppRuleRepository extends CrudRepository<AppRule, Long> {

    @Query("select apprule from AppRule apprule inner join apprule.appPackage app where app.id = :appId")
    List<AppRule> getAppRulesByAppId(@Param("appId") long appId);

    @Query("select apprule from AppRule apprule inner join apprule.appPackage app"
        + " inner join apprule.rule rule where app.id = :appId and rule.id = :ruleId")
    List<AppRule> getAppRuleByAppIdAndRuleId(@Param("appId") long appId, @Param("ruleId") long ruleId);

}
