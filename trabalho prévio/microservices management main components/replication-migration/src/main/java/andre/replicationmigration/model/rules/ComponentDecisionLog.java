package andre.replicationmigration.model.rules;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Basic;
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

import andre.replicationmigration.model.rules.ComponentType;

@Entity
@Table(name = "component_decision_log")
public class ComponentDecisionLog {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "component_type_id")
    private ComponentType componentType;

    @ManyToOne
    @JoinColumn(name = "decision_id")
    private Decision decision;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private Rule rule;

    @Basic
    @Column(name = "timestamp")
    private Timestamp timestamp;

    @JsonIgnore
    @OneToMany(mappedBy = "componentDecisionLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ComponentDecisionValueLog> componentDecisionValueLogs = new HashSet<>();

    public ComponentDecisionLog() {
    }

    public ComponentDecisionLog(ComponentType componentType, Decision decision, Rule rule,
            Timestamp timestamp) {
        this.componentType = componentType;
        this.decision = decision;
        this.rule = rule;
        this.timestamp = timestamp;
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
     * @return the componentType
     */
    public ComponentType getComponentType() {
        return componentType;
    }

    /**
     * @param componentType the componentType to set
     */
    public void setComponentType(ComponentType componentType) {
        this.componentType = componentType;
    }

    /**
     * @return the decision
     */
    public Decision getDecision() {
        return decision;
    }

    /**
     * @param decision the decision to set
     */
    public void setDecision(Decision decision) {
        this.decision = decision;
    }

    /**
     * @return the rule
     */
    public Rule getRuleDescription() {
        return rule;
    }

    /**
     * @param rule the rule to set
     */
    public void setRuleDescription(Rule rule) {
        this.rule = rule;
    }

    /**
     * @return the timestamp
     */
    public Timestamp getTimestamp() {
        return timestamp;
    }

    /**
     * @param timestamp the timestamp to set
     */
    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
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