package andre.replicationmigration.model.rules;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "component_decision_host_log")
public class ComponentDecisionHostLog {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "component_decision_log_id")
    private ComponentDecisionLog componentDecisionLog;

    @Column(name = "hostname")
    private String hostname;

    public ComponentDecisionHostLog() {
    }

    public ComponentDecisionHostLog(ComponentDecisionLog componentDecisionLog, String hostname) {
        this.componentDecisionLog = componentDecisionLog;
        this.hostname = hostname;
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
     * @return the hostname
     */
    public String getHostname() {
        return hostname;
    }

    /**
     * @param hostname the hostname to set
     */
    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

}