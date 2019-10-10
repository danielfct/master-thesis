package andre.replicationmigration.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("replic.prop")
public class ReplicationProperties {

    /**
     * Path to AWS key file
     */
    private String awsKeyFilePath;

    /**
     * Aws username
     */
    private String awsUsername;

    /**
     * Aws access key
     */
    private String awsAccessKey;

    /**
     * Aws secret access key
     */
    private String awsSecretAccessKey;

    /**
     * Initial max instances running on AWS
     */
    private int awsInitialMaxInstances;

    /**
     * Docker proxy username
     */
    private String dockerApiProxyUsername;

    /**
     * Docker proxy password
     */
    private String dockerApiProxyPassword;

    /**
     * Path to docker init script file
     */
    private String dockerInitScriptPath;

    /**
     * Docker master node hostname
     */
    private String dockerMasterNodeHostname;

    /**
     * Seconds before stop old container on migration
     */
    private int dockerSecondsBeforeStopContainer;

    /**
     * Nginx load balancer API URL
     */
    private String nginxLoadBalancerApiUrl;

    /**
     * Interval for monitor containers (in milliseconds)
     */
    private int containerMonitorInterval;

    /**
     * Interval for monitor hosts (in milliseconds)
     */
    private int hostMonitorInterval;

    /**
     * Container events count to apply a stop decision
     */
    private int containerEventLogsCountStop;

    /**
     * Container events count to apply a replication/migration decision
     */
    private int containerEventLogsCountRepMig;


    /**
     * Host events count to apply a decision
     */
    private int hostEventLogsCount;

    /**
     * Minimum hosts
     */
    private int minHosts;

    /**
     * Maximum hosts
     */
    private int maxHosts;

    /**
     * AWS instance type
     */
    private String awsInstanceType;

    /**
     * Host max ram percentage
     */
    private double hostMaxRamPerc;

    /**
     * Host max cpu percentage
     */
    private double hostMaxCpuPerc;

    /**
     * Aws delay to start componentes (in milliseconds)
     */
    private int awsDelay;

    /**
     * Is Tests Logs active
     */
    private boolean testsLogsActive;

    /**
     * Container database delay before start service
     */
    private int containerDatabaseDelay;

    /**
     * Replication-migration hostname
     */
    private String repMigHostname;

    /**
     * Interval for monitor replication-migration (in milliseconds)
     */
    private int repMigMonitorInterval;

    /**
     * Minimum requests percentage to launch service
     */
    private double minReqCountPercentage;

    /**
     * @return the awsKeyFilePath
     */
    public String getAwsKeyFilePath() {
        return awsKeyFilePath;
    }

    /**
     * @param awsKeyFilePath the awsKeyFilePath to set
     */
    public void setAwsKeyFilePath(String awsKeyFilePath) {
        this.awsKeyFilePath = awsKeyFilePath;
    }

    /**
     * @return the awsUsername
     */
    public String getAwsUsername() {
        return awsUsername;
    }

    /**
     * @param awsUsername the awsUsername to set
     */
    public void setAwsUsername(String awsUsername) {
        this.awsUsername = awsUsername;
    }

    /**
     * @return the awsAccessKey
     */
    public String getAwsAccessKey() {
        return awsAccessKey;
    }

    /**
     * @param awsAccessKey the awsAccessKey to set
     */
    public void setAwsAccessKey(String awsAccessKey) {
        this.awsAccessKey = awsAccessKey;
    }

    /**
     * @return the awsSecretAccessKey
     */
    public String getAwsSecretAccessKey() {
        return awsSecretAccessKey;
    }

    /**
     * @param awsSecretAccessKey the awsSecretAccessKey to set
     */
    public void setAwsSecretAccessKey(String awsSecretAccessKey) {
        this.awsSecretAccessKey = awsSecretAccessKey;
    }

    /**
     * @return the awsInitialMaxInstances
     */
    public int getAwsInitialMaxInstances() {
        return awsInitialMaxInstances;
    }

    /**
     * @param awsInitialMaxInstances the awsInitialMaxInstances to set
     */
    public void setAwsInitialMaxInstances(int awsInitialMaxInstances) {
        this.awsInitialMaxInstances = awsInitialMaxInstances;
    }

    /**
     * @return the dockerApiProxyUsername
     */
    public String getDockerApiProxyUsername() {
        return dockerApiProxyUsername;
    }

    /**
     * @param dockerApiProxyUsername the dockerApiProxyUsername to set
     */
    public void setDockerApiProxyUsername(String dockerApiProxyUsername) {
        this.dockerApiProxyUsername = dockerApiProxyUsername;
    }

    /**
     * @return the dockerApiProxyPassword
     */
    public String getDockerApiProxyPassword() {
        return dockerApiProxyPassword;
    }

    /**
     * @param dockerApiProxyPassword the dockerApiProxyPassword to set
     */
    public void setDockerApiProxyPassword(String dockerApiProxyPassword) {
        this.dockerApiProxyPassword = dockerApiProxyPassword;
    }

    /**
     * @return the dockerInitScriptPath
     */
    public String getDockerInitScriptPath() {
        return dockerInitScriptPath;
    }

    /**
     * @param dockerInitScriptPath the dockerInitScriptPath to set
     */
    public void setDockerInitScriptPath(String dockerInitScriptPath) {
        this.dockerInitScriptPath = dockerInitScriptPath;
    }

    /**
     * @return the dockerMasterNodeHostname
     */
    public String getDockerMasterNodeHostname() {
        return dockerMasterNodeHostname;
    }

    /**
     * @param dockerMasterNodeHostname the dockerMasterNodeHostname to set
     */
    public void setDockerMasterNodeHostname(String dockerMasterNodeHostname) {
        this.dockerMasterNodeHostname = dockerMasterNodeHostname;
    }

    /**
     * @return the dockerSecondsBeforeStopContainer
     */
    public int getDockerSecondsBeforeStopContainer() {
        return dockerSecondsBeforeStopContainer;
    }

    /**
     * @param dockerSecondsBeforeStopContainer the dockerSecondsBeforeStopContainer
     *                                         to set
     */
    public void setDockerSecondsBeforeStopContainer(int dockerSecondsBeforeStopContainer) {
        this.dockerSecondsBeforeStopContainer = dockerSecondsBeforeStopContainer;
    }

    /**
     * @return the nginxLoadBalancerApiUrl
     */
    public String getNginxLoadBalancerApiUrl() {
        return nginxLoadBalancerApiUrl;
    }

    /**
     * @param nginxLoadBalancerApiUrl the nginxLoadBalancerApiUrl to set
     */
    public void setNginxLoadBalancerApiUrl(String nginxLoadBalancerApiUrl) {
        this.nginxLoadBalancerApiUrl = nginxLoadBalancerApiUrl;
    }

    /**
     * @return the containerMonitorInterval
     */
    public int getContainerMonitorInterval() {
        return containerMonitorInterval;
    }

    /**
     * @param containerMonitorInterval the containerMonitorInterval to set
     */
    public void setContainerMonitorInterval(int containerMonitorInterval) {
        this.containerMonitorInterval = containerMonitorInterval;
    }

    /**
     * @return the hostMonitorInterval
     */
    public int getHostMonitorInterval() {
        return hostMonitorInterval;
    }

    /**
     * @param hostEventLogsCount the hostEventLogsCount to set
     */
    public void setHostEventLogsCount(int hostEventLogsCount) {
        this.hostEventLogsCount = hostEventLogsCount;
    }

    /**
     * @return the containerEventLogsCountStop
     */
    public int getContainerEventLogsCountStop() {
        return containerEventLogsCountStop;
    }

    /**
     * @param containerEventLogsCountStop the containerEventLogsCountStop to set
     */
    public void setContainerEventLogsCountStop(int containerEventLogsCountStop) {
        this.containerEventLogsCountStop = containerEventLogsCountStop;
    }

     /**
     * @return the containerEventLogsCountRepMig
     */
    public int getContainerEventLogsCountRepMig() {
        return containerEventLogsCountRepMig;
    }

    /**
     * @param containerEventLogsCountRepMig the containerEventLogsCountRepMig to set
     */
    public void setContainerEventLogsCountRepMig(int containerEventLogsCountRepMig) {
        this.containerEventLogsCountRepMig = containerEventLogsCountRepMig;
    }

    /**
     * @return the hostEventLogsCount
     */
    public int getHostEventLogsCount() {
        return hostEventLogsCount;
    }

    /**
     * @param hostMonitorInterval the hostMonitorInterval to set
     */
    public void setHostMonitorInterval(int hostMonitorInterval) {
        this.hostMonitorInterval = hostMonitorInterval;
    }

    /**
     * @return the minHosts
     */
    public int getMinHosts() {
        return minHosts;
    }

    /**
     * @param minHosts the minHosts to set
     */
    public void setMinHosts(int minHosts) {
        this.minHosts = minHosts;
    }

    /**
     * @return the maxHosts
     */
    public int getMaxHosts() {
        return maxHosts;
    }

    /**
     * @param maxHosts the maxHosts to set
     */
    public void setMaxHosts(int maxHosts) {
        this.maxHosts = maxHosts;
    }

    /**
     * @return the awsInstanceType
     */
    public String getAwsInstanceType() {
        return awsInstanceType;
    }

    /**
     * @param awsInstanceType the awsInstanceType to set
     */
    public void setAwsInstanceType(String awsInstanceType) {
        this.awsInstanceType = awsInstanceType;
    }

    /**
     * @return the hostMaxRamPerc
     */
    public double getHostMaxRamPerc() {
        return hostMaxRamPerc;
    }

    /**
     * @param hostMaxRamPerc the hostMaxRamPerc to set
     */
    public void setHostMaxRamPerc(double hostMaxRamPerc) {
        this.hostMaxRamPerc = hostMaxRamPerc;
    }

    /**
     * @return the hostMaxCpuPerc
     */
    public double getHostMaxCpuPerc() {
        return hostMaxCpuPerc;
    }

    /**
     * @param hostMaxCpuPerc the hostMaxCpuPerc to set
     */
    public void setHostMaxCpuPerc(double hostMaxCpuPerc) {
        this.hostMaxCpuPerc = hostMaxCpuPerc;
    }

    /**
     * @return the awsDelay
     */
    public int getAwsDelay() {
        return awsDelay;
    }

    /**
     * @param awsDelay the awsDelay to set
     */
    public void setAwsDelay(int awsDelay) {
        this.awsDelay = awsDelay;
    }

    /**
     * @return the testsLogsActive
     */
    public boolean getTestsLogsActive() {
        return testsLogsActive;
    }

    /**
     * @param testsLogsActive the testsLogsActive to set
     */
    public void setTestsLogsActive(boolean testsLogsActive) {
        this.testsLogsActive = testsLogsActive;
    }

    /**
     * @return the containerDatabaseDelay
     */
    public int getContainerDatabaseDelay() {
        return containerDatabaseDelay;
    }

    /**
     * @param containerDatabaseDelay the containerDatabaseDelay to set
     */
    public void setContainerDatabaseDelay(int containerDatabaseDelay) {
        this.containerDatabaseDelay = containerDatabaseDelay;
    }

    /**
     * @return the repMigHostname
     */
    public String getRepMigHostname() {
        return repMigHostname;
    }

    /**
     * @param repMigHostname the repMigHostname to set
     */
    public void setRepMigHostname(String repMigHostname) {
        this.repMigHostname = repMigHostname;
    }

    /**
     * @return the repMigMonitorInterval
     */
    public int getRepMigMonitorInterval() {
        return repMigMonitorInterval;
    }

    /**
     * @param repMigMonitorInterval the repMigMonitorInterval to set
     */
    public void setRepMigMonitorInterval(int repMigMonitorInterval) {
        this.repMigMonitorInterval = repMigMonitorInterval;
    }

    /**
     * @return the minReqCountPercentage
     */
    public double getMinReqCountPercentage() {
        return minReqCountPercentage;
    }

    /**
     * @param minReqCountPercentage the minReqCountPercentage to set
     */
    public void setMinReqCountPercentage(double minReqCountPercentage) {
        this.minReqCountPercentage = minReqCountPercentage;
    }
}