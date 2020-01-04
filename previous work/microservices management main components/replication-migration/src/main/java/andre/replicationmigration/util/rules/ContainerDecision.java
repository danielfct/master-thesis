package andre.replicationmigration.util.rules;

public class ContainerDecision {

    private RuleDecision.Decision decision;
    private int priority;

    public ContainerDecision() {
        this.decision = RuleDecision.Decision.NONE;
        this.priority = 0;
    }

    public RuleDecision.Decision getDecision() {
        return decision;
    }

    public void setDecision(RuleDecision.Decision decision) {
        this.decision = decision;
    }

    /**
     * @return the priority
     */
    public int getPriority() {
        return priority;
    }

    /**
     * @param priority the priority to set
     */
    public void setPriority(int priority) {
        this.priority = priority;
    }

}
