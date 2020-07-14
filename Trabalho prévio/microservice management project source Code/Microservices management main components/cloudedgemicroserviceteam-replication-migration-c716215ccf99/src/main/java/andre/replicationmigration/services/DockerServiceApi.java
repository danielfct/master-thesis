package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;

import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.DockerClient.ListContainersParam;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.Container;
import com.spotify.docker.client.messages.Container.PortMapping;
import com.spotify.docker.client.messages.ContainerInfo;
import com.spotify.docker.client.messages.PortBinding;
import com.spotify.docker.client.shaded.com.google.common.collect.ImmutableList;
import com.spotify.docker.client.shaded.com.google.common.collect.ImmutableMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.entities.HostDetails;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.nginx.NginxLoadBalancerApi;
import andre.replicationmigration.nginx.NginxServer;
import andre.replicationmigration.nginx.NginxSimpleServer;
import andre.replicationmigration.reqres.GenericResponse;

@Service
public class DockerServiceApi implements DockerService {

	private String dockerMasterNodeHostname;
	private String dockerApiProxyUsername;
	private String dockerApiProxyPassword;
	private int dockerSecondsBeforeStopContainer;
	private int containerDatabaseDelay;

	@Autowired
	private ServicesConfigsService serviceConfigsService;

	@Autowired
	private NginxLoadBalancerApi nginxApi;

	@Autowired
	private DockerCore dockerCore;

	@Autowired
	private HostService hostService;

	@Autowired
	public DockerServiceApi(@Value("${replic.prop.docker-master-node-hostname}") String dockerMasterNodeHostname,
			@Value("${replic.prop.docker-api-proxy-username}") String dockerApiProxyUsername,
			@Value("${replic.prop.docker-api-proxy-password}") String dockerApiProxyPassword,
			@Value("${replic.prop.docker-seconds-before-stop-container}") int dockerSecondsBeforeStopContainer,
			@Value("${replic.prop.container-database-delay}") int containerDatabaseDelay) {
		this.dockerMasterNodeHostname = dockerMasterNodeHostname;
		this.dockerApiProxyUsername = dockerApiProxyUsername;
		this.dockerApiProxyPassword = dockerApiProxyPassword;
		this.dockerSecondsBeforeStopContainer = dockerSecondsBeforeStopContainer;
		this.containerDatabaseDelay = containerDatabaseDelay;
	}

	private String getLaunchCommand(ServiceConfig serviceConfig, String hostname, String internalPort,
			String externalPort, Map<String, String> params, Map<String, String> labelsMap) {
		String launchCommand = serviceConfig.getLaunchCommand().replace("${hostname}", hostname)
				.replace("${externalPort}", externalPort).replace("${internalPort}", internalPort);

		// Set Eureka
		if (serviceConfigsService.serviceDependsOnOtherService(serviceConfig.getId(), "eureka-server")) {
			ServiceConfig eurekaService = serviceConfigsService.getServiceLaunchConfig("eureka-server");
			String outputLabel = eurekaService.getOutputLabel();
			String region = labelsMap.get("serviceRegion");
			String eurekaAddr = getEurekaServerAddr(region);
			launchCommand = launchCommand.replace(outputLabel, eurekaAddr);
		}

		// Set databases
		List<ServiceConfig> databasesServices = serviceConfigsService.getDependenciesByType(serviceConfig.getId(),
				"database");
		if (!databasesServices.isEmpty()) {
			String outputLabel = "";
			String databaseHost = "";
			for (ServiceConfig databaseService : databasesServices) {
				outputLabel = databaseService.getOutputLabel();
				databaseHost = getDatabaseHostForService(hostname, databaseService);
				launchCommand = launchCommand.replace(outputLabel, databaseHost);
			}
		}

		// Set other params
		if (params != null) {
			for (Entry<String, String> param : params.entrySet()) {
				launchCommand = launchCommand.replace(param.getKey(), param.getValue());
			}
		}

		return launchCommand;
	}

	private String getContainerName(String serviceName, String hostname, String externalPort) {
		return serviceName + "_" + hostname + "_" + externalPort;
	}

	private Map<String, String> getDefaultLabels(String serviceName, String serviceType, String hostname,
			String externalPort) {
		Map<String, String> labels = new HashMap<>();
		HostDetails details = hostService.getHostDetails(hostname);
		labels.put("serviceName", serviceName);
		labels.put("serviceType", serviceType);
		labels.put("serviceAddr", hostname + ":" + externalPort);
		labels.put("serviceHostname", hostname);
		labels.put("serviceContinent", details.getContinent());
		labels.put("serviceRegion", details.getRegion());
		labels.put("serviceCountry", details.getCountry());
		labels.put("serviceCity", details.getCity());

		return labels;
	}

	private List<String> getDefaultLabelsEnvs(Map<String, String> labelsMap) {
		List<String> labels = new ArrayList<>(12);
		labels.add("serviceName::" + labelsMap.get("serviceName"));
		labels.add("serviceType::" + labelsMap.get("serviceType"));
		labels.add("serviceAddr::" + labelsMap.get("serviceAddr"));
		labels.add("serviceHostname::" + labelsMap.get("serviceHostname"));
		labels.add("serviceContinent::" + labelsMap.get("serviceContinent"));
		labels.add("serviceRegion::" + labelsMap.get("serviceRegion"));
		labels.add("serviceCountry::" + labelsMap.get("serviceCountry"));
		labels.add("serviceCity::" + labelsMap.get("serviceCity"));

		labels.add("env::SERVICE_CONTINENT=" + labelsMap.get("serviceContinent"));
		labels.add("env::SERVICE_REGION=" + labelsMap.get("serviceRegion"));
		labels.add("env::SERVICE_COUNTRY=" + labelsMap.get("serviceCountry"));
		labels.add("env::SERVICE_CITY=" + labelsMap.get("serviceCity"));

		return labels;
	}

	private String getAvailableExternalPort(DockerClient docker, String startExternalPort) {
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
	}

	@Override
	public List<GenericResponse> launchContainer(String hostname, ServiceConfig service, Map<String, String> params) {
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		return launchContainer(docker, hostname, service, params, null);
	}

	@Override
	public List<GenericResponse> launchContainer(String hostname, String internalPort, String externalPort,
			String serviceName) {
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		ServiceConfig service = serviceConfigsService.getServiceLaunchConfig(serviceName);

		return launchContainer(docker, hostname, service, internalPort, externalPort, null, null);
	}

	@Override
	public List<GenericResponse> launchContainer(String hostname, String internalPort, String externalPort,
			String serviceName, Map<String, String> params) {
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		ServiceConfig service = serviceConfigsService.getServiceLaunchConfig(serviceName);

		return launchContainer(docker, hostname, service, internalPort, externalPort, params, null);
	}

	private List<GenericResponse> launchContainer(DockerClient docker, String hostname, ServiceConfig service,
			String internalPort, String externalPort, Map<String, String> params, List<String> customLabels) {
		String availableExternalPort = getAvailableExternalPort(docker, externalPort);
		Map<String, String> labelsMap = getDefaultLabels(service.getServiceName(), service.getServiceType(), hostname,
				availableExternalPort);
		String launchCommand = getLaunchCommand(service, hostname, internalPort, availableExternalPort, params,
				labelsMap);
		String containerName = getContainerName(service.getServiceName(), hostname, availableExternalPort);

		List<String> labels = getDefaultLabelsEnvs(labelsMap);
		if (customLabels != null)
			labels.addAll(customLabels);

		List<GenericResponse> response = dockerCore.launchContainer(docker, hostname, internalPort,
				availableExternalPort, containerName, service.getDockerRepo(), launchCommand, labels);

		if (service.getServiceType().equals("frontend")) {
			String serverAddr = hostname + ":" + availableExternalPort;
			String continent = labelsMap.get("serviceContinent");
			String region = labelsMap.get("serviceRegion");
			String country = labelsMap.get("serviceCountry");
			String city = labelsMap.get("serviceCity");
			addServerToLoadBalancer(docker, hostname, service.getServiceName(), serverAddr, continent, region, country,
					city);
		}

		return response;
	}

	private List<GenericResponse> launchContainer(DockerClient docker, String hostname, ServiceConfig service,
			Map<String, String> params, List<String> customLabels) {
		String internalPort = service.getDefaultInternalPort();
		String externalPort = service.getDefaultExternalPort();

		return launchContainer(docker, hostname, service, internalPort, externalPort, params, customLabels);
	}

	@Override
	public List<GenericResponse> stopContainer(String hostname, String containerId) {
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		List<GenericResponse> response = new ArrayList<>(3);
		response.add(new GenericResponse("hostname", hostname));
		removeServerFromLoadBalancer(docker, containerId);
		response.addAll(dockerCore.stopContainer(docker, containerId));

		return response;
	}

	@Override
	public List<GenericResponse> replicateContainer(String fromHostname, String fromContainerId, String toHostname) {
		final DockerClient dockerFrom = dockerCore.getDockerClient(fromHostname);

		try {
			ContainerInfo fromContainer = dockerFrom.inspectContainer(fromContainerId);
			ImmutableList<String> args = fromContainer.args();
			String[] serviceNameSplit = fromContainer.name().replace("/", "").split("_");
			ServiceConfig serviceConfig = serviceConfigsService.getServiceLaunchConfig(serviceNameSplit[0]);
			if (serviceConfig != null) {
				Map<String, String> params = new HashMap<>();
				if (!serviceConfig.getLaunchCommand().equals("")) {
					String[] launchCommandSplit = serviceConfig.getLaunchCommand().split(" ");
					if (args.size() == launchCommandSplit.length) { // Same args size
						for (int i = 0; i < args.size(); i++) {
							params.put(launchCommandSplit[i], args.get(i));
						}
					}
				}
				ImmutableMap<String, List<PortBinding>> ports = fromContainer.hostConfig().portBindings();
				for (Entry<String, List<PortBinding>> port : ports.entrySet()) {
					String internalPort = port.getKey();
					for (PortBinding portBinding : port.getValue()) {
						String startExternalPort = portBinding.hostPort();
						if (fromHostname.equals(toHostname)) {
							return launchContainer(dockerFrom, fromHostname, serviceConfig, internalPort,
									startExternalPort, params, null);
						} else {
							final DockerClient dockerTo = dockerCore.getDockerClient(toHostname);
							return launchContainer(dockerTo, toHostname, serviceConfig, internalPort, startExternalPort,
									params, null);
						}
					}
				}
			}
		} catch (DockerException | InterruptedException e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<GenericResponse> migrateContainer(String fromHostname, String fromContainerId, String toHostname) {
		return this.migrateContainer(fromHostname, fromContainerId, toHostname, dockerSecondsBeforeStopContainer);
	}

	@Override
	public List<GenericResponse> migrateContainer(String fromHostname, String fromContainerId, String toHostname,
			int secondsBeforeStop) {
		int safeSeconds = secondsBeforeStop < 1 ? dockerSecondsBeforeStopContainer : secondsBeforeStop;
		List<GenericResponse> response = this.replicateContainer(fromHostname, fromContainerId, toHostname);
		Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				List<GenericResponse> stopResponseList = stopContainer(fromHostname, fromContainerId);
				System.out.println("-> Stop container '" + fromContainerId + "'");
				for (GenericResponse stopResponse : stopResponseList) {
					System.out.println("-> " + stopResponse.toString());
				}
			}
		}, safeSeconds * 1000);

		return response;
	}

	/***** LOAD BALANCER FUNCTIONS *****/

	private List<DockerSimpleContainer> getLoadBalancersFromService(String serviceName) {
		List<DockerSimpleContainer> loadBalancerContainers = dockerCore.getContainers(
				ListContainersParam.withLabel("serviceName", "load-balancer"),
				ListContainersParam.withLabel("forService", serviceName));
		if (!loadBalancerContainers.isEmpty())
			return loadBalancerContainers;
		else
			return null;
	}

	public void launchEmptyLoadBalancer(String hostname, String serviceName) {
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		ServiceConfig loadBalancerService = serviceConfigsService.getServiceLaunchConfig("load-balancer");
		List<String> customLabel = new ArrayList<>(4);
		customLabel.add("forService::" + serviceName);
		customLabel.add("env::SERVER1=" + "127.0.0.1:1906"); //Empty server on begining
		customLabel.add("env::SERVER1_CONTINENT=" + "none");
		customLabel.add("env::SERVER1_REGION=" + "none");
		customLabel.add("env::SERVER1_COUNTRY=" + "none");
		customLabel.add("env::SERVER1_CITY=" + "none");
		customLabel.add("env::BASIC_AUTH_USERNAME=" + dockerApiProxyUsername);
		customLabel.add("env::BASIC_AUTH_PASSWORD=" + dockerApiProxyPassword);
		launchContainer(docker, hostname, loadBalancerService, null, customLabel);
	}

	private void launchLoadBalancer(DockerClient docker, String hostname, String serviceName, String serverAddr,
			String continent, String region, String country, String city) {
		ServiceConfig loadBalancerService = serviceConfigsService.getServiceLaunchConfig("load-balancer");
		List<String> customLabel = new ArrayList<>(4);
		customLabel.add("forService::" + serviceName);
		customLabel.add("env::SERVER1=" + serverAddr);
		customLabel.add("env::SERVER1_CONTINENT=" + continent);
		customLabel.add("env::SERVER1_REGION=" + region);
		customLabel.add("env::SERVER1_COUNTRY=" + country);
		customLabel.add("env::SERVER1_CITY=" + city);
		customLabel.add("env::BASIC_AUTH_USERNAME=" + dockerApiProxyUsername);
		customLabel.add("env::BASIC_AUTH_PASSWORD=" + dockerApiProxyPassword);
		launchContainer(docker, hostname, loadBalancerService, null, customLabel);
	}

	private void addServerToLoadBalancer(DockerClient docker, String hostname, String serviceName, String serverAddr,
			String continent, String region, String country, String city) {
		List<DockerSimpleContainer> loadBalancers = getLoadBalancersFromService(serviceName);
		if (loadBalancers == null) {
			launchLoadBalancer(docker, hostname, serviceName, serverAddr, continent, region, country, city);
		} else {
			for(DockerSimpleContainer loadBalancer : loadBalancers) {
				String loadBalancerUrl = loadBalancer.getHostname() + ":" + loadBalancer.getPorts().get(0).getPublicPort();
				nginxApi.addServer(loadBalancerUrl, new NginxServer(serverAddr, continent, region, country, city));
			}
		}
	}

	private void removeServerFromLoadBalancer(DockerClient docker, String containerId) {
		ImmutableMap<String, String> labels = dockerCore.getContainerLabelsById(docker, containerId);
		boolean hasAllLabels = labels.containsKey("serviceName") && labels.containsKey("serviceType")
				&& labels.containsKey("serviceAddr");
		if (hasAllLabels) {
			if (labels.get("serviceType").equals("frontend")) {
				String serviceName = labels.get("serviceName");
				List<DockerSimpleContainer> loadBalancers = getLoadBalancersFromService(serviceName);
				if (loadBalancers != null) {
					for(DockerSimpleContainer loadBalancer : loadBalancers) {
						String server = labels.get("serviceAddr");
						String loadBalancerUrl = loadBalancer.getLabels().get("serviceAddr");
						nginxApi.deleteServer(loadBalancerUrl, new NginxSimpleServer(server));
					}
				} else {
					System.out.println("Could not remove server from Load Balancer: cause Load Balancer not found!");
				}
			}
		}
	}

	/***** EUREKA FUNCTIONS *****/

	@Override
	public void launchEureka(String hostname, String otherEurekaServers) {
		String serviceName = "eureka-server";
		final DockerClient docker = dockerCore.getDockerClient(hostname);		
		ServiceConfig service = serviceConfigsService.getServiceLaunchConfig(serviceName);
		Map<String, String> params = new HashMap<>();
		params.put("${zone}", otherEurekaServers);
		launchContainer(docker, hostname, service, params, null);
	}

	private String getEurekaServerAddr(String region) {
		List<DockerSimpleContainer> eurekaContainer = dockerCore.getContainers(
				ListContainersParam.withLabel("serviceName", "eureka-server"),
				ListContainersParam.withLabel("serviceRegion", region));

		if (!eurekaContainer.isEmpty())
			return eurekaContainer.get(0).getLabels().get("serviceAddr");

		else
			return null;
	}

	/***** DATABASE FUNCTIONS *****/

	private String getDatabaseHostForService(String serviceHostname, ServiceConfig databaseService) {
		boolean isExternalService = false;
		String databaseHost = "";
		if (isExternalService) {
			/*
			 * TODO : Request to external Database service
			 */
		} else { // Get an existent dabase on host, or if not exist on host create a new one
			final DockerClient docker = dockerCore.getDockerClient(serviceHostname);
			List<DockerSimpleContainer> databaseContainers = dockerCore.getContainers(docker,
					ListContainersParam.withLabel("serviceName", databaseService.getServiceName()));
			if (!databaseContainers.isEmpty()) {
				databaseHost = databaseContainers.get(0).getLabels().get("serviceAddr");
			} else {
				List<GenericResponse> responses = launchContainer(docker, serviceHostname, databaseService, null, null);
				sleep(containerDatabaseDelay);
				for (GenericResponse res : responses) {
					if (res.getKey().equals("output")) {
						databaseHost = res.getValue();
						break;
					}
				}
			}
		}
		return databaseHost;
	}

	/***** PROMETHEUS FUNCTIONS *****/

	@Override
	public void launchPrometheus(String hostname) {
		String serviceName = "prometheus";
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		List<DockerSimpleContainer> containers = dockerCore.getContainers(docker,
				ListContainersParam.withLabel("serviceName", serviceName));
		if (containers.isEmpty()) {
			ServiceConfig service = serviceConfigsService.getServiceLaunchConfig(serviceName);
			launchContainer(docker, hostname, service, null, null);
		}
	}

	@Override
	public void launchReqLocMonitor(String hostname) {
		String serviceName = "request-location-monitor";
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		List<DockerSimpleContainer> containers = dockerCore.getContainers(docker,
				ListContainersParam.withLabel("serviceName", serviceName));
		if (containers.isEmpty()) {
			ServiceConfig service = serviceConfigsService.getServiceLaunchConfig(serviceName);
			launchContainer(docker, hostname, service, null, null);
		}
	}

	/***** SYSTEM CONTAINER FUNCTIONS *****/

	@Override
	public List<DockerSimpleContainer> getSystemContainers(String hostname) {
		final DockerClient docker = dockerCore.getDockerClient(hostname);
		return dockerCore.getContainers(docker, ListContainersParam.withLabel("serviceType", "system"));
	}

	private void sleep(long millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}