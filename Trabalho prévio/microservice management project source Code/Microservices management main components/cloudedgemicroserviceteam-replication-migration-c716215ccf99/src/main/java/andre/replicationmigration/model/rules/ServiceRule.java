package andre.replicationmigration.model.rules;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import andre.replicationmigration.model.ServiceConfig;

@Entity
@Table(name = "service_rule")
public class ServiceRule {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "service_config_id")
    private ServiceConfig serviceConfig;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private Rule rule;

    public ServiceRule() {
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
     * @return the serviceConfig
     */
    public ServiceConfig getServiceConfig() {
        return serviceConfig;
    }

    /**
     * @param serviceConfig the serviceConfig to set
     */
    public void setServiceConfig(ServiceConfig serviceConfig) {
        this.serviceConfig = serviceConfig;
    }

    /**
     * @return the rule
     */
    public Rule getRule() {
        return rule;
    }

    /**
     * @param rule the rule to set
     */
    public void setRule(Rule rule) {
        this.rule = rule;
    }

}