package andre.replicationmigration.reqres;

public class SaveServiceConfigReq {

    private String serviceName;

    private String dockerRepo;

    private String defaultExternalPort;

    private String defaultInternalPort;

    private String defaultDb;

    private String launchCommand;

    private int minReplics;

    private int maxReplics;

    private String outputLabel;

    private String serviceType;

    public SaveServiceConfigReq() {
    }

    public SaveServiceConfigReq(String serviceName, String dockerRepo, String defaultExternalPort,
            String defaultInternalPort, String defaultDb, String launchCommand, int minReplics, int maxReplics,
            String outputLabel) {
        this.serviceName = serviceName;
        this.dockerRepo = dockerRepo;
        this.defaultExternalPort = defaultExternalPort;
        this.defaultInternalPort = defaultInternalPort;
        this.defaultDb = defaultDb;
        this.launchCommand = launchCommand;
        this.minReplics = minReplics;
        this.maxReplics = maxReplics;
        this.outputLabel = outputLabel;
    }

    /**
     * @return the serviceName
     */
    public String getServiceName() {
        return serviceName;
    }

    /**
     * @param serviceName the serviceName to set
     */
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    /**
     * @return the dockerRepo
     */
    public String getDockerRepo() {
        return dockerRepo;
    }

    /**
     * @param dockerRepo the dockerRepo to set
     */
    public void setDockerRepo(String dockerRepo) {
        this.dockerRepo = dockerRepo;
    }

    /**
     * @return the defaultExternalPort
     */
    public String getDefaultExternalPort() {
        return defaultExternalPort;
    }

    /**
     * @param defaultExternalPort the defaultExternalPort to set
     */
    public void setDefaultExternalPort(String defaultExternalPort) {
        this.defaultExternalPort = defaultExternalPort;
    }

    /**
     * @return the defaultInternalPort
     */
    public String getDefaultInternalPort() {
        return defaultInternalPort;
    }

    /**
     * @param defaultInternalPort the defaultInternalPort to set
     */
    public void setDefaultInternalPort(String defaultInternalPort) {
        this.defaultInternalPort = defaultInternalPort;
    }

    /**
     * @return the defaultDb
     */
    public String getDefaultDb() {
        return defaultDb;
    }

    /**
     * @param defaultDb the defaultDb to set
     */
    public void setDefaultDb(String defaultDb) {
        this.defaultDb = defaultDb;
    }

    /**
     * @return the launchCommand
     */
    public String getLaunchCommand() {
        return launchCommand;
    }

    /**
     * @param launchCommand the launchCommand to set
     */
    public void setLaunchCommand(String launchCommand) {
        this.launchCommand = launchCommand;
    }

    /**
     * @return the minReplics
     */
    public int getMinReplics() {
        return minReplics;
    }

    /**
     * @param minReplics the minReplics to set
     */
    public void setMinReplics(int minReplics) {
        this.minReplics = minReplics;
    }

    /**
     * @return the maxReplics
     */
    public int getMaxReplics() {
        return maxReplics;
    }

    /**
     * @param maxReplics the maxReplics to set
     */
    public void setMaxReplics(int maxReplics) {
        this.maxReplics = maxReplics;
    }

    /**
     * @return the outputLabel
     */
    public String getOutputLabel() {
        return outputLabel;
    }

    /**
     * @param outputLabel the outputLabel to set
     */
    public void setOutputLabel(String outputLabel) {
        this.outputLabel = outputLabel;
    }

    /**
     * @return the serviceType
     */
    public String getServiceType() {
        return serviceType;
    }

    /**
     * @param serviceType the serviceType to set
     */
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }
}