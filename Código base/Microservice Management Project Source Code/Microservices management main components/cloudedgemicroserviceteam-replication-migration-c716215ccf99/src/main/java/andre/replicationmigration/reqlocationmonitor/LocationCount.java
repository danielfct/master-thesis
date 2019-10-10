package andre.replicationmigration.reqlocationmonitor;

public class LocationCount implements Comparable<LocationCount> {

    private String locationKey;
    private String region;
    private String country;
    private String city;
    private double countPercentage;
    private int runningContainersOnLocal;
    private int runningContainersOnCountry;
    private int runningContainersOnRegion;

    public LocationCount(String locationKey, String region, String country, String city, double countPercentage,
            int runningContainersOnLocal, int runningContainersOnCountry, int runningContainersOnRegion) {
        this.locationKey = locationKey;
        this.region = region;
        this.country = country;
        this.city = city;
        this.countPercentage = countPercentage;
        this.runningContainersOnLocal = runningContainersOnLocal;
        this.runningContainersOnCountry = runningContainersOnCountry;
        this.runningContainersOnRegion = runningContainersOnRegion;
    }

    /**
     * @return the locationKey
     */
    public String getLocationKey() {
        return locationKey;
    }

    /**
     * @return the region
     */
    public String getRegion() {
        return region;
    }

    /**
     * @param region the region to set
     */
    public void setRegion(String region) {
        this.region = region;
    }

    /**
     * @return the country
     */
    public String getCountry() {
        return country;
    }

    /**
     * @param country the country to set
     */
    public void setCountry(String country) {
        this.country = country;
    }

    /**
     * @return the city
     */
    public String getCity() {
        return city;
    }

    /**
     * @param city the city to set
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * @param locationKey the locationKey to set
     */
    public void setLocationKey(String locationKey) {
        this.locationKey = locationKey;
    }

    /**
     * @return the countPercentage
     */
    public double getCountPercentage() {
        return countPercentage;
    }

    /**
     * @param countPercentage the countPercentage to set
     */
    public void setCountPercentage(double countPercentage) {
        this.countPercentage = countPercentage;
    }

    /**
     * @return the runningContainersOnLocal
     */
    public int getRunningContainersOnLocal() {
        return runningContainersOnLocal;
    }

    /**
     * @param runningContainersOnLocal the runningContainersOnLocal to set
     */
    public void setRunningContainersOnLocal(int runningContainersOnLocal) {
        this.runningContainersOnLocal = runningContainersOnLocal;
    }

    /**
     * @return the runningContainersOnCountry
     */
    public int getRunningContainersOnCountry() {
        return runningContainersOnCountry;
    }

    /**
     * @param runningContainersOnCountry the runningContainersOnCountry to set
     */
    public void setRunningContainersOnCountry(int runningContainersOnCountry) {
        this.runningContainersOnCountry = runningContainersOnCountry;
    }

    /**
     * @return the runningContainersOnRegion
     */
    public int getRunningContainersOnRegion() {
        return runningContainersOnRegion;
    }

    /**
     * @param runningContainersOnRegion the runningContainersOnRegion to set
     */
    public void setRunningContainersOnRegion(int runningContainersOnRegion) {
        this.runningContainersOnRegion = runningContainersOnRegion;
    }

    @Override
    public int compareTo(LocationCount o) {
       return compareByRegion(o);
    }

    private int compareByCity(LocationCount o) {
        if (!this.getCity().equals("") && !o.getCity().equals("")) {
            if (this.getCity().equals(o.getCity()))
                return 0;
            else if (this.getRunningContainersOnLocal() == 0 && o.getRunningContainersOnLocal() > 0)
                return -1;
            else if (this.getRunningContainersOnLocal() > 0 && o.getRunningContainersOnLocal() == 0)
                return 1;
            else {
                double thisSafeRunningContainersOnLocal = this.getRunningContainersOnLocal() == 0 ? 1
                        : this.getRunningContainersOnLocal();
                double oSafeRunningContainersOnLocal = o.getRunningContainersOnLocal() == 0 ? 1
                        : o.getRunningContainersOnLocal();
                double thisPercByContainerLocal = this.getCountPercentage() / thisSafeRunningContainersOnLocal;
                double oPercByContainerLocal = o.getCountPercentage() / oSafeRunningContainersOnLocal;
                if (thisPercByContainerLocal > oPercByContainerLocal)
                    return -1;
                else if (thisPercByContainerLocal < oPercByContainerLocal)
                    return 1;
                else
                    return 0;
            }
        } else if (this.getRunningContainersOnCountry() == 0) {
            if (this.getCity().equals("") && !o.getCity().equals(""))
                return -1;
            else if (!this.getCity().equals("") && o.getCity().equals(""))
                return 1;
            else
                return 0;
        } else {
            if (!this.getCity().equals("") && o.getCity().equals(""))
                return -1;
            else if (this.getCity().equals("") && !o.getCity().equals(""))
                return 1;
            else
                return 0;
        }
    }

    private int compareByCountry(LocationCount o) {
        if (!this.getCountry().equals("") && !o.getCountry().equals("")) {
            if (this.getCountry().equals(o.getCountry()))
                return compareByCity(o);
            else if (this.getRunningContainersOnCountry() == 0 && o.getRunningContainersOnCountry() > 0)
                return -1;
            else if (this.getRunningContainersOnCountry() > 0 && o.getRunningContainersOnCountry() == 0)
                return 1;
            else {
                double thisSafeRunningContainersOnCountry = this.getRunningContainersOnCountry() == 0 ? 1
                        : this.getRunningContainersOnCountry();
                double oSafeRunningContainersOnCountry = o.getRunningContainersOnCountry() == 0 ? 1
                        : o.getRunningContainersOnCountry();
                double thisPercByContainerCountry = this.getCountPercentage() / thisSafeRunningContainersOnCountry;
                double oPercByContainerCountry = o.getCountPercentage() / oSafeRunningContainersOnCountry;
                if (thisPercByContainerCountry > oPercByContainerCountry)
                    return -1;
                else if (thisPercByContainerCountry < oPercByContainerCountry)
                    return 1;
                else
                    return 0;
            }
        } else if (this.getRunningContainersOnRegion() == 0) {
            if (this.getCountry().equals("") && !o.getCountry().equals(""))
                return -1;
            else if (!this.getCountry().equals("") && o.getCountry().equals(""))
                return 1;
            else
                return 0;
        } else {
            if (!this.getCountry().equals("") && o.getCountry().equals(""))
                return -1;
            else if (this.getCountry().equals("") && !o.getCountry().equals(""))
                return 1;
            else
                return 0;
        }
    }

    private int compareByRegion(LocationCount o) {
        if (this.getRegion().equals(o.getRegion()))
            return compareByCountry(o);
        else if (this.getRunningContainersOnRegion() == 0 && o.getRunningContainersOnRegion() > 0)
            return -1;
        else if (this.getRunningContainersOnRegion() > 0 && o.getRunningContainersOnRegion() == 0)
            return 1;
        else {
            double thisSafeRunningContainersOnRegion = this.getRunningContainersOnRegion() == 0 ? 1
                    : this.getRunningContainersOnRegion();
            double oSafeRunningContainersOnRegion = o.getRunningContainersOnRegion() == 0 ? 1
                    : o.getRunningContainersOnRegion();
            double thisPercByContainerRegion = this.getCountPercentage() / thisSafeRunningContainersOnRegion;
            double oPercByContainerRegion = o.getCountPercentage() / oSafeRunningContainersOnRegion;
            if (thisPercByContainerRegion > oPercByContainerRegion)
                return -1;
            else if (thisPercByContainerRegion < oPercByContainerRegion)
                return 1;
            else
                return 0;
        }
    }

    @Override
    public String toString() {
        return "{ locationKey=" + locationKey + "; countPercentage=" + countPercentage + "; runningContainersOnLocal=" 
        + runningContainersOnLocal + "; runningContainersOnCountry=" + runningContainersOnCountry + "; runningContainersOnRegion=" + runningContainersOnRegion + " }";
    }

}