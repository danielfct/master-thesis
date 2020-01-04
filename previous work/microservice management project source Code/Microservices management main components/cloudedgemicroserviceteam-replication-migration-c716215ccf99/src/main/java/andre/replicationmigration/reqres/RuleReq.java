package andre.replicationmigration.reqres;

public class RuleReq {

    private String ruleName;
    private long componentTypeId;
    private int priority;
    private long decisionId;

    public RuleReq() {
    }

    public RuleReq(String ruleName, long componentTypeId, int priority, long decisionId) {
        this.ruleName = ruleName;
        this.componentTypeId = componentTypeId;
        this.priority = priority;
        this.decisionId = decisionId;
    }

    /**
     * @return the ruleName
     */
    public String getRuleName() {
        return ruleName;
    }

    /**
     * @param ruleName the ruleName to set
     */
    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    /**
     * @return the componentTypeId
     */
    public long getComponentTypeId() {
        return componentTypeId;
    }

    /**
     * @param componentTypeId the componentTypeId to set
     */
    public void setComponentTypeId(long componentTypeId) {
        this.componentTypeId = componentTypeId;
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

    /**
     * @return the decisionId
     */
    public long getDecisionId() {
        return decisionId;
    }

    /**
     * @param decisionId the decisionId to set
     */
    public void setDecisionId(long decisionId) {
        this.decisionId = decisionId;
    }

}