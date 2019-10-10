package andre.replicationmigration.nginx;

public class NginxServer {

    private String hostname;
    private String continent;
    private String region;
    private String country;
    private String city;

    public NginxServer() {
    }

    public NginxServer(String hostname, String continent, String region, String country, String city) {
        this.hostname = hostname;
        this.continent = continent;
        this.region = region;
        this.country = country;
        this.city = city;
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
     * @return the continent
     */
    public String getContinent() {
        return continent;
    }

    /**
     * @param continent the continent to set
     */
    public void setContinent(String continent) {
        this.continent = continent;
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

}