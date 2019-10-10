package andre.replicationmigration.reqlocationmonitor;


public class LocationMonitoringResp {

    private String toService;
    private LocationMonitoringSimple locationData;

    public LocationMonitoringResp() {
    }

    public LocationMonitoringResp(String toService, LocationMonitoringSimple locationData) {
        this.toService = toService;
        this.locationData = locationData;
    }

    /**
     * @return the toService
     */
    public String getToService() {
        return toService;
    }

    /**
     * @param toService the toService to set
     */
    public void setToService(String toService) {
        this.toService = toService;
    }

    /**
     * @return the locationData
     */
    public LocationMonitoringSimple getLocationData() {
        return locationData;
    }

    /**
     * @param locationData the locationData to set
     */
    public void setLocationData(LocationMonitoringSimple locationData) {
        this.locationData = locationData;
    }
}