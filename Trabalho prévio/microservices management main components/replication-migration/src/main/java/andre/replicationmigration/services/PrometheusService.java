package andre.replicationmigration.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import andre.replicationmigration.entities.prometheus.query.QueryOutput;
import andre.replicationmigration.entities.prometheus.query.QueryResult;

@Service
public class PrometheusService {

    public static final String DEFAULT_PORT = "9090";

    private static final String HOST_AVAILABLE_MEMORY = "node_memory_MemAvailable_bytes";
    private static final String HOST_TOTAL_MEMORY = "node_memory_MemTotal_bytes";
    private static final String HOST_CPU_TOTAL = "node_cpu_seconds_total";

    private static final String QUERY_URL = "/api/v1/query?query=";
    private static final String TIME_PARAM = "&time=";

    private RestTemplate restTemplate;

    public PrometheusService() {
        this.restTemplate = new RestTemplate();
    }

    private String getUrl(String hostname, String port, String param) {
        double currentTime = (System.currentTimeMillis() * 1.0) / 1000.0;
        return "http://" + hostname + ":" + port + QUERY_URL + param + TIME_PARAM + currentTime;
    }

    public double getAvailableMemory(String hostname, String port) {
        String url = getUrl(hostname, port, HOST_AVAILABLE_MEMORY);
        String value = "";
        try {
            ResponseEntity<QueryOutput> response = restTemplate.getForEntity(url, QueryOutput.class);
            value = getValue(response.getBody(), 0);
        } catch (RestClientException e) {
            e.printStackTrace();
        }
        if (!value.equals("")) {
            return Double.parseDouble(value);
        }

        return -1;
    }

    public double getTotalMemory(String hostname, String port) {
        String url = getUrl(hostname, port, HOST_TOTAL_MEMORY);
        String value = "";
        try {
            ResponseEntity<QueryOutput> response = restTemplate.getForEntity(url, QueryOutput.class);
            value = getValue(response.getBody(), 0);
        } catch (RestClientException e) {
            e.printStackTrace();
        }
        if (!value.equals("")) {
            return Double.parseDouble(value);
        }

        return -1;
    }

    public double getAvailableMemoryPercent(String hostname, String port) {
        String url = getUrl(hostname, port, HOST_AVAILABLE_MEMORY + "/" + HOST_TOTAL_MEMORY);
        String value = "";
        try {
            ResponseEntity<QueryOutput> response = restTemplate.getForEntity(url, QueryOutput.class);
            value = getValue(response.getBody(), 0);
        } catch (RestClientException e) {
            e.printStackTrace();
        }
        if (!value.equals("")) {
            return Double.parseDouble(value) * 100.0;
        }

        return -1;
    }

    public double getMemoryUsagePercent(String hostname, String port) {
        double availableMem = getAvailableMemoryPercent(hostname, port);
        if (availableMem != -1) {
            return 100.0 - availableMem;
        }

        return -1;
    }

    public double getCpuUsagePercent(String hostname, String port) {
        String queryParam = "100-(avg by (instance) (irate(node_cpu_seconds_total{job=\"node_exporter\",mode=\"idle\"}[5m]))*100)";
        String url = getUrl(hostname, port, "{query}");
        String value = "";
        Map<String, String> params = new HashMap<String, String>();
        params.put("query", queryParam);
        try {
            ResponseEntity<QueryOutput> response = restTemplate.getForEntity(url, QueryOutput.class, params);
            value = getValue(response.getBody(), 0);
        } catch (RestClientException e) {
            e.printStackTrace();
        }
        if (!value.equals("")) {
            return Double.parseDouble(value);
        }

        return -1;
    }

    private String getValue(QueryOutput queryOutput, int index) {
        if (queryOutput.getStatus().equals("success")) {
            List<QueryResult> results = queryOutput.getData().getResult();
            if (!results.isEmpty()) {
                if (results.size() > index) {
                    return getResultByIndex(results, index);
                }
            }
        }
        return "";
    }

    private String getResultByIndex(List<QueryResult> results, int index) {
        QueryResult result = results.get(index);
        List<String> values = result.getValue();
        if (values.size() == 2) {
            return values.get(1);
        }
        return "";
    }

}