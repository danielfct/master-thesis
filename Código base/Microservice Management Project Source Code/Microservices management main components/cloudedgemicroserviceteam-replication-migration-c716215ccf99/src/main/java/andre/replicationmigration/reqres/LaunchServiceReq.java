package andre.replicationmigration.reqres;

public class LaunchServiceReq {

	private String hostname, service, internalPort, externalPort;

	public LaunchServiceReq() {
	}

	public LaunchServiceReq(String hostname, String service, String internalPort, String externalPort) {
		this.hostname = hostname;
		this.service = service;
		this.internalPort = internalPort;
		this.externalPort = externalPort;
	}

	public String getHostname() {
		return hostname;
	}

	public void setHostname(String hostname) {
		this.hostname = hostname;
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

	@Override
	public String toString() {
		return "LaunchServiceReq [hostname=" + hostname + ", service=" + service + ", internalPort=" + internalPort
				+ ", externalPort=" + externalPort + "]";
	}

}
