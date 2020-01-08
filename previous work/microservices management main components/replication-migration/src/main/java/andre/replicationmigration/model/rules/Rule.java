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
@Table(name = "rule")
public class Rule {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "rule_name")
    private String ruleName;

    @ManyToOne
    @JoinColumn(name = "component_type_id")
    private ComponentType componentType;

    @Column(name = "priority")
    private int priority;

    @ManyToOne
    @JoinColumn(name = "decision_id")
    private Decision decision;

    @JsonIgnore
	@OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<RuleCondition> ruleConditions = new HashSet<>();

    @JsonIgnore
	@OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AppRule> appRules = new HashSet<>();

    @JsonIgnore
	@OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ServiceRule> serviceRules = new HashSet<>();
    
    @JsonIgnore
	@OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HostRule> hostRules = new HashSet<>();
    
    @JsonIgnore
	@OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GenericHostRule> genericHostRules = new HashSet<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ComponentDecisionLog> componentDecisionLogs = new HashSet<>();

    public Rule() {
    }

    public Rule(String ruleName, ComponentType componentType, int priority, Decision decision) {
        this.ruleName = ruleName;
        this.componentType = componentType;
        this.priority = priority;
        this.decision = decision;
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
     * @return the ruleName
     */
    public String getRuleName() {
        return ruleName;
    }

    /**
     * @param ruleName the ruleName to set
     */
    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
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
     * @return the priority
     */
    public int getPriority() {
        return priority;
    }

    /**
     * @param priority the priority to set
     */
    public void setPriority(int priority) {
        this.priority = priority;
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

    /**
	 * @return the appRules
	 */
	public Set<AppRule> getAppRules() {
		return appRules;
	}

	/**
	 * @param appRules the appRules to set
	 */
	public void setAppRules(Set<AppRule> appRules) {
		this.appRules = appRules;
    }

    /**
	 * @return the serviceRules
	 */
	public Set<ServiceRule> getServiceRules() {
		return serviceRules;
	}

	/**
	 * @param serviceRules the serviceRules to set
	 */
	public void setServiceRules(Set<ServiceRule> serviceRules) {
		this.serviceRules = serviceRules;
    }
    
    /**
     * @return the hostRules
     */
    public Set<HostRule> getHostRules() {
        return hostRules;
    }

    /**
     * @param hostRules the hostRules to set
     */
    public void setHostRules(Set<HostRule> hostRules) {
        this.hostRules = hostRules;
    }

    /**
     * @return the genericHostRules
     */
    public Set<GenericHostRule> getGenericHostRules() {
        return genericHostRules;
    }

    /**
     * @param genericHostRules the genericHostRules to set
     */
    public void setGenericHostRules(Set<GenericHostRule> genericHostRules) {
        this.genericHostRules = genericHostRules;
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