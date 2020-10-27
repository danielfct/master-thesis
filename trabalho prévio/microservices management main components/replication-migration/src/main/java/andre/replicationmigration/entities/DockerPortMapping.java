package andre.replicationmigration.entities;

public class DockerPortMapping {

    private int privatePort;
    private int publicPort;
    public String type;
    public String ip;

    public DockerPortMapping() {

    }

    public DockerPortMapping(int privatePort, int publicPort, String type, String ip) {
        this.privatePort = privatePort;
        this.publicPort = publicPort;
        this.type = type;
        this.ip = ip;
    }

    /**
     * @return the privatePort
     */
    public int getPrivatePort() {
        return privatePort;
    }

    /**
     * @param privatePort the privatePort to set
     */
    public void setPrivatePort(int privatePort) {
        this.privatePort = privatePort;
    }

    /**
     * @return the publicPort
     */
    public int getPublicPort() {
        return publicPort;
    }

    /**
     * @param publicPort the publicPort to set
     */
    public void setPublicPort(int publicPort) {
        this.publicPort = publicPort;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

	@Override
	public String toString() {
		return "DockerPortMapping [privatePort=" + privatePort + ", publicPort=" + publicPort + ", type=" + type
				+ ", ip=" + ip + "]";
	}    
    
}