package andre.replicationmigration.reqres;

public class AwsStopServiceReq {

    private String serviceId;

    public AwsStopServiceReq() {

    }

    public AwsStopServiceReq(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    @Override
    public String toString() {
        return "StopServiceReq [serviceId=" + serviceId + "]";
    }

}
