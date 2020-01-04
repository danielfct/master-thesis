package andre.replicationmigration.model.rules;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "component_decision_service_log")
public class ComponentDecisionServiceLog {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "component_decision_log_id")
    private ComponentDecisionLog componentDecisionLog;

    @Column(name = "container_id")
    private String containerId;

    @Column(name = "service_name")
    private String serviceName;

    @Column(name = "other_info")
    private String otherInfo;

    public ComponentDecisionServiceLog() {
    }

    public ComponentDecisionServiceLog(ComponentDecisionLog componentDecisionLog, String containerId,
            String serviceName, String otherInfo) {
        this.componentDecisionLog = componentDecisionLog;
        this.containerId = containerId;
        this.serviceName = serviceName;
        this.otherInfo = otherInfo;
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
     * @return the otherInfo
     */
    public String getOtherInfo() {
        return otherInfo;
    }

    /**
     * @param otherInfo the otherInfo to set
     */
    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }

}