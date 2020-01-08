package andre.replicationmigration.nginx;

public class NginxSimpleServer {

    private String hostname;

    public NginxSimpleServer() {
    }

    public NginxSimpleServer(String hostname) {
        this.hostname = hostname;
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

}