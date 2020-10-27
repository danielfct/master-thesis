package andre.replicationmigration.model.rules;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "condition")
public class Condition {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "value_mode_id")
    private ValueMode valueMode;

    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;

    @ManyToOne
    @JoinColumn(name = "operator_id")
    private Operator operator;    

    @Column(name = "condition_value")
    private double conditionValue;

    @JsonIgnore
    @OneToMany(mappedBy = "condition", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RuleCondition> ruleConditions = new HashSet<>();

    public Condition() {
    }

    public Condition(ValueMode valueMode, Field field, Operator operator, double conditionValue) {
        this.valueMode = valueMode;
        this.field = field;
        this.operator = operator;
        this.conditionValue = conditionValue;        
    }

    /**
     * @return the id
     */
    public long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * @return the valueMode
     */
    public ValueMode getValueMode() {
        return valueMode;
    }

    /**
     * @param valueMode the valueMode to set
     */
    public void setValueMode(ValueMode valueMode) {
        this.valueMode = valueMode;
    }

    /**
     * @return the field
     */
    public Field getField() {
        return field;
    }

    /**
     * @param field the field to set
     */
    public void setField(Field field) {
        this.field = field;
    }

    /**
     * @return the operator
     */
    public Operator getOperator() {
        return operator;
    }

    /**
     * @param operator the operator to set
     */
    public void setOperator(Operator operator) {
        this.operator = operator;
    }

    /**
     * @return the conditionValue
     */
    public double getConditionValue() {
        return conditionValue;
    }

    /**
     * @param conditionValue the conditionValue to set
     */
    public void setConditionValue(double conditionValue) {
        this.conditionValue = conditionValue;
    }   

    /**
     * @return the ruleConditions
     */
    public Set<RuleCondition> getRuleConditions() {
        return ruleConditions;
    }

    /**
     * @param ruleConditions the ruleConditions to set
     */
    public void setRuleConditions(Set<RuleCondition> ruleConditions) {
        this.ruleConditions = ruleConditions;
    }

}