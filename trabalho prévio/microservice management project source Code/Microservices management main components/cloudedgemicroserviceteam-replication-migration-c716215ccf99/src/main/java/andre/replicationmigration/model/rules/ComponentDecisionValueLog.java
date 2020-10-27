package andre.replicationmigration.model.rules;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "component_decision_value_log")
public class ComponentDecisionValueLog {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "component_decision_log_id")
    private ComponentDecisionLog componentDecisionLog;

    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;

    @Column(name = "component_value")
    private double componentValue;

    public ComponentDecisionValueLog(){
    }

    public ComponentDecisionValueLog(ComponentDecisionLog componentDecisionLog, Field field, double componentValue){
        this.componentDecisionLog = componentDecisionLog;
        this.field = field;
        this.componentValue = componentValue;
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
     * @return the componentDecisionLog
     */
    public ComponentDecisionLog getComponentDecisionLog() {
        return componentDecisionLog;
    }

    /**
     * @param componentDecisionLog the componentDecisionLog to set
     */
    public void setComponentDecisionLog(ComponentDecisionLog componentDecisionLog) {
        this.componentDecisionLog = componentDecisionLog;
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
     * @return the componentValue
     */
    public double getComponentValue() {
        return componentValue;
    }

    /**
     * @param componentValue the componentValue to set
     */
    public void setComponentValue(double componentValue) {
        this.componentValue = componentValue;
    }
    
}