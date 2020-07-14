package andre.replicationmigration.util.rules;

import java.util.ArrayList;
import java.util.List;

import org.drools.core.event.DefaultAgendaEventListener;
import org.kie.api.event.rule.AfterMatchFiredEvent;
import org.kie.api.runtime.rule.Match;

public class TrackingAgendaEventListener extends DefaultAgendaEventListener {

    private List<Match> matchList;

    public TrackingAgendaEventListener() {
        super();
        matchList = new ArrayList<Match>();
    }

    @Override
    public void afterMatchFired(AfterMatchFiredEvent event) {
        matchList.add(event.getMatch());
    }

    public boolean isRuleFired(String ruleName) {
        for (Match a : matchList) {
            if (a.getRule().getName().equals(ruleName)) {
                return true;
            }
        }
        return false;
    }

    public void reset() {
        matchList.clear();
    }

    public final List<Match> getMatchList() {
        return matchList;
    }

    public String matchsToString() {
        if (matchList.size() == 0) {
            return "-> No matchs occurred.";
        } else {
            StringBuilder sb = new StringBuilder("-> Matchs: ");
            for (Match match : matchList) {
                sb.append("\n  rule: ").append(match.getRule().getName());
            }
            return sb.toString();
        }
    }

}