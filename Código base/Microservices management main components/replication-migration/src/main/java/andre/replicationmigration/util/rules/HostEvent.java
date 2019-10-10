package andre.replicationmigration.util.rules;

import java.util.HashMap;
import java.util.Map;

public class HostEvent implements Event {

    private String hostname;
    private Map<String, Double> fields;

    public HostEvent() {
        fields = new HashMap<String, Double>();
    }

    public HostEvent(String hostname) {
        this();
        this.hostname = hostname;
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