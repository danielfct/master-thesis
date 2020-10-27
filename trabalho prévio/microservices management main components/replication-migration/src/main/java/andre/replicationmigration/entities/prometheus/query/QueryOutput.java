package andre.replicationmigration.entities.prometheus.query;

public class QueryOutput {

    private String status;
    private QueryData data;

    public QueryOutput() {
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
     * @return the data
     */
    public QueryData getData() {
        return data;
    }

    /**
     * @param data the data to set
     */
    public void setData(QueryData data) {
        this.data = data;
    }
}