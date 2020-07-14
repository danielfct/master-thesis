package andre.replicationmigration.repositories.rules;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.rules.Decision;

@Repository
public interface DecisionRepository extends CrudRepository<Decision, Long> {

    @Query("select d from Decision d inner join d.componentType r where r.componentTypeName = :componentType")
    List<Decision> getDecisionsByComponentType(@Param("componentType") String componentType);

    @Query("select d from Decision d inner join d.componentType r"
            + " where d.decisionName = :decisionName and r.componentTypeName = :componentType")
    List<Decision> getDecisionsByComponentTypeAndByDecisionName(@Param("componentType") String componentType,
            @Param("decisionName") String decisionName);

}
