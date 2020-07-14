package andre.replicationmigration.reqres;

public class StopNodeReq {

    private String hostname;

    public StopNodeReq() {
    }

    public StopNodeReq(String hostname) {
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