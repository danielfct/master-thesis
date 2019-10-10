package andre.replicationmigration.reqres;

public class AwsLaunchServiceReq {

	private String instanceId, service, internalPort, externalPort, eurekaHost, database;

	public AwsLaunchServiceReq(){}

	public AwsLaunchServiceReq(String instanceId,String service, String internalPort,
			String externalPort, boolean isLocal, String eurekaHost, String database) {		
		this.instanceId = instanceId;
		this.service = service;
		this.internalPort = internalPort;
		this.externalPort = externalPort;
		this.eurekaHost = eurekaHost;
		this.database = database;
	}

	public String getInstanceId() {
		return instanceId;
	}

	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}

	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
	}

	public String getInternalPort() {
		return internalPort;
	}

	public void setInternalPort(String internalPort) {
		this.internalPort = internalPort;
	}

	public String getExternalPort() {
		return externalPort;
	}

	public void setExternalPort(String externalPort) {
		this.externalPort = externalPort;
	}

	public String getEurekaHost() {
		return eurekaHost;
	}

	public void setEurekaHost(String eurekaHost) {
		this.eurekaHost = eurekaHost;
	}

	public String getDatabase() {
		return database;
	}

	public void setDatabase(String database) {
		this.database = database;
	}

	@Override
	public String toString() {
		return "AwsLaunchServiceReq [instanceId=" + instanceId + ", service=" + service + ", internalPort=" + internalPort
				+ ", externalPort=" + externalPort + ", eurekaHost=" + eurekaHost + ", database=" + database + "]";
	}		
	
}
