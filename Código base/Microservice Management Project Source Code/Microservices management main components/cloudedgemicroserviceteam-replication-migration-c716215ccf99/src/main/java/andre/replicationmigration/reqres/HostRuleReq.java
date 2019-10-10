package andre.replicationmigration.reqres;

public class HostRuleReq {

    private String hostname;
    private long ruleId;

    public HostRuleReq() {
    }

    public HostRuleReq(String hostname, long ruleId) {
        this.hostname = hostname;
        this.ruleId = ruleId;
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
     * @return the ruleId
     */
    public long getRuleId() {
        return ruleId;
    }

    /**
     * @param ruleId the ruleId to set
     */
    public void setRuleId(long ruleId) {
        this.ruleId = ruleId;
    }

}