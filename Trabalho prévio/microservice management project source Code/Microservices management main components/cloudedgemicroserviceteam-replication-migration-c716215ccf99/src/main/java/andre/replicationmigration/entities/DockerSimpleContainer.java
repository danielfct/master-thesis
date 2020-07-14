package andre.replicationmigration.entities;

import java.util.List;
import java.util.Map;

public class DockerSimpleContainer {

    private String id;
    private long created;
    private List<String> names;
    private String image;
    private String command;
    private String state;
    private String status;
    private String hostname;
    private List<DockerPortMapping> ports;
    private Map<String, String> labels;

    public DockerSimpleContainer() {
    }

    public DockerSimpleContainer(String id, long created, List<String> names, String image, String command,
            String state, String status, String hostname, List<DockerPortMapping> ports, Map<String, String> labels) {
        this.id = id;
        this.created = created;
        this.names = names;
        this.image = image;
        this.command = command;
        this.state = state;
        this.status = status;
        this.hostname = hostname;
        this.ports = ports;
        this.labels = labels;
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
     * @return the created
     */
    public long getCreated() {
        return created;
    }

    /**
     * @param created the created to set
     */
    public void setCreated(long created) {
        this.created = created;
    }

    /**
     * @return the names
     */
    public List<String> getNames() {
        return names;
    }

    /**
     * @param names the names to set
     */
    public void setNames(List<String> names) {
        this.names = names;
    }

    /**
     * @return the image
     */
    public String getImage() {
        return image;
    }

    /**
     * @param image the image to set
     */
    public void setImage(String image) {
        this.image = image;
    }

    /**
     * @return the command
     */
    public String getCommand() {
        return command;
    }

    /**
     * @param command the command to set
     */
    public void setCommand(String command) {
        this.command = command;
    }

    /**
     * @return the state
     */
    public String getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(String state) {
        this.state = state;
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
     * @return the ports
     */
    public List<DockerPortMapping> getPorts() {
        return ports;
    }

    /**
     * @param ports the ports to set
     */
    public void setPorts(List<DockerPortMapping> ports) {
        this.ports = ports;
    }

    /**
     * @return the labels
     */
    public Map<String, String> getLabels() {
        return labels;
    }

    /**
     * @param labels the labels to set
     */
    public void setLabels(Map<String, String> labels) {
        this.labels = labels;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "DockerSimpleContainer [id=" + id + ", created=" + created + ", names=" + names + ", image=" + image
                + ", command=" + command + ", state=" + state + ", status=" + status + ", hostname=" + hostname
                + ", ports=" + ports + "]";
    }

}