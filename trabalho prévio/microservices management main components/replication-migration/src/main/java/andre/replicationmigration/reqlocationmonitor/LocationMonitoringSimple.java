package andre.replicationmigration.reqlocationmonitor;


public class LocationMonitoringSimple {

    private String fromContinent;
    private String fromRegion;
    private String fromCountry;
    private String fromCity;
    private String toService;
    private int count;
    
    public LocationMonitoringSimple() {
    }

    public LocationMonitoringSimple(String fromContinent, String fromRegion, String fromCountry, String fromCity, String toService, int count) {
        this.setFromContinent(fromContinent);
        this.setFromRegion(fromRegion);
        this.setFromCountry(fromCountry);
        this.setFromCity(fromCity);
        this.setToService(toService);
        this.setCount(count);
    }

    /**
     * @return the fromContinent
     */
    public String getFromContinent() {
        return fromContinent;
    }

    /**
     * @param fromContinent the fromContinent to set
     */
    public void setFromContinent(String fromContinent) {
        if(fromContinent != null)
            this.fromContinent = fromContinent;
        else
            fromContinent = "";
    }

    /**
     * @return the fromRegion
     */
    public String getFromRegion() {
        return fromRegion;
    }

    /**
     * @param fromRegion the fromRegion to set
     */
    public void setFromRegion(String fromRegion) {
        if(fromRegion != null)
            this.fromRegion = fromRegion;
        else
            this.fromRegion = "";
    }

    /**
     * @return the fromCountry
     */
    public String getFromCountry() {
        return fromCountry;
    }

    /**
     * @param fromCountry the fromCountry to set
     */
    public void setFromCountry(String fromCountry) {
        if(fromCountry != null)
            this.fromCountry = fromCountry;
        else
            this.fromCountry = "";
    }

    /**
     * @return the fromCity
     */
    public String getFromCity() {
        return fromCity;
    }

    /**
     * @param fromCity the fromCity to set
     */
    public void setFromCity(String fromCity) {
        if(fromCity != null)
            this.fromCity = fromCity;
        else
            this.fromCity = "";
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
        if(toService != null)
            this.toService = toService;
        else
            this.toService = "";
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