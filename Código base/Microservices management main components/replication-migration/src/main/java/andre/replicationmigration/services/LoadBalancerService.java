package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.Region;
import andre.replicationmigration.model.ServiceConfig;

@Service
public class LoadBalancerService {

    @Autowired
    private DockerServiceApi dockerService;

    @Autowired
    private HostService hostService;

    @Autowired
    private ServicesConfigsService serviceConfigsService;

    public List<String> launchLoadBalancers(String serviceName, List<Region> regions) {
        List<String> hostnameList = new ArrayList<>(regions.size());
        ServiceConfig service = serviceConfigsService.getServiceLaunchConfig("load-balancer");
        for (Region region : regions) {
            String hostname = hostService.getAvailableNode(region.getRegionName(), service.getAvgMem());
            hostnameList.add(hostname);
        }
        
        for (String hostname : hostnameList) {
            dockerService.launchEmptyLoadBalancer(hostname, serviceName);
        }
        return hostnameList;
    }

}