package pt.unl.fct.microservicemanagement.mastermanager.logging;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoggingEventRepository extends CrudRepository<LoggingEventEntity, Long> {
}
