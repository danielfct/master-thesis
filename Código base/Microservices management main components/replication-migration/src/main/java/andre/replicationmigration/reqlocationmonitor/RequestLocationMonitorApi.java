package andre.replicationmigration.reqlocationmonitor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class RequestLocationMonitorApi {

    private RestTemplate restTemplate;
    private HttpHeaders headers;
    
    //TODO: add to propertie or other
    private String defaultPort;

    @Autowired
    public RequestLocationMonitorApi() {
        headers = new HttpHeaders();
        this.restTemplate = new RestTemplate();
        this.defaultPort = "1919";
    }

    public List<LocationMonitoringResp> getAllMonitoringDataTop(String reqLocationHost, int seconds) {
        String url = "http://" + reqLocationHost + ":" + defaultPort + "/api/monitoringinfo/all/top/" + seconds;
        HttpEntity<String> request = new HttpEntity<>(headers);
        List<LocationMonitoringResp> locationMonitoringResps = new ArrayList<>();
        try {
            ResponseEntity<LocationMonitoringResp[]> response = restTemplate.exchange(url, HttpMethod.GET, request, LocationMonitoringResp[].class);
            locationMonitoringResps = Arrays.asList(response.getBody());
        } catch(RestClientException e) {
            e.printStackTrace();
        }
        
        return locationMonitoringResps;
    }
    
}