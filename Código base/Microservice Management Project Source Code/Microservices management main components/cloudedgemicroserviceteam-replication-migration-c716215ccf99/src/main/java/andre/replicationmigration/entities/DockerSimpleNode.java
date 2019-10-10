package andre.replicationmigration.entities;


public class DockerSimpleNode {

    private String id;
    private String hostname;
    private String status;
    private String role;

    public DockerSimpleNode(){
        this.id = "";
        this.hostname = "";
        this.status = "";
        this.role = "";
    }

    public DockerSimpleNode(String id, String hostname, String status, String role){
        this.id = id;
        this.hostname = hostname;
        this.status = status;
        this.role = role;
    }

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
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
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the role
     */
    public String getRole() {
        return role;
    }

    /**
     * @param role the role to set
     */
    public void setRole(String role) {
        this.role = role;
    }
    
}