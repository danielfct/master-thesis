package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules;

import lombok.Getter;
import org.drools.core.event.DefaultAgendaEventListener;
import org.kie.api.event.rule.AfterMatchFiredEvent;
import org.kie.api.runtime.rule.Match;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
public final class TrackingAgendaEventListener extends DefaultAgendaEventListener {

  private final List<Match> matchList;

  public TrackingAgendaEventListener() {
    matchList = new LinkedList<>();
  }

  @Override
  public void afterMatchFired(AfterMatchFiredEvent event) {
    matchList.add(event.getMatch());
  }

  public boolean isRuleFired(String ruleName) {
    return matchList.stream()
        .map(Match::getRule).map(org.kie.api.definition.rule.Rule::getName)
        .anyMatch(n -> Objects.equals(n, ruleName));
  }

  public void reset() {
    matchList.clear();
  }

  @Override
  public String toString() {
    return matchList.isEmpty()
        ? "No matches occurred."
        : "Matches: " + matchList.stream()
        .map(m -> "\n  rule: " + m.getRule().getName()).collect(Collectors.joining());
  }

}
