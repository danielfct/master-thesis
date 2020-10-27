package andre.replicationmigration.reqres;

import java.util.List;

import andre.replicationmigration.model.Region;

public class LaunchLoadBalacerReq {
    
    String serviceName;
    List<Region> regions;

    public LaunchLoadBalacerReq() {
    }

    public LaunchLoadBalacerReq(String serviceName, List<Region> regions) {
        this.serviceName = serviceName;
        this.regions = regions;
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
     * @return the regions
     */
    public List<Region> getRegions() {
        return regions;
    }

    /**
     * @param regions the regions to set
     */
    public void setRegions(List<Region> regions) {
        this.regions = regions;
    }
}