package andre.replicationmigration.entities;

import com.amazonaws.services.ec2.model.InstanceState;

public class AwsSimpleInstance {

	private String instanceId;
	private String imageId;
	private String instanceType;
	private InstanceState state;
	private String publicDnsName;
	private String publicIp;

	public AwsSimpleInstance() {
	}

	public AwsSimpleInstance(String instanceId, String imageId, String instanceType, InstanceState state,
			String publicDnsName, String publicIp) {
		this.instanceId = instanceId;
		this.imageId = imageId;
		this.instanceType = instanceType;
		this.state = state;
		this.publicDnsName = publicDnsName;
		this.publicIp = publicIp;
	}

	/**
	 * @return the instanceId
	 */
	public String getInstanceId() {
		return instanceId;
	}

	/**
	 * @param instanceId the instanceId to set
	 */
	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}

	/**
	 * @return the imageId
	 */
	public String getImageId() {
		return imageId;
	}

	/**
	 * @param imageId the imageId to set
	 */
	public void setImageId(String imageId) {
		this.imageId = imageId;
	}

	/**
	 * @return the instanceType
	 */
	public String getInstanceType() {
		return instanceType;
	}

	/**
	 * @param instanceType the instanceType to set
	 */
	public void setInstanceType(String instanceType) {
		this.instanceType = instanceType;
	}

	/**
	 * @return the state
	 */
	public InstanceState getState() {
		return state;
	}

	/**
	 * @param state the state to set
	 */
	public void setState(InstanceState state) {
		this.state = state;
	}

	/**
	 * @return the publicDnsName
	 */
	public String getPublicDnsName() {
		return publicDnsName;
	}

	/**
	 * @param publicDnsName the publicDnsName to set
	 */
	public void setPublicDnsName(String publicDnsName) {
		this.publicDnsName = publicDnsName;
	}

	/**
	 * @return the publicIp
	 */
	public String getPublicIp() {
		return publicIp;
	}

	/**
	 * @param publicIp the publicIp to set
	 */
	public void setPublicIp(String publicIp) {
		this.publicIp = publicIp;
	}

	@Override
	public String toString() {
		return "AwsSimpleInstance [instanceId=" + instanceId + ", imageId=" + imageId + ", instanceType=" + instanceType
				+ ", state=" + state + ", publicDnsName=" + publicDnsName + ", publicIp=" + publicIp + "]";
	}

}