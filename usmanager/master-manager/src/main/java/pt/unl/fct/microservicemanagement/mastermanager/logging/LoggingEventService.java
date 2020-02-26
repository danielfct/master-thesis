package pt.unl.fct.microservicemanagement.mastermanager.logging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LoggingEventService {

  private final LoggingEventRepository loggingEvents;

  public LoggingEventService(LoggingEventRepository loggingEvents) {
    this.loggingEvents = loggingEvents;
  }

  public Iterable<LoggingEventEntity> getLogs() {
    return loggingEvents.findAll();
  }


}
