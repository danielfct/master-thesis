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
@Table(name = "operator")
public class Operator {

    @Id
    @GeneratedValue
    private long id;

    // Possible values:
    // - NOT_EQUAL_TO; - EQUAL_TO; - GREATER_THAN; - LESS_THAN;
    // - GREATER_THAN_OR_EQUAL_TO; - LESS_THAN_OR_EQUAL_TO
    @Column(name = "operator_name", unique = true)
    private String operatorName;

    @Column(name = "operator_symbol", unique = true)
    private String operatorSymbol;

    @JsonIgnore
    @OneToMany(mappedBy = "operator", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Condition> conditions = new HashSet<>();

    public Operator() {
    }

    public Operator(String operatorName, String operatorSymbol) {
        this.operatorName = operatorName;
        this.operatorSymbol = operatorSymbol;
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
     * @return the operatorName
     */
    public String getOperatorName() {
        return operatorName;
    }

    /**
     * @param operatorName the operatorName to set
     */
    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    /**
     * @return the operatorSymbol
     */
    public String getOperatorSymbol() {
        return operatorSymbol;
    }

    /**
     * @param operatorSymbol the operatorSymbol to set
     */
    public void setOperatorSymbol(String operatorSymbol) {
        this.operatorSymbol = operatorSymbol;
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

}