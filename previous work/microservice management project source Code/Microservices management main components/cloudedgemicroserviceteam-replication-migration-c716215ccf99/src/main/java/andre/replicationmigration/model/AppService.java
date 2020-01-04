package andre.replicationmigration.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "app_service")
public class AppService {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "app_package_id")
    private AppPackage appPackage;

    @ManyToOne
    @JoinColumn(name = "service_config_id")
    private ServiceConfig serviceConfig;

    @Column(name = "launch_order")
    private int launchOrder;

    public AppService() {

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
     * @return the appPackage
     */
    public AppPackage getAppPackage() {
        return appPackage;
    }

    /**
     * @param appPackage the appPackage to set
     */
    public void setAppPackage(AppPackage appPackage) {
        this.appPackage = appPackage;
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
     * @return the launchOrder
     */
    public int getLaunchOrder() {
        return launchOrder;
    }

    /**
     * @param launchOrder the launchOrder to set
     */
    public void setLaunchOrder(int launchOrder) {
        this.launchOrder = launchOrder;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((appPackage == null) ? 0 : appPackage.hashCode());
        result = prime * result + launchOrder;
        result = prime * result + ((serviceConfig == null) ? 0 : serviceConfig.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        AppService other = (AppService) obj;
        if (appPackage == null) {
            if (other.appPackage != null)
                return false;
        } else if (!appPackage.equals(other.appPackage))
            return false;
        if (launchOrder != other.launchOrder)
            return false;
        if (serviceConfig == null) {
            if (other.serviceConfig != null)
                return false;
        } else if (!serviceConfig.equals(other.serviceConfig))
            return false;
        return true;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "AppService [id=" + id + ", appPackage=" + appPackage + ", serviceConfig=" + serviceConfig
                + ", launchOrder=" + launchOrder + "]";
    }

}