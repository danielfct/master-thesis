package andre.replicationmigration.services;

import java.util.List;
import java.util.Map;

import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.reqres.GenericResponse;

public interface DockerService {

	public List<GenericResponse> launchContainer(String hostname, ServiceConfig service, Map<String, String> params);

	public List<GenericResponse> launchContainer(String hostname, String internalPort, String externalPort,
			String serviceName);

	public List<GenericResponse> launchContainer(String hostname, String internalPort, String externalPort,
			String serviceName, Map<String, String> params);

	public List<GenericResponse> stopContainer(String hostname, String containerId);

	public List<GenericResponse> replicateContainer(String fromHostname, String fromContainerId, String toHostname);

	public List<GenericResponse> migrateContainer(String fromHostname, String fromContainerId, String toHostname);

	public List<GenericResponse> migrateContainer(String fromHostname, String fromContainerId, String toHostname,
			int secondsBeforeStop);

	public void launchEmptyLoadBalancer(String hostname, String serviceName);
	
	public void launchReqLocMonitor(String hostname);
	
	public void launchEureka(String hostname, String otherEurekaServers);

	public void launchPrometheus(String hostname);

	public List<DockerSimpleContainer> getSystemContainers(String hostname);

}