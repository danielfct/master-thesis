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
@Table(name = "decision")
public class Decision {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "component_type_id")
    private ComponentType componentType;

    // Possible values:
    // - NONE; - REPLICATE; - MIGRATE; - STOP;
    // - NONE; - START; - STOP
    @Column(name = "decision_name")
    private String decisionName;

    @JsonIgnore
    @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Rule> rules = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ComponentDecisionLog> componentDecisionLogs = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HostEventLog> hostEventLogs = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ServiceEventLog> serviceEventLogs = new HashSet<>();

    public Decision() {
    }

    public Decision(ComponentType componentType, String decisionName) {
        this.componentType = componentType;
        this.decisionName = decisionName;
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
     * @param ComponentType the componentType to set
     */
    public void setComponentType(ComponentType componentType) {
        this.componentType = componentType;
    }

    /**
     * @return the decisionName
     */
    public String getDecisionName() {
        return decisionName;
    }

    /**
     * @param decisionName the decisionName to set
     */
    public void setDecisionName(String decisionName) {
        this.decisionName = decisionName;
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

    /**
     * @return the hostEventLogs
     */
    public Set<HostEventLog> getHostEventLogs() {
        return hostEventLogs;
    }

    /**
     * @param hostEventLogs the hostEventLogs to set
     */
    public void setHostEventLogs(Set<HostEventLog> hostEventLogs) {
        this.hostEventLogs = hostEventLogs;
    }

    /**
     * @return the serviceEventLogs
     */
    public Set<ServiceEventLog> getServiceEventLogs() {
        return serviceEventLogs;
    }

    /**
     * @param serviceEventLogs the serviceEventLogs to set
     */
    public void setServiceEventLogs(Set<ServiceEventLog> serviceEventLogs) {
        this.serviceEventLogs = serviceEventLogs;
    }

}