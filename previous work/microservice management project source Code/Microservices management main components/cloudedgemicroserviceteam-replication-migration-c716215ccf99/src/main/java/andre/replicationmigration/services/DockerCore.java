package andre.replicationmigration.services;

import static java.util.concurrent.TimeUnit.SECONDS;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.spotify.docker.client.DefaultDockerClient;
import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.DockerClient.ListContainersParam;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.Container;
import com.spotify.docker.client.messages.Container.PortMapping;
import com.spotify.docker.client.messages.ContainerConfig;
import com.spotify.docker.client.messages.ContainerConfig.Builder;
import com.spotify.docker.client.messages.ContainerCreation;
import com.spotify.docker.client.messages.ContainerInfo;
import com.spotify.docker.client.messages.ContainerStats;
import com.spotify.docker.client.messages.HostConfig;
import com.spotify.docker.client.messages.PortBinding;
import com.spotify.docker.client.messages.swarm.Node;
import com.spotify.docker.client.messages.swarm.Node.Criteria;
import com.spotify.docker.client.messages.swarm.Swarm;
import com.spotify.docker.client.messages.swarm.SwarmJoin;
import com.spotify.docker.client.shaded.com.google.common.collect.ImmutableList;
import com.spotify.docker.client.shaded.com.google.common.collect.ImmutableMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.DockerPortMapping;
import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.entities.DockerSimpleNode;
import andre.replicationmigration.reqres.GenericResponse;

@Service
public class DockerCore {

    private int dockerSecondsBeforeStopContainer;
    private String dockerMasterNodeHostname;
    private String proxyCredBase64;

    @Autowired
    private CommandSshService sshService;

    @Autowired
    public DockerCore(@Value("${replic.prop.docker-api-proxy-username}") String dockerApiProxyUsername,
            @Value("${replic.prop.docker-api-proxy-password}") String dockerApiProxyPassword,
            @Value("${replic.prop.docker-master-node-hostname}") String dockerMasterNodeHostname,
            @Value("${replic.prop.docker-seconds-before-stop-container}") int dockerSecondsBeforeStopContainer) {
        this.dockerSecondsBeforeStopContainer = dockerSecondsBeforeStopContainer;
        this.dockerMasterNodeHostname = dockerMasterNodeHostname;
        this.proxyCredBase64 = new String(
                Base64.getEncoder().encode((dockerApiProxyUsername + ":" + dockerApiProxyPassword).getBytes()));
    }

    public DockerClient getDockerClient(String hostname) {
        String autoHeader = "Basic " + proxyCredBase64;
        String uri = "http://" + hostname + ":2375";
        return DefaultDockerClient.builder().uri(uri).header("Authorization", autoHeader)
                .connectTimeoutMillis(SECONDS.toMillis(50)).readTimeoutMillis(SECONDS.toMillis(200)).build();
    }

    public boolean isDockerRunning(String hostname) {
        final DockerClient docker = getDockerClient(hostname);
        try {
            String pingResponse = docker.ping();
            return pingResponse.equals("OK");
        } catch (DockerException | InterruptedException e) {
            return false;
        }
    }

    public List<DockerSimpleNode> getAvailableNodes() {
        final DockerClient docker = getDockerClient(dockerMasterNodeHostname);
        List<DockerSimpleNode> readyNodes = new ArrayList<>();
        try {
            for (Node node : docker.listNodes()) {
                if (node.status().state().equals("ready")) { // Get all ready Nodes
                    readyNodes.add(new DockerSimpleNode(node.id(), node.status().addr(), node.status().state(),
                            node.spec().role()));
                }
            }
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return readyNodes;
    }

    public String initSwarm() {
        final DockerClient docker = getDockerClient(dockerMasterNodeHostname);

        boolean createSwarm = true;
        String otherSwarmId = "";
        try {
            Swarm swarm = docker.inspectSwarm();
            otherSwarmId = swarm.id();
            List<Node> masterNodes = docker.listNodes(Criteria.builder().nodeRole("manager").build());
            for (Node node : masterNodes) {
                if (node.status().addr().equals(dockerMasterNodeHostname) && node.status().state().equals("ready")) {
                    createSwarm = false;
                    break;
                }
            }
        } catch (DockerException | InterruptedException e) {
            if (!e.getMessage().contains("503")) // If 503 -> Docker is not a swarm manager, its ok
                e.printStackTrace();
        }
        if (createSwarm) {
            this.leaveSwarm(docker);
            if (sshService.dockerInitSwarm(dockerMasterNodeHostname)) {
                try {
                    return docker.inspectSwarm().id();
                } catch (DockerException | InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
        return otherSwarmId;
    }

    public boolean joinSwarm(String hostname) {
        final DockerClient dockerMaster = getDockerClient(dockerMasterNodeHostname);
        final DockerClient dockerNode = getDockerClient(hostname);
        boolean alreadyOnSwarm = false;
        try {
            Swarm swarm = dockerMaster.inspectSwarm();
            String joinWorkerToken = swarm.joinTokens().worker();
            for (Node node : dockerMaster.listNodes()) {
                if (node.status().addr().equals(hostname)) {// Node already on Swarm
                    alreadyOnSwarm = true;
                }
            }
            if (alreadyOnSwarm) {
                return true;
            } else {// If node is not on swarm
                this.leaveSwarm(dockerNode);
                List<String> remoteAddrs = new ArrayList<>(1);
                remoteAddrs.add(dockerMasterNodeHostname);
                SwarmJoin swarmJoin = SwarmJoin.builder().listenAddr(hostname).advertiseAddr(hostname)
                        .joinToken(joinWorkerToken).remoteAddrs(remoteAddrs).build();
                dockerNode.joinSwarm(swarmJoin);
                return true;
            }

        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean leaveSwarm(String hostname) {
        final DockerClient docker = getDockerClient(hostname);
        return leaveSwarm(docker);
    }

    public boolean leaveSwarm(DockerClient docker) {
        try {
            docker.leaveSwarm(true);
            return true;
        } catch (DockerException e) { // Code == 503, node is not a swarm manager
            if (e.getMessage().contains("503") || e.getMessage().contains("node is not part of a swarm")) {
                return true;
            } else {
                e.printStackTrace();
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<DockerSimpleContainer> getContainers(String hostname, ListContainersParam... params) {
        final DockerClient docker = getDockerClient(hostname);
        return getContainers(docker, params);
    }

    public List<DockerSimpleContainer> getContainers(ListContainersParam... params) {
        List<DockerSimpleContainer> containers = this.getContainers(dockerMasterNodeHostname, params);
        containers.addAll(getNodesContainers(params));
        return containers;
    }

    public List<DockerSimpleContainer> getContainers(DockerClient docker, ListContainersParam... params) {
        List<DockerSimpleContainer> simpleContainers = new ArrayList<>();
        try {
            List<Container> containers = docker.listContainers(params);
            simpleContainers = new ArrayList<>(containers.size());
            for (Container container : containers) {
                simpleContainers.add(getSimpleContainer(container));
            }
            return simpleContainers;

        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return simpleContainers;
    }

    public List<DockerSimpleContainer> getNodesContainers(ListContainersParam... params) {
        final DockerClient dockerMaster = getDockerClient(dockerMasterNodeHostname);
        List<DockerSimpleContainer> containers = new ArrayList<>(50);
        try {
            for (Node node : dockerMaster.listNodes()) {
                if (node.status().state().equals("ready") && !node.status().addr().equals(dockerMasterNodeHostname)) {
                    containers.addAll(this.getContainers(node.status().addr(), params));
                }
            }
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return containers;
    }

    public List<GenericResponse> launchContainer(DockerClient docker, String hostname, String internalPort,
            String externalPort, String containerName, String dockerRepo, String launchCommand,
            List<String> customLabelsEnvs) {
        List<GenericResponse> response = new ArrayList<>(4);
        response.add(new GenericResponse("hostname", hostname));

        Map<String, List<PortBinding>> portBindings = new HashMap<>(1);
        List<PortBinding> ports = new ArrayList<>();
        ports.add(PortBinding.of("", externalPort));
        portBindings.put(internalPort, ports);

        List<String> envList = new ArrayList<>();
        Map<String, String> labels = new HashMap<>();

        for (String customLabel : customLabelsEnvs) {
            String[] customlabelEnvSplit = customLabel.split("::");
            if (!customlabelEnvSplit[0].equals("env")) {
                if (customlabelEnvSplit.length > 1)
                    labels.put(customlabelEnvSplit[0], customlabelEnvSplit[1]);
                else
                    labels.put(customlabelEnvSplit[0], "");
            } else {
                envList.add(customlabelEnvSplit[1]);
            }
        }

        HostConfig hostConfig = HostConfig.builder().autoRemove(true).portBindings(portBindings).build();
        Builder containerBuilder = ContainerConfig.builder().exposedPorts(internalPort).hostConfig(hostConfig)
                .labels(labels).image(dockerRepo).env(envList);

        ContainerConfig containerConfig = launchCommand.equals("") ? containerBuilder.build()
                : containerBuilder.cmd(launchCommand.split(" ")).build();

        pullImage(docker, dockerRepo);

        try {
            ContainerCreation container = docker.createContainer(containerConfig, containerName);
            docker.startContainer(container.id());

            response.add(new GenericResponse("containerId", container.id()));
            response.add(new GenericResponse("success", String.valueOf(true)));
            String uriVal = hostname + ":" + externalPort;
            response.add(new GenericResponse("output", uriVal));

        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();

            response.add(new GenericResponse("success", String.valueOf(false)));
            response.add(new GenericResponse("error", e.getMessage()));
        }
        return response;
    }

    public boolean pullImage(DockerClient docker, String dockerRepo) {
        try {
            docker.pull(dockerRepo);
            return true;
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<GenericResponse> stopContainer(DockerClient docker, String containerId) {
        List<GenericResponse> response = new ArrayList<>(2);

        try {
            docker.stopContainer(containerId, dockerSecondsBeforeStopContainer);
            response.add(new GenericResponse("success", String.valueOf(true)));
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
            response.add(new GenericResponse("success", String.valueOf(false)));
            response.add(new GenericResponse("error", e.getMessage()));
        }

        return response;
    }

    public ImmutableMap<String, String> getContainerLabelsById(DockerClient docker, String containerId) {
        try {
            ContainerInfo container = docker.inspectContainer(containerId);
            return container.config().labels();
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

    public void deleteUnresponsiveNodes() {
        final DockerClient docker = getDockerClient(dockerMasterNodeHostname);
        try {
            for (Node node : docker.listNodes()) {
                if (!node.status().state().equals("ready")) { // Remove all nodes != ready
                    docker.deleteNode(node.id(), true);
                    System.out.println(
                            "-> Node to delete: " + node.status().addr() + "; State: " + node.status().state());
                }
            }
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void deleteNodeFromSwarm(String nodeHostname) {
        final DockerClient docker = getDockerClient(dockerMasterNodeHostname);
        try {
            for (Node node : docker.listNodes()) {
                if (node.status().addr().equals(nodeHostname)) {
                    docker.deleteNode(node.id(), true);
                    break;
                }
            }
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private DockerSimpleContainer getSimpleContainer(Container container) {
        ImmutableList<PortMapping> containerPorts = container.ports();
        List<DockerPortMapping> ports = new ArrayList<>(containerPorts.size());
        for (PortMapping port : containerPorts) {
            ports.add(new DockerPortMapping(port.privatePort(), port.publicPort(), port.type(), port.ip()));
        }
        String hostname = container.labels().get("serviceHostname");
        return new DockerSimpleContainer(container.id(), container.created(), container.names(), container.image(),
                container.command(), container.state(), container.status(), hostname, ports, container.labels());
    }

    public ContainerStats getContainerStats(String hostname, String containerId) {
        final DockerClient docker = getDockerClient(hostname);
        try {
            return docker.stats(containerId);
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

}