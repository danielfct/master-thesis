package andre.replicationmigration.util.rules;

import java.util.HashMap;
import java.util.Map;

public class Condition {

    private String fieldName;
    private Double value;
    private Condition.Operator operator;

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Condition.Operator getOperator() {
        return operator;
    }

    public void setOperator(Condition.Operator operator) {
        this.operator = operator;
    }

    public static enum Operator {
        NOT_EQUAL_TO("NOT_EQUAL_TO"), 
        EQUAL_TO("EQUAL_TO"), 
        GREATER_THAN("GREATER_THAN"), 
        LESS_THAN("LESS_THAN"),
        GREATER_THAN_OR_EQUAL_TO("GREATER_THAN_OR_EQUAL_TO"), 
        LESS_THAN_OR_EQUAL_TO("LESS_THAN_OR_EQUAL_TO");
        private final String value;
        private static Map<String, Operator> constants = new HashMap<String, Operator>();

        static {
            for (Condition.Operator c : values()) {
                constants.put(c.value, c);
            }
        }

        private Operator(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        public static Condition.Operator fromValue(String value) {
            Condition.Operator constant = constants.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }
    }

}