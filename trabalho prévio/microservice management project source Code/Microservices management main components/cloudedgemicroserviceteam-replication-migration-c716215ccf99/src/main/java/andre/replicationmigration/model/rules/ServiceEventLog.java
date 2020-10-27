package andre.replicationmigration.model.rules;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "service_event_log")
public class ServiceEventLog {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "container_id")
    private String containerId;

    @Column(name = "service_name")
    private String serviceName;

    @ManyToOne
    @JoinColumn(name = "decision_id")
    private Decision decision;

    @Column(name = "count")
    private int count;

    public ServiceEventLog() {
    }

    public ServiceEventLog(String containerId, String serviceName, Decision decision, int count) {
        this.containerId = containerId;
        this.serviceName = serviceName;
        this.decision = decision;
        this.count = count;
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
     * @return the containerId
     */
    public String getContainerId() {
        return containerId;
    }

    /**
     * @param containerId the containerId to set
     */
    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    /**
     * @return the serviceName
     */
    public String getServiceName() {
        return serviceName;
    }

    /**
     * @param serviceName the serviceName to set
     */
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
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
     * @return the count
     */
    public int getCount() {
        return count;
    }

    /**
     * @param count the count to set
     */
    public void setCount(int count) {
        this.count = count;
    }

}