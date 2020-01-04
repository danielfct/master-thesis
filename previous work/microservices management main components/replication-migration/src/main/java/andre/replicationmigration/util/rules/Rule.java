package andre.replicationmigration.util.rules;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Rule {

    private long dbRuleId;
    private List<Condition> conditions;
    private Rule.eventType eventType;
    private RuleDecision.Decision decision;
    private Integer priority;

    public Rule(long dbRuleId) {
        this.dbRuleId = dbRuleId;
    }

    /**
     * @return the dbRuleId
     */
    public long getDbRuleId() {
        return dbRuleId;
    }

    /**
     * @param ruleDbId the dbRuleId to set
     */
    public void setDbRuleId(long dbRuleId) {
        this.dbRuleId = dbRuleId;
    }

    public List<Condition> getConditions() {
        return conditions;
    }

    public void setConditions(List<Condition> conditions) {
        this.conditions = conditions;
    }

    public Rule.eventType getEventType() {
        return eventType;
    }

    public void setEventType(Rule.eventType eventType) {
        this.eventType = eventType;
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
     * @return the priority
     */
    public Integer getPriority() {
        return priority;
    }

    /**
     * @param priority the priority to set
     */
    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        StringBuilder statementBuilder = new StringBuilder();

        for (Condition condition : getConditions()) {
            String operator = null;

            switch (condition.getOperator()) {
            case EQUAL_TO:
                operator = "==";
                break;
            case NOT_EQUAL_TO:
                operator = "!=";
                break;
            case GREATER_THAN:
                operator = ">";
                break;
            case LESS_THAN:
                operator = "<";
                break;
            case GREATER_THAN_OR_EQUAL_TO:
                operator = ">=";
                break;
            case LESS_THAN_OR_EQUAL_TO:
                operator = "<=";
                break;
            }
            statementBuilder.append("fields[\"");
            statementBuilder.append(condition.getFieldName()).append("\"] ").append(operator).append(" ");
            statementBuilder.append(condition.getValue());
            statementBuilder.append(" && ");
        }

        String statement = statementBuilder.toString();

        // remove trailing &&
        return statement.substring(0, statement.length() - 4);
    }

    public static enum eventType {
        CONTAINER("CONTAINER"), HOST("HOST");
        private final String value;
        private static Map<String, Rule.eventType> constants = new HashMap<String, Rule.eventType>();

        static {
            for (Rule.eventType c : values()) {
                constants.put(c.value, c);
            }
        }

        private eventType(String value) {
            this.value = value;
        }

        public static Rule.eventType fromValue(String value) {
            Rule.eventType constant = constants.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }
    }

}