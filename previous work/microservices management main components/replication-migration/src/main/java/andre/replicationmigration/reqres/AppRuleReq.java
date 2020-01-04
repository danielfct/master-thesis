package andre.replicationmigration.reqres;

public class AppRuleReq {

    private long appId;
    private long ruleId;

    public AppRuleReq() {
    }

    public AppRuleReq(long appId, long ruleId) {
        this.appId = appId;
        this.ruleId = ruleId;
    }

    /**
     * @return the appId
     */
    public long getAppId() {
        return appId;
    }

    /**
     * @param appId the appId to set
     */
    public void setAppId(long appId) {
        this.appId = appId;
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