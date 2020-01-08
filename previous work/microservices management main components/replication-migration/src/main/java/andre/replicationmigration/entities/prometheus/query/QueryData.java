package andre.replicationmigration.entities.prometheus.query;

import java.util.List;

public class QueryData {

    private String resultType;
    private List<QueryResult> result;

    public QueryData() {
    }

    /**
     * @return the resultType
     */
    public String getResultType() {
        return resultType;
    }

    /**
     * @param resultType the resultType to set
     */
    public void setResultType(String resultType) {
        this.resultType = resultType;
    }

    /**
     * @return the result
     */
    public List<QueryResult> getResult() {
        return result;
    }

    /**
     * @param result the result to set
     */
    public void setResult(List<QueryResult> result) {
        this.result = result;
    }
}