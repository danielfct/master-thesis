package andre.replicationmigration.entities.prometheus.query;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;

public class QueryMetric {

    private String instance;    

    @JsonAnySetter
    private Map<String, String> properties = new HashMap<>();

    public QueryMetric() {
    }

    /**
     * @return the instance
     */
    public String getInstance() {
        return instance;
    }

    /**
     * @param instance the instance to set
     */
    public void setInstance(String instance) {
        this.instance = instance;
    }   

    /**
     * @return the properties
     */
    @JsonAnyGetter
    public Map<String, String> getProperties() {
       return properties;
    }

}