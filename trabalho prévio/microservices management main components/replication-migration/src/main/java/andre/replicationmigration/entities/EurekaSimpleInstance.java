package andre.replicationmigration.entities;

@Deprecated
public class EurekaSimpleInstance {

    private String id;
    private String appName;
    private String hostname;
    private int port;

    public EurekaSimpleInstance() {
    }

    public EurekaSimpleInstance(String id, String appName, String hostname, int port) {
        this.id = id;
        this.appName = appName;
        this.hostname = hostname;
        this.port = port;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    @Override
    public String toString() {
        return "EurekaSimpleInstance [id=" + id + ", appName=" + appName + ", hostname=" + hostname + ", port=" + port
                + "]";

    }

}