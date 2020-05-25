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

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.stereotype.Service;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.MasterManagerException;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerCoreService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node.NodesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.HostDetails;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.HostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.loadbalancer.nginx.NginxLoadBalancerService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.CommandResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.SshService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceOrder;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.discovery.eureka.EurekaService;
import pt.unl.fct.microservicemanagement.mastermanager.util.Timing;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.Container;
import com.spotify.docker.client.messages.ContainerConfig;
import com.spotify.docker.client.messages.ContainerCreation;
import com.spotify.docker.client.messages.ContainerInfo;
import com.spotify.docker.client.messages.ContainerStats;
import com.spotify.docker.client.messages.HostConfig;
import com.spotify.docker.client.messages.PortBinding;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;

@Service
@Slf4j
public class DockerContainersService {

  private static final long DELAY_BETWEEN_CONTAINER_LAUNCH = TimeUnit.SECONDS.toMillis(5);
  //TODO lower or higher sleep?
  private static final long CPU_SLEEP = TimeUnit.MILLISECONDS.toMillis(100);

  private final DockerCoreService dockerCoreService;
  private final NodesService nodesService;
  private final AppsService appsService;
  private final ServicesService serviceService;
  private final NginxLoadBalancerService nginxLoadBalancerService;
  private final EurekaService eurekaService;
  private final HostsService hostsService;
  private final SshService sshService;
  private final ContainersService containersService;

  private final String dockerHubUsername;
  private final int dockerDelayBeforeStopContainer;

  //FIXME remove @Lazy
  public DockerContainersService(DockerCoreService dockerCoreService, NodesService nodesService,
                                 AppsService appsService, ServicesService serviceService,
                                 @Lazy NginxLoadBalancerService nginxLoadBalancerService,
                                 @Lazy EurekaService eurekaService, @Lazy HostsService hostsService,
                                 SshService sshService,
                                 ContainersService containersService,
                                 DockerProperties dockerProperties,
                                 ContainerProperties containerProperties) {
    this.dockerCoreService = dockerCoreService;
    this.nodesService = nodesService;
    this.appsService = appsService;
    this.serviceService = serviceService;
    this.nginxLoadBalancerService = nginxLoadBalancerService;
    this.eurekaService = eurekaService;
    this.hostsService = hostsService;
    this.sshService = sshService;
    this.containersService = containersService;
    this.dockerHubUsername = dockerProperties.getHub().getUsername();
    this.dockerDelayBeforeStopContainer = containerProperties.getDelayBeforeStop();
  }

  public Map<String, List<SimpleContainer>> launchMicroserviceApplication(long applicationId, String region,
                                                                          String country, String city) {
    // TODO : review launchMicroserviceApplication
    var serviceContainers = new HashMap<String, List<SimpleContainer>>();
    var dynamicLaunchParams = new HashMap<String, String>();
    log.info("Launching app {} at {}/{}/{}", applicationId, region, country, city);
    appsService.getServiceByAppId(applicationId).stream()
        .filter(serviceOrder -> !Objects.equals(serviceOrder.getService().getServiceType(), "database"))
        .map(ServiceOrder::getService)
        .forEach(service -> {
          List<SimpleContainer> containers = launchMicroservice(service, region, country, city, dynamicLaunchParams);
          serviceContainers.put(service.getServiceName(), containers);
          containers.forEach(container -> {
            String hostname = container.getHostname();
            int privatePort = container.getPorts().get(0).getPrivatePort();
            dynamicLaunchParams.put(service.getOutputLabel(), String.format("%s:%d", hostname, privatePort));
            // TODO qual a utilidade do dynamicLaunchParams?
          });
          //TODO rever tempo de espera entre cada container
          Timing.sleep(DELAY_BETWEEN_CONTAINER_LAUNCH, TimeUnit.MILLISECONDS);
        });
    return serviceContainers;
  }

  /**
   * Launches a certain number of containers at a certain location
   * @param service the service to launch
   * @param region the region to launch at
   * @param country the country to launch at
   * @param city the city to launch at
   * @param dynamicLaunchParams TODO
   * @return the list of all launched container ids
   */
  private List<SimpleContainer> launchMicroservice(ServiceEntity service, String region, String country,
                                                   String city, Map<String, String> dynamicLaunchParams) {
    List<String> customEnvs = Collections.emptyList();
    Map<String, String> customLabels = Collections.emptyMap();
    double expectedMemoryConsumption = service.getExpectedMemoryConsumption();
    int minReplicas = serviceService.getMinReplicasByServiceName(service.getServiceName());
    var containers = new ArrayList<SimpleContainer>(minReplicas);
    for (int i = 0; i < minReplicas; i++) {
      String hostname = hostsService.getAvailableNodeHostname(expectedMemoryConsumption, region, country, city);
      SimpleContainer container = launchContainer(hostname, service, customEnvs, customLabels, dynamicLaunchParams);
      containers.add(container);
    }
    return containers;
  }

  private SimpleContainer launchContainer(String hostname, String serviceName) {
    List<String> customEnvs = Collections.emptyList();
    Map<String, String> customLabels = Collections.emptyMap();
    Map<String, String> dynamicLaunchParams = Collections.emptyMap();
    return launchContainer(hostname, serviceName, customEnvs, customLabels, dynamicLaunchParams);
  }

  public SimpleContainer launchContainer(String hostname, String serviceName,
                                         String internalPort, String externalPort) {
    Map<String, String> dynamicLaunchParams = Collections.emptyMap();
    return launchContainer(hostname, serviceName, internalPort, externalPort, dynamicLaunchParams);
  }

  public SimpleContainer launchContainer(String hostname, String serviceName, String internalPort, String externalPort,
                                         Map<String, String> dynamicLaunchParams) {
    ServiceEntity service = serviceService.getService(serviceName).toBuilder()
        .defaultInternalPort(internalPort)
        .defaultExternalPort(externalPort)
        .build();
    List<String> customEnvs = Collections.emptyList();
    Map<String, String> customLabels = Collections.emptyMap();
    return launchContainer(hostname, service, customEnvs, customLabels, dynamicLaunchParams);
  }

  public SimpleContainer launchContainer(String hostname, String serviceName, List<String> customEnvs,
                                         Map<String, String> customLabels, Map<String, String> dynamicLaunchParams) {
    ServiceEntity service = serviceService.getService(serviceName);
    return launchContainer(hostname, service, customEnvs, customLabels, dynamicLaunchParams);
  }

  /**
   * Launch a container
   * @param hostname at this hostname
   * @param service with this service
   * @param customEnvs environment values specific to the service
   * @param customLabels label values specific to the service
   * @param dynamicLaunchParams TODO
   * @return the new container
   */
  private SimpleContainer launchContainer(String hostname, ServiceEntity service, List<String> customEnvs,
                                          Map<String, String> customLabels, Map<String, String> dynamicLaunchParams) {
    log.info("Launching container...");
    String serviceName = service.getServiceName();
    long serviceId = service.getId();
    String serviceType = service.getServiceType();
    String internalPort = service.getDefaultInternalPort();
    String externalPort = findAvailableExternalPort(hostname, service.getDefaultExternalPort());
    var serviceAddr = String.format("%s:%s", hostname, externalPort);
    var containerName = String.format("%s_%s_%s", serviceName, hostname, externalPort);
    var dockerRepository = String.format("%s/%s", dockerHubUsername, service.getDockerRepository());
    HostDetails hostDetails = hostsService.getHostDetails(hostname);
    String continent = hostDetails.getContinent();
    String region = hostDetails.getRegion();
    String country = hostDetails.getCountry();
    String city = hostDetails.getCity();
    /*String country = hostDetails instanceof EdgeHostDetails ? ((EdgeHostDetails)hostDetails).getCountry() : "";
    String city = hostDetails instanceof EdgeHostDetails ? ((EdgeHostDetails)hostDetails).getCity() : "";*/
    String launchCommand = service.getLaunchCommand();
    launchCommand = launchCommand
        .replace("${hostname}", hostname)
        .replace("${externalPort}", externalPort)
        .replace("${internalPort}", internalPort);
    if (serviceService.serviceDependsOnOtherService(serviceId, "eureka-server")) {
      var outputLabel = serviceService.getService("eureka-server").getOutputLabel();
      var eurekaAddr = eurekaService.getEurekaServerAddress(region);
      if (eurekaAddr.isPresent()) {
        launchCommand = launchCommand.replace(outputLabel, eurekaAddr.get());
      } else {
        //TODO apagar depois de ver se não houver erro
        log.error("eureka address at region '{}' not found", region);
      }
    }
    for (ServiceEntity databaseService : serviceService.getDependenciesByType(serviceId, "database")) {
      String databaseServiceName = databaseService.getServiceName();
      String databaseHost = getDatabaseHostForService(hostname, databaseServiceName);
      String outputLabel = databaseService.getOutputLabel();
      launchCommand = launchCommand.replace(outputLabel, databaseHost);
    }
    for (Map.Entry<String, String> param : dynamicLaunchParams.entrySet()) {
      launchCommand = launchCommand.replace(param.getKey(), param.getValue());
    }
    var envs = new LinkedList<>(List.of(
        DockerContainer.Environment.SERVICE_CONTINENT + "=" + continent,
        DockerContainer.Environment.SERVICE_REGION + "=" + region,
        DockerContainer.Environment.SERVICE_COUNTRY + "=" + country,
        DockerContainer.Environment.SERVICE_CITY + "=" + city));
    envs.addAll(customEnvs);
    var labels = new HashMap<>(Map.of(
        DockerContainer.Label.SERVICE_NAME, serviceName,
        DockerContainer.Label.SERVICE_TYPE, serviceType,
        DockerContainer.Label.SERVICE_ADDRESS, serviceAddr,
        DockerContainer.Label.SERVICE_HOSTNAME, hostname,
        DockerContainer.Label.SERVICE_CONTINENT, continent,
        DockerContainer.Label.SERVICE_REGION, region,
        DockerContainer.Label.SERVICE_COUNTRY, country,
        DockerContainer.Label.SERVICE_CITY, city));
    labels.putAll(customLabels);
    //TODO porquê repetir informação nos envs e labels?
    log.info("hostname = '{}', internalPort = '{}', externalPort = '{}', containerName = '{}', "
            + "dockerRepository = '{}', launchCommand = '{}', envs = '{}', labels = '{}'",
        hostname, internalPort, externalPort, containerName, dockerRepository, launchCommand, envs, labels);
    HostConfig hostConfig = HostConfig.builder()
        .autoRemove(true)
        .portBindings(Map.of(internalPort, List.of(PortBinding.of("", externalPort))))
        .build();
    ContainerConfig.Builder containerBuilder = ContainerConfig.builder()
        .image(dockerRepository)
        .exposedPorts(internalPort)
        .hostConfig(hostConfig)
        .labels(labels)
        .env(envs);
    ContainerConfig containerConfig = launchCommand.isEmpty()
        ? containerBuilder.build()
        : containerBuilder.cmd(launchCommand.split(" ")).build();
    try (var dockerClient = dockerCoreService.getDockerClient(hostname)) {
      dockerClient.pull(dockerRepository);
      ContainerCreation containerCreation = dockerClient.createContainer(containerConfig, containerName);
      String containerId = containerCreation.id();
      dockerClient.startContainer(containerId);
      if (Objects.equals(serviceType, "frontend")) {
        nginxLoadBalancerService.addToLoadBalancer(
            hostname, serviceName, serviceAddr, continent, region, country, city);
      }
      SimpleContainer container = getContainer(containerId);
      containersService.addContainerFromDockerContainer(container);
      return container;
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  /**
   * Launches a singleton service (which means just 1 service per host)
   * @param hostname
   * @param serviceName
   * @return
   */
  public SimpleContainer launchSingletonService(String hostname, String serviceName) {
    log.info("Launching singleton service '{}' at hostname '{}' ...", serviceName, hostname);
    List<SimpleContainer> containers = getContainers(hostname,
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_NAME, serviceName));
    SimpleContainer container;
    if (containers.isEmpty()) {
      container = launchContainer(hostname, serviceName);
    } else {
      container = containers.get(0);
      log.info("container '{}' is already running service '{}' at hostname '{}'",
          container.getId(), serviceName, hostname);
    }
    return container;
  }

  private String findAvailableExternalPort(String hostname, String startExternalPort) {
    var command = "lsof -i -P -n | grep LISTEN | awk '{print $9}' | cut -d: -f2";
    CommandResult commandResult = sshService.execCommand(hostname, "findAvailableExternalPort", command, true);
    if (!commandResult.isSuccessful()) {
      throw new MasterManagerException("Unable to find currently used external ports at %s: %s ", hostname,
          commandResult.getError());
    }
    Pattern isNumberPattern = Pattern.compile("-?\\d+(\\.\\d+)?");
    List<Integer> usedExternalPorts = Arrays.stream(commandResult.getOutput().split("\n"))
        .filter(v -> isNumberPattern.matcher(v).matches())
        .map(Integer::parseInt)
        .collect(Collectors.toList());
    for (var i = Integer.parseInt(startExternalPort); ; i++) {
      if (!usedExternalPorts.contains(i)) {
        return String.valueOf(i);
      }
    }
  }

  /*private String getAvailableExternalPort(DockerClient docker, String startExternalPort) {
    int externalPort = Integer.valueOf(startExternalPort);
    boolean foundAvailableExternalPort = false;
    try {
      List<Container> containers = docker.listContainers(ListContainersParam.withStatusCreated(),
          ListContainersParam.withStatusRunning(), ListContainersParam.withStatusExited());
      Map<Integer, Integer> portsMap = new HashMap<>();
      for (Container container : containers) {
        for (PortMapping port : container.ports()) {
          portsMap.put(port.publicPort(), port.publicPort());
        }
      }
      while (!foundAvailableExternalPort) {
        if (portsMap.containsKey(externalPort))
          externalPort++;
        else
          foundAvailableExternalPort = true;
      }
      return String.valueOf(externalPort);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
    }
    return null;
  }*/

  /**
   *
   * @param hostname
   * @param databaseServiceName
   * @return the service address of the database
   */
  private String getDatabaseHostForService(String hostname, String databaseServiceName) {
    Optional<SimpleContainer> databaseContainer = findContainer(hostname,
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_NAME, databaseServiceName));
    if (databaseContainer.isEmpty()) {
      log.info("No database '{}' found on host '{}'", databaseServiceName, hostname);
      SimpleContainer container = launchContainer(hostname, databaseServiceName);
      //TODO review
      do {
        Timing.sleep(CPU_SLEEP, TimeUnit.MILLISECONDS);
        log.info("Looking for database '{}' on container '{}'", databaseServiceName, container.getId());
        databaseContainer = findContainer(container.getId());
        //TODO add timeout?
      } while (databaseContainer.isEmpty());
    }
    String serviceAddress = databaseContainer.get().getLabels().get(DockerContainer.Label.SERVICE_ADDRESS);
    log.info("Found database '{}' with state '{}'", serviceAddress, databaseContainer.get().getState());
    //TODO make sure container is on state ready?
    return serviceAddress;
  }

  public void stopContainer(String id) {
    SimpleContainer container = getContainer(id);
    String hostname = container.getHostname();
    stopContainer(id, hostname);
  }

  public void stopContainer(String id, String hostname) {
    ContainerInfo containerInfo = inspectContainer(id, hostname);
    String serviceType = containerInfo.config().labels().get(DockerContainer.Label.SERVICE_TYPE);
    if (Objects.equals(serviceType, "frontend")) {
      nginxLoadBalancerService.removeFromLoadBalancer(hostname, id);
    }
    try (var dockerClient = dockerCoreService.getDockerClient(hostname)) {
      //TODO espera duas vezes no caso de migração!?!?
      dockerClient.stopContainer(id, dockerDelayBeforeStopContainer);
      log.info("Stopped container '{}' on host '{}'", id, hostname);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public SimpleContainer replicateContainer(String id, String toHostname) {
    SimpleContainer container = getContainer(id);
    String fromHostname = container.getHostname();
    return replicateContainer(id, fromHostname, toHostname);
  }

  public SimpleContainer replicateContainer(String id, String fromHostname, String toHostname) {
    ContainerInfo fromContainer = inspectContainer(id, fromHostname);
    String serviceName = fromContainer.name().replace("/", "").split("_")[0];
    Map.Entry<String, List<PortBinding>> port = fromContainer.hostConfig().portBindings().entrySet().iterator().next();
    String internalPort = port.getKey();
    String externalPort = port.getValue().get(0).hostPort();
    ServiceEntity service = serviceService.getService(serviceName).toBuilder()
        .defaultInternalPort(internalPort)
        .defaultExternalPort(externalPort)
        .build();
    List<String> customEnvs = Collections.emptyList();
    Map<String, String> customLabels = Collections.emptyMap();
    Map<String, String> dynamicLaunchParams;
    if (!service.hasLaunchCommand()) {
      dynamicLaunchParams = Collections.emptyMap();
    } else {
      List<String> args = fromContainer.args();
      var params = Arrays.asList(service.getLaunchCommand().split(" "));
      assert args.size() == params.size();
      // Merge the 2 lists into a map
      dynamicLaunchParams = IntStream
          .range(0, params.size())
          .boxed()
          .collect(Collectors.toMap(params::get, args::get));
    }
    return launchContainer(toHostname, service, customEnvs, customLabels, dynamicLaunchParams);
  }

  public List<SimpleContainer> migrateContainers(String fromHostname, String toHostname) {
    List<SimpleContainer> containers = getContainers(fromHostname).stream()
        .filter(c -> List.of("backend", "frontend").contains(c.getLabels().get(DockerContainer.Label.SERVICE_TYPE)))
        .collect(Collectors.toList());
    var migratedContainers = new ArrayList<SimpleContainer>(containers.size());
    containers.forEach(c -> migratedContainers.add(migrateContainer(c.getId(), toHostname)));
    return migratedContainers;
  }

  public SimpleContainer migrateContainer(String containerId, String hostname, String toHostname) {
    SimpleContainer replicaContainer = replicateContainer(containerId, toHostname);
    new Timer("StopContainerTimer").schedule(new TimerTask() {
      @Override
      public void run() {
        if (hostname != null) {
          stopContainer(containerId, hostname);
        } else {
          stopContainer(containerId);
        }
      }
    }, dockerDelayBeforeStopContainer);
    return replicaContainer;
  }

  public SimpleContainer migrateContainer(String containerId, String toHostname) {
    return migrateContainer(containerId, null, toHostname);
  }

  public List<SimpleContainer> getContainers(DockerClient.ListContainersParam... filter) {
    return getAllContainers(filter);
  }

  public List<SimpleContainer> getContainers(String hostname, DockerClient.ListContainersParam... filter) {
    try (var dockerClient = dockerCoreService.getDockerClient(hostname)) {
      return dockerClient.listContainers(filter).stream().map(this::buildSimpleContainer).collect(Collectors.toList());
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public Optional<SimpleContainer> findContainer(String hostname, DockerClient.ListContainersParam... filter) {
    return getContainers(hostname, filter).stream().findFirst();
  }

  private Optional<SimpleContainer> findContainer(String id) {
    //TODO confirm filter correctness
    DockerClient.ListContainersParam idFilter = DockerClient.ListContainersParam.filter("id", id);
    return getContainers(idFilter).stream().findFirst();
  }

  private List<SimpleContainer> getAllContainers(DockerClient.ListContainersParam... filter) {
    return nodesService.getAvailableNodes().stream()
        .map(node -> getContainers(node.getHostname(), filter))
        .flatMap(List::stream)
        .collect(Collectors.toList());
  }

  public SimpleContainer getContainer(String id) {
    //TODO change to entityNotFoundException
    return findContainer(id).orElseThrow(() -> new NotFoundException("Container not found"));
  }

  public List<SimpleContainer> getAppContainers() {
    return getContainers(
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_TYPE, "frontend"),
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_TYPE, "backend"));
  }

  public List<SimpleContainer> getAppContainers(String hostname) {
    return getContainers(hostname,
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_TYPE, "frontend"),
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_TYPE, "backend"));
  }

  public List<SimpleContainer> getDatabaseContainers(String hostname) {
    return getContainers(hostname,
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_TYPE, "database"));
  }

  public List<SimpleContainer> getSystemContainers(String hostname) {
    return getContainers(hostname,
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_TYPE, "system"));
  }

  public ContainerInfo inspectContainer(String containerId, String hostname) {
    try (var dockerClient = dockerCoreService.getDockerClient(hostname)) {
      return dockerClient.inspectContainer(containerId);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public ContainerStats getContainerStats(String containerId, String hostname) {
    try (var dockerClient = dockerCoreService.getDockerClient(hostname)) {
      return dockerClient.stats(containerId);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  private SimpleContainer buildSimpleContainer(Container container) {
    String id = container.id();
    long created = container.created();
    List<String> names = container.names();
    String image = container.image();
    String command = container.command();
    String state = container.state();
    String status = container.status();
    String hostname = container.labels().get(DockerContainer.Label.SERVICE_HOSTNAME);
    List<ContainerPortMapping> ports = container.ports().stream()
        .map(p -> new ContainerPortMapping(p.privatePort(), p.publicPort(), p.type(), p.ip()))
        .collect(Collectors.toList());
    Map<String, String> labels = container.labels();
    String logs = null;
    try (var docker = dockerCoreService.getDockerClient(hostname);
         var stream = docker.logs(id, DockerClient.LogsParam.stdout(), DockerClient.LogsParam.stderr())) {
      logs = stream.readFully();
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
    }
    return new SimpleContainer(id, created, names, image, command, state, status, hostname, ports, labels, logs);
  }



}
