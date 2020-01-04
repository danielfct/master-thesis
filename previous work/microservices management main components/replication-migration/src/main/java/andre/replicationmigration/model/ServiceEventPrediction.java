package andre.replicationmigration.model;

import java.sql.Timestamp;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "service_event_prediction")
public class ServiceEventPrediction {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(name = "service_config_id")
    @ManyToOne
    private ServiceConfig serviceConfig;

    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "start_date")
    private Timestamp startDate;

    @Basic
    @Column(name = "end_date")
    private Timestamp endDate;

    @Column(name = "min_replics")
    private int minReplics;

    @Basic
    @Column(name = "last_update")
    private Timestamp lastUpdate;

    public ServiceEventPrediction() {

    }

    public ServiceEventPrediction(ServiceConfig serviceConfig, String description, Timestamp startDate,
            Timestamp endDate, int minReplics, Timestamp lastUpdate) {
        this.serviceConfig = serviceConfig;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.minReplics = minReplics;
        this.lastUpdate = lastUpdate;
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
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the startDate
     */
    public Timestamp getStartDate() {
        return startDate;
    }

    /**
     * @param startDate the startDate to set
     */
    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the endDate
     */
    public Timestamp getEndDate() {
        return endDate;
    }

    /**
     * @param endDate the endDate to set
     */
    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    /**
     * @return the minReplics
     */
    public int getMinReplics() {
        return minReplics;
    }

    /**
     * @param minReplics the minReplics to set
     */
    public void setMinReplics(int minReplics) {
        this.minReplics = minReplics;
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