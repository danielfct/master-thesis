package andre.replicationmigration.reqres;

public class StopServiceReq {

	private String hostname;
	private String containerId;

	public StopServiceReq() {
	}

	public StopServiceReq(String hostname, String containerId) {
		this.hostname = hostname;
		this.containerId = containerId;
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

	@Override
	public String toString() {
		return "StopServiceReq [hostname=" + hostname + "; containerId=" + containerId + "]";
	}

}
