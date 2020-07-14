package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.amazonaws.services.ec2.model.Instance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.AwsSimpleInstance;
import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.entities.DockerSimpleNode;
import andre.replicationmigration.entities.HostDetails;
import andre.replicationmigration.model.EdgeHost;
import andre.replicationmigration.services.metrics.HostMetricsService;

@Service
public class HostService {

    @Autowired
    private EdgeHostService edgeHostService;

    @Autowired
    private DockerCore dockerCore;

    @Autowired
    private DockerServiceApi dockerService;

    @Autowired
    private AwsService awsService;

    @Autowired
    private CommandSshService sshService;

    @Autowired
    private HostMetricsService hostMetricsService;

    private int awsDelay;

    @Autowired
    public HostService(@Value("${replic.prop.aws-delay}") int awsDelay) {
        this.awsDelay = awsDelay;
    }

    public String getAvailableNode(String region, double avgContainerMem) {
        return getAvailableNode(region, "", "", avgContainerMem);
    }

    public String getAvailableNode(String region, String country, String city, double avgContainerMem) {
        List<DockerSimpleNode> nodes = dockerCore.getAvailableNodes();
        return getAvailableNode(region, country, city, avgContainerMem, nodes);
    }

    private String getAvailableNode(String region, String country, String city, double avgContainerMem,
            List<DockerSimpleNode> nodes) {
        List<String> otherRegionsHosts = new ArrayList<String>(nodes.size());
        List<String> sameRegionsHosts = new ArrayList<String>(nodes.size());
        List<String> sameCountryHosts = new ArrayList<String>(nodes.size());
        List<String> sameCityHosts = new ArrayList<String>(nodes.size());
        for (DockerSimpleNode node : nodes) {
            String hostname = node.getHostname();
            HostDetails hostDetails = getHostDetails(hostname);
            if (hostDetails.getRegion().equals(region)) {
                if (hostMetricsService.hasHostAvailableResources(hostname, avgContainerMem)) {
                    sameRegionsHosts.add(hostname);
                    if (!country.equals("") && hostDetails.getCountry().equals(country))
                        sameCountryHosts.add(hostname);
                    if (!city.equals("") && hostDetails.getCity().equals(city))
                        sameCityHosts.add(hostname);
                }
            } else if (hostMetricsService.hasHostAvailableResources(hostname, avgContainerMem)) {
                otherRegionsHosts.add(hostname);
            }
        }
        if (!sameCityHosts.isEmpty()) {
            Random rand = new Random();
            int index = rand.nextInt(sameCityHosts.size());
            return sameCityHosts.get(index);
        } else if (!sameCountryHosts.isEmpty()) {
            Random rand = new Random();
            int index = rand.nextInt(sameCountryHosts.size());
            return sameCountryHosts.get(index);
        } else if (!sameRegionsHosts.isEmpty()) {
            Random rand = new Random();
            int index = rand.nextInt(sameRegionsHosts.size());
            return sameRegionsHosts.get(index);
        } else {
            return addHostToSwarm(region, country, city, nodes, otherRegionsHosts);
        }
    }

    public HostDetails getHostDetails(String hostname) {
        if (edgeHostService.hasEdgeHost(hostname)) {
            EdgeHost edgeHost = edgeHostService.getEdgeHostByHostname(hostname);
            return new HostDetails(getContinent(edgeHost.getRegion()), edgeHost.getRegion(), edgeHost.getCountry(),
                    edgeHost.getCity());
        } else { // Is Aws
            Instance instance = awsService.getInstanceByPublicIpAddr(hostname);
            String zone = instance.getPlacement().getAvailabilityZone();
            return new HostDetails(getContinent(zone), getRegion(zone), "", "");
        }
    }

    private String getContinent(String region) {
        String[] regionSplit = region.split("-");
        if (regionSplit.length > 0) {
            if(regionSplit[0].equals("us") || regionSplit[0].equals("ca"))
                return "na";
            else if(regionSplit[0].equals("sa"))
                return "sa";
            else if(regionSplit[0].equals("eu"))
                return "eu";
            else if(region.contains("ap-southeast-1"))
                return "oc";
            else if(regionSplit[0].equals("ap"))
                return "as";
        }
        return "";
    }

    /**
     * Used for Aws zone. Ex: us-east-1a -> us-east-1
     */
    private String getRegion(String zone) {
        if (zone.length() > 1) {
            String lastChar = zone.substring(zone.length() - 1);
            try {
                Integer.parseInt(lastChar);
                return zone;
            } catch (NumberFormatException e) {
                return zone.substring(0, zone.length() - 1);
            }
        }
        return "";
    }

    public String addAwsHostToSwarm() {
        List<DockerSimpleNode> nodes = dockerCore.getAvailableNodes();
        return addAwsHostToSwarm(nodes);
    }

    private String addAwsHostToSwarm(List<DockerSimpleNode> nodes) {
        String hostname = "";
        List<AwsSimpleInstance> instances = awsService.getInstances();
        List<AwsSimpleInstance> availableRunningInstances = new ArrayList<>();
        List<AwsSimpleInstance> availableStoppedInstances = new ArrayList<>();
        for (AwsSimpleInstance instance : instances) {
            if (instance.getState().getCode() == 16) {
                if (!isHostInSwarm(nodes, instance.getPublicIp()))
                    availableRunningInstances.add(instance);

            } else if (instance.getState().getCode() == 80) {
                availableStoppedInstances.add(instance);
            }
        }
        if (availableRunningInstances.isEmpty() && availableStoppedInstances.isEmpty()) {
            hostname = createNewAwsInstance();
        } else if (!availableStoppedInstances.isEmpty()) {
            String instanceId = availableStoppedInstances.get(0).getInstanceId();
            boolean isStarted = awsService.startInstance(instanceId);
            if (isStarted)
                hostname = awsService.getSimpleInstance(instanceId).getPublicIp();
        } else {
            hostname = availableRunningInstances.get(0).getPublicIp();
        }
        sleep(awsDelay);
        startHostComponents(hostname, 5);

        return hostname;
    }

    /**
     * @return the host hostname
     */
    public String addHostToSwarm(String region, String country, String city) {
        String hostname = "";
        List<DockerSimpleNode> nodes = dockerCore.getAvailableNodes();
        if (!country.equals("")) {
            List<EdgeHost> edgeHosts = edgeHostService.getHostsByCountry(country);
            hostname = chooseEdgeHost(nodes, edgeHosts, city);
        } else {
            List<EdgeHost> edgeHosts = edgeHostService.getHostsByRegion(region);
            hostname = chooseEdgeHost(nodes, edgeHosts, "");
        }
        if (hostname.equals("")) {
            hostname = addAwsHostToSwarm(nodes);
        } else {
            startHostComponents(true, hostname);
        }

        return hostname;
    }

    // TODO: review otherHostRegion and region us-east-1
    private String addHostToSwarm(String region, String country, String city, List<DockerSimpleNode> nodes,
            List<String> otherRegionsHosts) {
        String hostname = "";
        if (!country.equals("")) {
            List<EdgeHost> edgeHosts = edgeHostService.getHostsByCountry(country);
            hostname = chooseEdgeHost(nodes, edgeHosts, city);
        } else {
            List<EdgeHost> edgeHosts = edgeHostService.getHostsByRegion(region);
            hostname = chooseEdgeHost(nodes, edgeHosts, "");
        }
        if (hostname.equals("")) {
            if (otherRegionsHosts.isEmpty() || region.equals("us-east-1")) {
                hostname = addAwsHostToSwarm(nodes);
            } else {
                Random rand = new Random();
                int index = rand.nextInt(otherRegionsHosts.size());
                hostname = otherRegionsHosts.get(index);
            }
        } else {
            startHostComponents(true, hostname);
        }

        return hostname;
    }

    public boolean removeHostFromSwarm(String hostname) {
        boolean isHostRunning = sshService.isHostRunning(hostname);
        if (isHostRunning) {
            boolean isDockerApiProxyRunning = sshService.launchDockerApiProxy(hostname);
            if (isDockerApiProxyRunning) {
                boolean success = stopHostComponents(hostname);
                if (!edgeHostService.hasEdgeHost(hostname))
                    awsService.stopInstance(hostname);
                return success;
            }
        }
        return false;
    }

    private boolean startHostComponents(boolean isHostRunning, String hostname) {
        if (isHostRunning) {
            boolean isDockerApiProxyRunning = sshService.launchDockerApiProxy(hostname);
            sleep(10000);
            if (isDockerApiProxyRunning) {
                dockerCore.joinSwarm(hostname);
                dockerService.launchPrometheus(hostname);
                dockerService.launchReqLocMonitor(hostname);
                return true;
            }
        }
        return false;
    }

    public boolean startHostComponents(String hostname, int maxRetries) {
        boolean isRunning = sshService.isHostRunning(hostname);
        int tries = 1;
        int MAX_RETRIES = maxRetries > 5 ? 5 : maxRetries;
        while (!isRunning && tries < MAX_RETRIES) {
            sleep(5000);
            isRunning = sshService.isHostRunning(hostname);
        }
        return startHostComponents(isRunning, hostname);
    }

    public boolean stopHostComponents(String hostname) {
        List<DockerSimpleContainer> containers = dockerService.getSystemContainers(hostname);
        for (DockerSimpleContainer container : containers) {
            String serviceName = container.getLabels().get("serviceName");
            if (!serviceName.equals("docker-api-proxy")) {
                dockerService.stopContainer(hostname, container.getId());
            }
        }
        boolean success = dockerCore.leaveSwarm(hostname);
        sleep(5000);
        dockerCore.deleteNodeFromSwarm(hostname);
        return success;
    }

    public boolean startMasterHostComponents(String hostname, boolean isHostRunning, boolean isDockerApiProxyRunning) {
        if (isHostRunning) {
            if (isDockerApiProxyRunning) {
                dockerCore.initSwarm();
                dockerCore.deleteUnresponsiveNodes();
                // dockerService.launchEureka(hostname);
                dockerService.launchPrometheus(hostname);
                dockerService.launchReqLocMonitor(hostname);
                return true;
            }
        }
        return false;
    }

    /**
     * @return the instance hostname
     */
    public String createNewAwsInstance() {
        System.out.println("-> Creating new AWS instance...");
        int MAX_RETRIES = 10, retries = 0;
        String instanceId = awsService.createS2().getValue();
        sleep(10000);
        AwsSimpleInstance instance = awsService.getSimpleInstance(instanceId);

        while (instance.getState().getCode() != 16 && retries < MAX_RETRIES) {
            sleep(5000);
            instance = awsService.getSimpleInstance(instanceId);
            retries++;
        }
        sleep(10000); // Finish starting s2
        System.out.println("-> New AWS instance created!  IP: " + instance.getPublicIp());

        return instance.getPublicIp();
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private boolean isHostInSwarm(List<DockerSimpleNode> nodes, String hostname) {
        for (DockerSimpleNode node : nodes) {
            if (node.getHostname().equals(hostname)) {
                return true;
            }
        }
        return false;
    }

    private String chooseEdgeHost(List<DockerSimpleNode> nodes, List<EdgeHost> edgeHosts, String city) {
        String hostname = "";
        for (EdgeHost edgeHost : edgeHosts) {
            if (city.equals("") || edgeHost.getCity().equals(city)) {
                if (!isHostInSwarm(nodes, edgeHost.getHostname())) {
                    if (sshService.isHostRunning(edgeHost.getHostname())) {
                        hostname = edgeHost.getHostname();
                        break;
                    }
                }
            }
        }
        return hostname;
    }

}