package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.Region;
import andre.replicationmigration.model.ServiceConfig;

@Service
public class EurekaService {

    @Autowired
    private DockerServiceApi dockerService;

    @Autowired
    private HostService hostService;

    @Autowired
    private ServicesConfigsService serviceConfigsService;

    public List<String> launchEurekaServers(List<Region> regions) {
        List<String> hostnameList = new ArrayList<>(regions.size());
        ServiceConfig service = serviceConfigsService.getServiceLaunchConfig("eureka-server");
        for (Region region : regions) {
            String hostname = hostService.getAvailableNode(region.getRegionName(), service.getAvgMem());
            hostnameList.add(hostname);
        }
        String otherEurekaServers = generateEurekaZones(hostnameList);
        for (String hostname : hostnameList) {
            dockerService.launchEureka(hostname, otherEurekaServers);
        }
        return hostnameList;
    }

    private String generateEurekaZones(List<String> hostnameList) {
        String otherEurekaServers = "";
        for (String hostname : hostnameList) {
            otherEurekaServers += "http://" + hostname + ":8761/eureka/,";
        }
        if(!hostnameList.isEmpty())
            otherEurekaServers = otherEurekaServers.substring(0, otherEurekaServers.length() - 1);
        return otherEurekaServers;
    }

}