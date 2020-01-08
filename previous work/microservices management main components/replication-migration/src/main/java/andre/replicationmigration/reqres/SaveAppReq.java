package andre.replicationmigration.reqres;

public class SaveAppReq {

    private String appName;

    public SaveAppReq() {
    }

    public SaveAppReq(String appName) {
        this.appName = appName;
    }
    
    /**
     * @return the appName
     */
    public String getAppName() {
        return appName;
    }

    /**
     * @param appName the appName to set
     */
    public void setAppName(String appName) {
        this.appName = appName;
    }

}