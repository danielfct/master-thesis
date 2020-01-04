package andre.replicationmigration.model.testslogs;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "monitoring_service_log_tests")
public class MonitoringServiceLogTests {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "container_id")
    private String containerId;

    @Column(name = "service_name")
    private String serviceName;

    @Column(name = "field")
    private String field;

    @Column(name = "last_update")
    private String lastUpdate;

    @Column(name = "effective_value")
    private double effectiveValue;    

    public MonitoringServiceLogTests() {
    }

    public MonitoringServiceLogTests(String containerId, String serviceName, String field, String lastUpdate, double effectiveValue) {
        this.containerId = containerId;
        this.serviceName = serviceName;
        this.field = field;
        this.lastUpdate = lastUpdate;
        this.effectiveValue = effectiveValue;        
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
     * @return the field
     */
    public String getField() {
        return field;
    }

    /**
     * @param field the field to set
     */
    public void setField(String field) {
        this.field = field;
    }

    /**
     * @return the lastUpdate
     */
    public String getLastUpdate() {
        return lastUpdate;
    }

    /**
     * @param lastUpdate the lastUpdate to set
     */
    public void setLastUpdate(String lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    /**
     * @return the effectiveValue
     */
    public double getEffectiveValue() {
        return effectiveValue;
    }

    /**
     * @param effectiveValue the effectiveValue to set
     */
    public void setEffectiveValue(double effectiveValue) {
        this.effectiveValue = effectiveValue;
    }
}