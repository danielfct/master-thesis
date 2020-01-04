package andre.replicationmigration.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.entities.DockerSimpleNode;
import andre.replicationmigration.model.Region;
import andre.replicationmigration.reqres.AddNodeReq;
import andre.replicationmigration.reqres.CommandResult;
import andre.replicationmigration.reqres.CommandSshData;
import andre.replicationmigration.reqres.GenericResponse;
import andre.replicationmigration.reqres.LaunchAppReq;
import andre.replicationmigration.reqres.LaunchLoadBalacerReq;
import andre.replicationmigration.reqres.LaunchServiceReq;
import andre.replicationmigration.reqres.MigrateContainerReq;
import andre.replicationmigration.reqres.ReplicateContainerReq;
import andre.replicationmigration.reqres.StopNodeReq;
import andre.replicationmigration.reqres.StopServiceReq;
import andre.replicationmigration.services.AppPackageService;
import andre.replicationmigration.services.CommandSshService;
import andre.replicationmigration.services.DockerCore;
import andre.replicationmigration.services.DockerServiceApi;
import andre.replicationmigration.services.EurekaService;
import andre.replicationmigration.services.HostService;
import andre.replicationmigration.services.LoadBalancerService;
import andre.replicationmigration.ssh.CommandSsh;

@Controller
@RequestMapping(value = "/api")
public class ApiController {

	@Autowired
	private AppPackageService appService;

	@Autowired
	private CommandSsh ssh;

	@Autowired
	private CommandSshService sshService;

	@Autowired
	private DockerServiceApi dockerService;

	@Autowired
	private DockerCore dockerCore;

	@Autowired
	private HostService hostService;

	@Autowired
	private EurekaService eurekaService;

	@Autowired
	private LoadBalancerService loadBalancerService;


	@RequestMapping(value = "/exec", method = RequestMethod.POST)
	public @ResponseBody CommandResult exec(@RequestBody CommandSshData commandData) {
		CommandResult result = ssh.exec(commandData.getHostname(), commandData.getUsername(), commandData.getPassword(),
				commandData.getCommand());
		return result;
	}

	@RequestMapping(value = "/upload/dockerscript", method = RequestMethod.POST)
	public @ResponseBody GenericResponse uploadDockerScript(@RequestBody GenericResponse hostname) {
		boolean result = sshService.uploadDockerScript(hostname.getValue());
		return new GenericResponse("success", String.valueOf(result));
	}

	@RequestMapping(value = "/containers")
	public @ResponseBody List<DockerSimpleContainer> getContainers() {
		return dockerCore.getContainers();
	}

	@RequestMapping(value = "/containers", method = RequestMethod.POST)
	public @ResponseBody List<GenericResponse> launchContainer(@RequestBody LaunchServiceReq launchServiceReq) {
		return dockerService.launchContainer(launchServiceReq.getHostname(), launchServiceReq.getInternalPort(),
				launchServiceReq.getExternalPort(), launchServiceReq.getService(), null);
	}

	@RequestMapping(value = "/containers/{containerId}", method = RequestMethod.DELETE)
	public @ResponseBody List<GenericResponse> stopContainer(@PathVariable String containerId,
			@RequestBody StopServiceReq stopServiceReq) {
		return dockerService.stopContainer(stopServiceReq.getHostname(), containerId);
	}

	@RequestMapping(value = "/containers/replicate", method = RequestMethod.POST)
	public @ResponseBody List<GenericResponse> replicateContainer(@RequestBody ReplicateContainerReq repContainerReq) {
		return dockerService.replicateContainer(repContainerReq.getFromHostname(), repContainerReq.getContainerId(),
				repContainerReq.getToHostname());
	}

	@RequestMapping(value = "/containers/migrate", method = RequestMethod.POST)
	public @ResponseBody List<GenericResponse> migrateContainer(@RequestBody MigrateContainerReq migContainerReq) {
		return dockerService.migrateContainer(migContainerReq.getFromHostname(), migContainerReq.getContainerId(),
				migContainerReq.getToHostname(), migContainerReq.getSecondsBeforeStop());
	}

	@RequestMapping(value = "/nodes")
	public @ResponseBody List<DockerSimpleNode> getAvailableNodes() {
		return dockerCore.getAvailableNodes();
	}

	@RequestMapping(value = "/nodes", method = RequestMethod.POST)
	public @ResponseBody List<String> addNode(@RequestBody AddNodeReq addNodeReq) {
		List<String> response = new ArrayList<>();
		for (int i = 0; i < addNodeReq.getQuantity(); i++) {
			String hostname = hostService.addHostToSwarm(addNodeReq.getRegion(), addNodeReq.getCountry(),
				addNodeReq.getCity());
			response.add(hostname);
		}		
		return response;
	}

	@RequestMapping(value = "/nodes", method = RequestMethod.DELETE)
	public @ResponseBody List<GenericResponse> removeNode(@RequestBody StopNodeReq stopNodeReq) {
		boolean success = hostService.removeHostFromSwarm(stopNodeReq.getHostname());
		List<GenericResponse> response = new ArrayList<>();
		response.add(new GenericResponse("success", String.valueOf(success)));
		return response;
	}

	@RequestMapping(value = "/launch/apps/{appId}", method = RequestMethod.POST)
	public @ResponseBody Map<String, List<GenericResponse>> launchApp(@PathVariable long appId,
			@RequestBody LaunchAppReq launchAppReq) {
		
		Map<String, List<GenericResponse>> response = appService.launchApp(appId, launchAppReq.getRegion(), launchAppReq.getCountry(), launchAppReq.getCity());
		return response;
	}

	@RequestMapping(value = "/launch/eureka", method = RequestMethod.POST)
	public @ResponseBody List<String> launchEureka(@RequestBody List<Region> regions) {		
		List<String> response = eurekaService.launchEurekaServers(regions);
		return response;
	}

	@RequestMapping(value = "/launch/loadbalancer", method = RequestMethod.POST)
	public @ResponseBody List<String> launchLoadBalancer(@RequestBody LaunchLoadBalacerReq loadBalancerReq) {		
		List<String> response = loadBalancerService.launchLoadBalancers(loadBalancerReq.getServiceName(), loadBalancerReq.getRegions());
		return response;
	}

}
