package andre.replicationmigration.util.rules;

import java.util.HashMap;
import java.util.Map;

public class RuleDecision {

    public static enum Decision {
        NONE("NONE"), REPLICATE("REPLICATE"), MIGRATE("MIGRATE"), START("START"), STOP("STOP");
        private final String value;
        private static Map<String, Decision> constants = new HashMap<String, Decision>();

        static {
            for (RuleDecision.Decision c : values()) {
                constants.put(c.value, c);
            }
        }

        private Decision(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        public static RuleDecision.Decision fromValue(String value) {
            RuleDecision.Decision constant = constants.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }
    }
}