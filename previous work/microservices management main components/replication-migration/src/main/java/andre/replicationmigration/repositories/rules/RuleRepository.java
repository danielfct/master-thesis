package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.Rule;

@Repository
public interface RuleRepository extends CrudRepository<Rule, Long> {

    @Query("select r from Rule r inner join r.componentType rt where rt.componentTypeName = :componentType")
    List<Rule> getRulesByComponentType(@Param("componentType") String componentType);

}
