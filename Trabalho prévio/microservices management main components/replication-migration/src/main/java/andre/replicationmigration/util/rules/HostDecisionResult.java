package andre.replicationmigration.util.rules;

import java.util.HashMap;
import java.util.Map;

public class HostDecisionResult implements Comparable<HostDecisionResult> {

    private String hostname;
    private RuleDecision.Decision decision;
    private long ruleId;
    private Map<String, Double> fields;
    private int priority;
    private double sumFields;

    public HostDecisionResult() {
        this.hostname = "";
        this.decision = RuleDecision.Decision.NONE;
        this.ruleId = 0;
        this.fields = new HashMap<String, Double>();
        this.priority = 0;
        this.sumFields = 0;
    }

    public HostDecisionResult(String hostname, RuleDecision.Decision decision, long ruleId, Map<String, Double> fields,
            int priority) {
        this.hostname = hostname;
        this.decision = decision;
        this.ruleId = ruleId;
        this.fields = fields;
        this.priority = priority;
        this.sumFields = this.calculateFieldsSum();
    }

    /**
     * @return the hostname
     */
    public String getHostname() {
        return hostname;
    }

    /**
     * @param hostname the hostname to set
     */
    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    /**
     * @return the decision
     */
    public RuleDecision.Decision getDecision() {
        return decision;
    }

    /**
     * @param decision the decision to set
     */
    public void setDecision(RuleDecision.Decision decision) {
        this.decision = decision;
    }

    /**
     * @return the ruleId
     */
    public long getRuleId() {
        return ruleId;
    }

    /**
     * @param ruleId the ruleId to set
     */
    public void setRuleId(long ruleId) {
        this.ruleId = ruleId;
    }

    /**
     * @return the fields
     */
    public Map<String, Double> getFields() {
        return fields;
    }

    /**
     * @param fields the fields to set
     */
    public void setFields(Map<String, Double> fields) {
        this.fields = fields;
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

    private double calculateFieldsSum() {
        double sum = 0;
        for (Double val : fields.values()) {
            sum += val;
        }
        return sum;
    }

    /**
     * @return the sumFields
     */
    public double getSumFields() {
        return sumFields;
    }

    /**
     * @param sumFields the sumFields to set
     */
    public void setSumFields(double sumFields) {
        this.sumFields = sumFields;
    }

    @Override
    public int compareTo(HostDecisionResult o) {
        if (this.getDecision().equals(o.getDecision())) {
            if (this.getPriority() == o.getPriority())
                return this.getSumFields() < o.getSumFields() ? -1 : 1;

            else
                return this.getPriority() < o.getPriority() ? -1 : 1;
        } else {
            if ((this.getDecision().equals(RuleDecision.Decision.START))
                    || (this.getDecision().equals(RuleDecision.Decision.STOP)
                            && o.getDecision().equals(RuleDecision.Decision.NONE)))
                return -1;
            else
                return 1;
        }
    }

}