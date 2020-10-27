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
@Table(name = "component_type")
public class ComponentType {

    @Id
    @GeneratedValue
    private long id;

    // Possible values:
    // - container; - host
    @Column(name = "component_type_name", unique = true)
    private String componentTypeName;

    @JsonIgnore
    @OneToMany(mappedBy = "componentType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Rule> rules = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "componentType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Decision> decisions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "componentType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ComponentDecisionLog> componentDecisionLogs = new HashSet<>();


    public ComponentType() {
    }

    public ComponentType(String componentTypeName) {
        this.componentTypeName = componentTypeName;
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
     * @return the componentTypeName
     */
    public String getComponentTypeName() {
        return componentTypeName;
    }

    /**
     * @param componentTypeName the componentTypeName to set
     */
    public void setComponentTypeName(String componentTypeName) {
        this.componentTypeName = componentTypeName;
    }

    /**
     * @return the rules
     */
    public Set<Rule> getRules() {
        return rules;
    }

    /**
     * @param rules the rules to set
     */
    public void setRules(Set<Rule> rules) {
        this.rules = rules;
    }

    /**
     * @return the decisions
     */
    public Set<Decision> getDecisions() {
        return decisions;
    }

    /**
     * @param decisions the decisions to set
     */
    public void setDecisions(Set<Decision> decisions) {
        this.decisions = decisions;
    }

    /**
     * @return the componentDecisionLogs
     */
    public Set<ComponentDecisionLog> getComponentDecisionLogs() {
        return componentDecisionLogs;
    }

    /**
     * @param componentDecisionLogs the componentDecisionLogs to set
     */
    public void setComponentDecisionLogs(Set<ComponentDecisionLog> componentDecisionLogs) {
        this.componentDecisionLogs = componentDecisionLogs;
    }

}