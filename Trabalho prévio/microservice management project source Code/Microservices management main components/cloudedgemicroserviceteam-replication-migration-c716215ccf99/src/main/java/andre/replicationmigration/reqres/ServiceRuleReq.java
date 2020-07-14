package andre.replicationmigration.reqres;

public class ServiceRuleReq {

    private long serviceId;
    private long ruleId;

    public ServiceRuleReq() {
    }

    public ServiceRuleReq(long serviceId, long ruleId) {
        this.serviceId = serviceId;
        this.ruleId = ruleId;
    }

    /**
     * @return the serviceId
     */
    public long getServiceId() {
        return serviceId;
    }

    /**
     * @param serviceId the serviceId to set
     */
    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
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