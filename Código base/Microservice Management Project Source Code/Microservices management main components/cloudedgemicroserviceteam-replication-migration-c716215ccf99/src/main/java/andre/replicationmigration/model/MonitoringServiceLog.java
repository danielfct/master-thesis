package andre.replicationmigration.model;

import java.sql.Timestamp;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "monitoring_service_log")
public class MonitoringServiceLog {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "container_id")
    private String containerId;

    @Column(name = "service_name")
    private String serviceName;

    @Column(name = "field")
    private String field;

    @Column(name = "min_value")
    private double minValue;

    @Column(name = "max_value")
    private double maxValue;

    @Column(name = "sum_value")
    private double sumValue;

    @Column(name = "last_value")
    private double lastValue;

    @Column(name = "count")
    private long count;

    @Basic
    @Column(name = "last_update")
    private Timestamp lastUpdate;

    public MonitoringServiceLog() {
    }

    public MonitoringServiceLog(String containerId, String serviceName, String field, double minValue, double maxValue,
            double sumValue, double lastValue, long count, Timestamp lastUpdate) {
        this.containerId = containerId;
        this.serviceName = serviceName;
        this.field = field;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.sumValue = sumValue;
        this.lastValue = lastValue;
        this.count = count;
        this.lastUpdate = lastUpdate;
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
     * @return the minValue
     */
    public double getMinValue() {
        return minValue;
    }

    /**
     * @param minValue the minValue to set
     */
    public void setMinValue(double minValue) {
        this.minValue = minValue;
    }

    /**
     * @return the maxValue
     */
    public double getMaxValue() {
        return maxValue;
    }

    /**
     * @param maxValue the maxValue to set
     */
    public void setMaxValue(double maxValue) {
        this.maxValue = maxValue;
    }

    /**
     * @return the sumValue
     */
    public double getSumValue() {
        return sumValue;
    }

    /**
     * @param sumValue the sumValue to set
     */
    public void setSumValue(double sumValue) {
        this.sumValue = sumValue;
    }

    /**
     * @return the lastValue
     */
    public double getLastValue() {
        return lastValue;
    }

    /**
     * @param lastValue the lastValue to set
     */
    public void setLastValue(double lastValue) {
        this.lastValue = lastValue;
    }

    /**
     * @return the count
     */
    public long getCount() {
        return count;
    }

    /**
     * @param count the count to set
     */
    public void setCount(long count) {
        this.count = count;
    }

    /**
     * @return the lastUpdate
     */
    public Timestamp getLastUpdate() {
        return lastUpdate;
    }

    /**
     * @param lastUpdate the lastUpdate to set
     */
    public void setLastUpdate(Timestamp lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

}