package andre.replicationmigration.reqres;

public class ReplicateContainerReq {

	private String fromHostname;
	private String containerId;
	private String toHostname;

	public ReplicateContainerReq() {
	}

	public ReplicateContainerReq(String fromHostname, String containerId, String toHostname) {
		this.fromHostname = fromHostname;
		this.containerId = containerId;
		this.toHostname = toHostname;
	}

	/**
	 * @return the fromHostname
	 */
	public String getFromHostname() {
		return fromHostname;
	}

	/**
	 * @param fromHostname the fromHostname to set
	 */
	public void setFromHostname(String fromHostname) {
		this.fromHostname = fromHostname;
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

	/**
	 * @return the toHostname
	 */
	public String getToHostname() {
		return toHostname;
	}

	/**
	 * @param toHostname the toHostname to set
	 */
	public void setToHostname(String toHostname) {
		this.toHostname = toHostname;
	}

}
