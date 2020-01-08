package andre.replicationmigration.model.rules;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "field")
public class Field {

    @Id
    @GeneratedValue
    private long id;

    // Possible values:
    // - cpu, - ram, ...
    @Column(name = "field_name", unique = true)
    private String fieldName;

    @JsonIgnore
    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Condition> conditions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ComponentDecisionValueLog> componentDecisionValueLogs = new HashSet<>();


    public Field() {
    }

    public Field(String fieldName) {
        this.fieldName = fieldName;
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
     * @return the fieldName
     */
    public String getFieldName() {
        return fieldName;
    }

    /**
     * @param fieldName the fieldName to set
     */
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    /**
     * @return the conditions
     */
    public Set<Condition> getConditions() {
        return conditions;
    }

    /**
     * @param conditions the conditions to set
     */
    public void setConditions(Set<Condition> conditions) {
        this.conditions = conditions;
    }

    /**
     * @return the componentDecisionValueLogs
     */
    public Set<ComponentDecisionValueLog> getComponentDecisionValueLogs() {
        return componentDecisionValueLogs;
    }

    /**
     * @param componentDecisionValueLogs the componentDecisionValueLogs to set
     */
    public void setComponentDecisionValueLogs(Set<ComponentDecisionValueLog> componentDecisionValueLogs) {
        this.componentDecisionValueLogs = componentDecisionValueLogs;
    }

}