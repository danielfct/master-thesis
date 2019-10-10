package andre.replicationmigration.nginx;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NginxLoadBalancerApi {

    private String nginxApiUrl;
    private RestTemplate restTemplate;
    private HttpHeaders headers;

    @Autowired
    public NginxLoadBalancerApi(@Value("${replic.prop.nginx-load-balancer-api-url}") String nginxApiUrl,
            @Value("${replic.prop.docker-api-proxy-username}") String apiUsername,
            @Value("${replic.prop.docker-api-proxy-password}") String apiPassword) {
        this.nginxApiUrl = nginxApiUrl;
        String apiCredBase64 = new String(Base64.getEncoder().encode((apiUsername + ":" + apiPassword).getBytes()));
        headers = new HttpHeaders();
        headers.add("Authorization", "Basic " + apiCredBase64);
        this.restTemplate = new RestTemplate();
    }

    public List<NginxServer> getServers(String loadBalancerUrl) {
        String url = "http://" + loadBalancerUrl + nginxApiUrl + "/servers";
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<NginxServer[]> response = restTemplate.exchange(url, HttpMethod.GET, request, NginxServer[].class);
        return Arrays.asList(response.getBody());
    }

    public boolean addServer(String loadBalancerUrl, NginxServer server) {
        List<NginxServer> serverWrapper = new ArrayList<NginxServer>(1);
        serverWrapper.add(server);
        return addServers(loadBalancerUrl, serverWrapper);
    }

    public boolean addServers(String loadBalancerUrl, List<NginxServer> servers) {
        String url = "http://" + loadBalancerUrl + nginxApiUrl + "/servers";
        HttpEntity<List<NginxServer>> request = new HttpEntity<>(servers, headers);
        ResponseEntity<Message> response = restTemplate.exchange(url, HttpMethod.POST, request, Message.class);
        return response.getBody().getMessage().equals("success");
    }
    public boolean deleteServer(String loadBalancerUrl, NginxSimpleServer server) {
        String url = "http://" + loadBalancerUrl + nginxApiUrl + "/servers";
        HttpEntity<NginxSimpleServer> request = new HttpEntity<>(server, headers);
        ResponseEntity<Message> response = restTemplate.exchange(url, HttpMethod.DELETE, request, Message.class);
        return response.getBody().getMessage().equals("success");
    }

}