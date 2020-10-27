package andre.replicationmigration.model.metrics;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "specific_host_simulated_metrics")
public class SpecificHostSimulatedMetrics {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "hostname")
    private String hostname;

    @Column(name = "field")
    private String field;

    @Column(name = "min_value")
    private double minValue;

    @Column(name = "max_value")
    private double maxValue;

    @Column(name = "override")
    private boolean override;

    public SpecificHostSimulatedMetrics() {
    }

    public SpecificHostSimulatedMetrics(String hostname, String field, double minValue, double maxValue,
            boolean override) {
        this.hostname = hostname;
        this.field = field;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.override = override;
    }

    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
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
     * @return the override
     */
    public boolean getOverride() {
        return override;
    }

    /**
     * @param override the override to set
     */
    public void setOverride(boolean override) {
        this.override = override;
    }

}