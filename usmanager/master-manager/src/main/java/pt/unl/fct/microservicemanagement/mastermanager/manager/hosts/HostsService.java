/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.manager.hosts;

import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.proxy.DockerApiProxyService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.DockerSwarmService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.NodesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.NodeRole;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.SimpleNode;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.CloudHostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsInstanceState;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.edge.EdgeHostEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.edge.EdgeHostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.location.LocationRequestService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.HostMetricsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.prometheus.PrometheusService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.SshService;
import pt.unl.fct.microservicemanagement.mastermanager.util.Text;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.amazonaws.services.ec2.model.Instance;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class HostsService {

  private final NodesService nodesService;
  private final DockerContainersService dockerContainersService;
  private final DockerSwarmService dockerSwarmService;
  private final EdgeHostsService edgeHostsService;
  private final AwsService awsService;
  private final CloudHostsService cloudHostsService;
  private final SshService sshService;
  private final HostMetricsService hostMetricsService;
  private final PrometheusService prometheusService;
  private final LocationRequestService locationRequestService;
  private final DockerApiProxyService dockerApiProxyService;
  private final String managerHostname;
  private final int maxWorkers;
  private final int maxInstances;

  public HostsService(NodesService nodesService, DockerContainersService dockerContainersService,
                      DockerSwarmService dockerSwarmService, EdgeHostsService edgeHostsService,
                      AwsService awsService, CloudHostsService cloudHostsService, SshService sshService,
                      HostMetricsService hostMetricsService,
                      //TODO fix lazy
                      PrometheusService prometheusService, @Lazy LocationRequestService locationRequestService,
                      DockerApiProxyService dockerApiProxyService, DockerProperties dockerProperties,
                      AwsProperties awsProperties) {
    this.nodesService = nodesService;
    this.dockerContainersService = dockerContainersService;
    this.dockerSwarmService = dockerSwarmService;
    this.edgeHostsService = edgeHostsService;
    this.awsService = awsService;
    this.cloudHostsService = cloudHostsService;
    this.sshService = sshService;
    this.hostMetricsService = hostMetricsService;
    this.prometheusService = prometheusService;
    this.locationRequestService = locationRequestService;
    this.dockerApiProxyService = dockerApiProxyService;
    this.managerHostname = dockerProperties.getSwarm().getManager();
    this.maxWorkers = dockerProperties.getSwarm().getMaxWorkers();
    this.maxInstances = awsProperties.getInstance().getInitialMaxInstances();
  }

  public String getAvailableNodeHostname(double avgContainerMem, HostDetails hostDetails) {
    /*if (hostDetails instanceof EdgeHostDetails) {
      final var edgeHostDetails = (EdgeHostDetails) hostDetails;
      return getAvailableNodeHostname(avgContainerMem, edgeHostDetails.getRegion(),
          edgeHostDetails.getCountry(), edgeHostDetails.getCity());
    }
    else if (hostDetails instanceof AwsHostDetails) {
      final var awsHostDetails = (AwsHostDetails) hostDetails;
      return getAvailableNodeHostname(avgContainerMem, awsHostDetails.getRegion());
    }
    else {
      throw new NotImplementedException();
    }*/
    return getAvailableNodeHostname(avgContainerMem, hostDetails.getRegion(),
        hostDetails.getCountry(), hostDetails.getCity());
  }

  public String getAvailableNodeHostname(double avgContainerMem, String region) {
    return getAvailableNodeHostname(avgContainerMem, region, "", "");
  }

  public String getAvailableNodeHostname(double avgContainerMem, String region, String country, String city) {
    //TODO try to improve method
    log.info("Looking for available nodes to host container with at least '{}' memory...", avgContainerMem);
    var otherRegionsHosts = new LinkedList<String>();
    var sameRegionHosts = new LinkedList<String>();
    var sameCountryHosts = new LinkedList<String>();
    var sameCityHosts = new LinkedList<String>();
    List<SimpleNode> nodes = nodesService.getAvailableNodes();
    nodes.stream()
        .map(SimpleNode::getHostname)
        .filter(hostname -> hostMetricsService.nodeHasAvailableResources(hostname, avgContainerMem))
        .forEach(hostname -> {
          HostDetails hostDetails = getHostDetails(hostname);
          if (Objects.equals(hostDetails.getRegion(), region)) {
            sameRegionHosts.add(hostname);
            /*if (hostDetails instanceof EdgeHostDetails) {
              final var edgeHostDetails = (EdgeHostDetails) hostDetails;
              if (Objects.equals(country, edgeHostDetails.getCountry())) { //TODO confirm that country is never empty
                sameCountryHosts.add(hostname);
                if (Objects.equals(city, edgeHostDetails.getCity())) {  //TODO confirm that city is never empty
                  sameCityHosts.add(hostname);
                }
              }
            }*/
            if (!Text.isNullOrEmpty(country) && hostDetails.getCountry().equals(country)) {
              sameCountryHosts.add(hostname);
            }
            if (!Text.isNullOrEmpty(city) && hostDetails.getCity().equals(city)) {
              sameCityHosts.add(hostname);
            }
          } else {
            otherRegionsHosts.add(hostname);
          }
        });
    log.info("Found hosts {} on same city", sameCityHosts.toString());
    log.info("Found hosts {} on same country", sameCountryHosts.toString());
    log.info("Found hosts {} on same region", sameRegionHosts.toString());
    log.info("Found hosts {} on other regions", otherRegionsHosts.toString());
    var random = new Random();
    if (!sameCityHosts.isEmpty()) {
      return sameCityHosts.get(random.nextInt(sameCityHosts.size()));
    } else if (!sameCountryHosts.isEmpty()) {
      return sameCountryHosts.get(random.nextInt(sameCountryHosts.size()));
    } else if (!sameRegionHosts.isEmpty()) {
      return sameRegionHosts.get(random.nextInt(sameRegionHosts.size()));
    } else if (!otherRegionsHosts.isEmpty() && !"us-east-1".equals(region)) {
      //TODO porquê excluir a região us-east-1?
      // TODO: review otherHostRegion and region us-east-1
      return otherRegionsHosts.get(random.nextInt(otherRegionsHosts.size()));
    } else {
      log.info("Didn't find any available node");
      return addHost(NodeRole.WORKER, region, country, city);
    }
  }

  public HostDetails getHostDetails(String hostname) {
    /*final var edgeHost = edgeHostsService.getEdgeHostByHostname(hostname);
    if (edgeHost != null) {
      return new EdgeHostDetails(hostname, getContinent(edgeHost.getRegion()),
          edgeHost.getRegion(), edgeHost.getCountry(), edgeHost.getCity());
    }
    else {
      final var instance = awsService.getInstanceByPublicIpAddr(hostname);
      final var zone = instance.getPlacement().getAvailabilityZone();
      final var region = Character.isDigit(zone.charAt(zone.length() - 1)) ?
          zone :
          zone.substring(0, zone.length() - 1);
      return new AwsHostDetails(hostname, getContinent(region), region);
    }*/
    String city;
    String country;
    String region;
    String continent;
    if (edgeHostsService.hasEdgeHost(hostname)) {
      EdgeHostEntity edgeHost = edgeHostsService.getEdgeHost(hostname);
      city = edgeHost.getCity();
      country = edgeHost.getCountry();
      region = edgeHost.getRegion();
      continent = getContinent(region);
    } else {
      Instance instance = awsService.getInstanceByPublicIpAddr(hostname);
      city = "";
      country = "";
      String zone = instance.getPlacement().getAvailabilityZone();
      region = Character.isDigit(zone.charAt(zone.length() - 1)) ? zone : zone.substring(0, zone.length() - 1);
      continent = getContinent(zone);
    }
    return new HostDetails(city, country, region, continent);
  }

  private String getContinent(String region) {
    String continent;
    //TODO remove the "none" region
    if (Text.isNullOrEmpty(region) || Objects.equals(region, "none")) {
      continent = "";
    } else {
      String zone = region.substring(0, region.indexOf('-'));
      //TODO convert strings into enum
      if (zone.startsWith("us") || zone.startsWith("ca")) {
        continent = "na";
      } else if (region.startsWith("sa")) {
        continent = "sa";
      } else if (region.startsWith("eu")) {
        continent = "eu";
      } else if (region.contains("ap-southeast-1")) {
        continent = "oc";
      } else if (region.startsWith("ap")) {
        continent = "as";
      } else {
        continent = "";
      }
    }
    return continent;
  }

  public void addHost(NodeRole role, String hostname) {
    setupHost(role, hostname);
  }

  public String addHost(NodeRole role, String region, String country, String city) {
    String hostname = chooseEdgeHost(region, country, city).orElse(chooseCloudHost());
    addHost(role, hostname);
    return hostname;
  }

  public void removeHost(String hostname) {
    //assertHostIsRunning(hostname, 10000);
    //dockerApiProxyService.launchDockerApiProxy(hostname);
    dockerContainersService.getSystemContainers(hostname).stream()
        .filter(c -> !Objects.equals(c.getLabels().get(DockerContainer.Label.SERVICE_NAME),
            DockerApiProxyService.DOCKER_API_PROXY))
        .forEach(c -> dockerContainersService.stopContainer(c.getId(), hostname));
    dockerSwarmService.leaveSwarm(hostname);
    //TODO porquê 5 segundos?
    //Timing.sleep(5, TimeUnit.SECONDS);
    nodesService.deleteHostNodes(hostname);
    if (!edgeHostsService.hasEdgeHost(hostname)) {
      Instance instance = awsService.getInstanceByPublicIpAddr(hostname);
      awsService.stopInstance(instance.getInstanceId());
    }
  }

  public void clusterHosts() {
    var hostnames = new LinkedList<String>();
    hostnames.add(managerHostname);
    if (!edgeHostsService.hasEdgeHost(managerHostname)) {
      log.info("Swarm manager '{}' is on cloud", managerHostname);
      hostnames.addAll(getWorkerAwsNodes());
    } else {
      EdgeHostEntity dockerMasterHost = edgeHostsService.getEdgeHost(managerHostname);
      if (!dockerMasterHost.isLocal()) {
        log.info("Swarm manager '{}' is an edge node, and accessible through internet", managerHostname);
        hostnames.addAll(getWorkerAwsNodes());
      } else {
        log.info("Swarm manager '{}' is local", managerHostname);
        hostnames.addAll(getWorkerEdgeNodes());
      }
    }
    log.info("Clustering hosts into the swarm...");
    hostnames.forEach(hostname ->
        this.setupHost(Objects.equals(hostname, managerHostname) ? NodeRole.MANAGER : NodeRole.WORKER, hostname));
  }

  //TODO make sure there is an odd number of master docker nodes
  private void setupHost(NodeRole role, String hostname) {
    log.info("Setting up host {}", hostname);
    dockerApiProxyService.launchDockerApiProxy(hostname);
    switch (role) {
      case MANAGER:
        setupManager(hostname);
        break;
      case WORKER:
        setupWorker(hostname);
        break;
      default:
        return;
    }
    prometheusService.launchPrometheus(hostname);
    locationRequestService.launchRequestLocationMonitor(hostname);
  }

  private void setupManager(String managerHostname) {
    if (!dockerSwarmService.isASwarmManager(managerHostname)) {
      dockerSwarmService.initSwarm();
    } else {
      log.info("Manager {} is already a swarm manager", managerHostname);
    }
    // TODO why now?
    nodesService.deleteUnresponsiveNodes();
  }

  private void setupWorker(String workerHostname) {
    dockerSwarmService.joinSwarm(workerHostname);
  }

  private List<String> getWorkerAwsNodes() {
    int presentWorkers = nodesService.getAvailableNodes().size() - 1;
    int maxInitialWorkers = Math.max(0, maxInstances - 1);
    int workersToAdd = maxInitialWorkers - presentWorkers;
    List<String> hostnames = new ArrayList<>(workersToAdd);
    for (var i = 0; i < workersToAdd; i++) {
      hostnames.add(chooseCloudHost());
    }
    return hostnames;
  }

  private List<String> getWorkerEdgeNodes() {
    String partialHostname = managerHostname.substring(0, managerHostname.lastIndexOf('.'));
    return edgeHostsService.getHostsByPartialHostname(partialHostname).stream()
        .map(EdgeHostEntity::getHostname)
        .filter(hostname -> !Objects.equals(hostname, managerHostname))
        .filter(this::isHostRunning)
        .limit(maxWorkers)
        .collect(Collectors.toList());
  }

  /*public void assertHostIsRunning(String hostname, long timeout) {
    try {
      Timing.wait(() -> assertHostIsRunning(hostname), timeout);
    } catch (TimeoutException e) {
      throw new HostNotRunningException("Host %s is not running", hostname);
    }
  }*/

  private boolean isHostRunning(String hostname) {
    return sshService.hasConnection(hostname);
  }


  private Optional<String> chooseEdgeHost(String region, String city, String country) {
    List<EdgeHostEntity> edgeHosts = country.isEmpty()
        ? edgeHostsService.getHostsByRegion(region)
        : edgeHostsService.getHostsByCountry(country);
    return edgeHosts.stream()
        .filter(edgeHost -> Text.isNullOrEmpty(city) || Objects.equals(edgeHost.getCity(), city))
        .map(EdgeHostEntity::getHostname)
        .filter(Predicate.not(nodesService::isNode))
        .filter(this::isHostRunning)
        .findFirst();
  }

  //TODO move aws specific code to cloudHostsService
  private String chooseCloudHost() {
    for (var instance : awsService.getSimpleInstances()) {
      int stateCode = instance.getState().getCode();
      if (stateCode == AwsInstanceState.RUNNING.getCode()) {
        String hostname = instance.getPublicIpAddress();
        if (!nodesService.isNode(hostname)) {
          return hostname;
        }
      } else if (stateCode == AwsInstanceState.STOPPED.getCode()) {
        String instanceId = instance.getInstanceId();
        Instance startedInstance = awsService.startInstance(instanceId);
        return startedInstance.getPublicIpAddress();
      }
    }
    return cloudHostsService.startCloudHost().getPublicIpAddress();
  }

}
