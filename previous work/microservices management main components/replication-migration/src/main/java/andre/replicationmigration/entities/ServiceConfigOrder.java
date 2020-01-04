package andre.replicationmigration.entities;

import andre.replicationmigration.model.ServiceConfig;

public class ServiceConfigOrder {

    private ServiceConfig serviceConfig;

    private int launchOrder;

    public ServiceConfigOrder() {
    }

    public ServiceConfigOrder(ServiceConfig serviceConfig, int launchOrder) {
        this.serviceConfig = serviceConfig;
        this.launchOrder = launchOrder;
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

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "ServiceConfigOrder [serviceConfig=" + serviceConfig + ", launchOrder=" + launchOrder + "]";
    }

}