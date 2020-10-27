package andre.replicationmigration.util.rules;

import java.util.HashMap;
import java.util.Map;

public class ContainerEvent implements Event {

    private String containerId;
    private String serviceName;
    private Map<String, Double> fields;

    public ContainerEvent() {
        fields = new HashMap<String, Double>();
    }

    public ContainerEvent(String containerId, String serviceName) {
        this();
        this.containerId = containerId;
        this.serviceName = serviceName;
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
     * @return the fields
     */
    public Map<String, Double> getFields() {
        return fields;
    }

    /**
     * @param fields the fields to set
     */
    public void setFields(Map<String, Double> fields) {
        this.fields = fields;
    }

}