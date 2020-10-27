package andre.replicationmigration.reqres;

public class MigrateContainerReq {

    private String fromHostname;
    private String containerId;
    private String toHostname;
    private int secondsBeforeStop;

    public MigrateContainerReq() {
    }

    public MigrateContainerReq(String fromHostname, String containerId, String toHostname, int secondsBeforeStop) {
        this.fromHostname = fromHostname;
        this.containerId = containerId;
        this.fromHostname = fromHostname;
        this.secondsBeforeStop = secondsBeforeStop;
    }

    /**
     * @return the fromHostname
     */
    public String getFromHostname() {
        return fromHostname;
    }

    /**
     * @param fromHostname the fromHostname to set
     */
    public void setFromHostname(String fromHostname) {
        this.fromHostname = fromHostname;
    }

    /**
     * @return the containerId
     */
    public String getContainerId() {
        return containerId;
    }

    /**
     * @param containerId the containerId to set
     */
    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    /**
     * @return the toHostname
     */
    public String getToHostname() {
        return toHostname;
    }

    /**
     * @param toHostname the toHostname to set
     */
    public void setToHostname(String toHostname) {
        this.toHostname = toHostname;
    }

    /**
     * @return the secondsBeforeStop
     */
    public int getSecondsBeforeStop() {
        return secondsBeforeStop;
    }

    /**
     * @param secondsBeforeStop the secondsBeforeStop to set
     */
    public void setSecondsBeforeStop(int secondsBeforeStop) {
        this.secondsBeforeStop = secondsBeforeStop;
    }

}
