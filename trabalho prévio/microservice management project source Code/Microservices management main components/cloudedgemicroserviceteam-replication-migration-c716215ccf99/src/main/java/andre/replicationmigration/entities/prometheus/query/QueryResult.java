package andre.replicationmigration.entities.prometheus.query;

import java.util.List;

public class QueryResult {

    private QueryMetric metric;
    private List<String> value;

    private QueryResult() {
    }

    /**
     * @return the metric
     */
    public QueryMetric getMetric() {
        return metric;
    }

    /**
     * @param metric the metric to set
     */
    public void setMetric(QueryMetric metric) {
        this.metric = metric;
    }

    /**
     * @return the value
     */
    public List<String> getValue() {
        return value;
    }

    /**
     * @param value the value to set
     */
    public void setValue(List<String> value) {
        this.value = value;
    }
}