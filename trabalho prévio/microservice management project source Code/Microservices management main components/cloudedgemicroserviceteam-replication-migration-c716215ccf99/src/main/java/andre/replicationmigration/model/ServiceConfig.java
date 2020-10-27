package andre.replicationmigration.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import andre.replicationmigration.model.rules.ServiceRule;

@Entity
@Table(name = "service_config")
public class ServiceConfig {

	@Id
	@GeneratedValue
	private Long id;

	@Column(name = "service_name")
	private String serviceName;

	@Column(name = "docker_repo")
	private String dockerRepo;

	@Column(name = "default_external_port")
	private String defaultExternalPort;

	@Column(name = "default_internal_port")
	private String defaultInternalPort;

	@Column(name = "default_db")
	private String defaultDb;

	@Column(name = "launch_command")
	private String launchCommand;

	@Column(name = "min_replics")
	private int minReplics;

	@Column(name = "max_replics")
	private int maxReplics;

	@Column(name = "output_label")
	private String outputLabel;

	// VALUES: frontend, backend, database
	@Column(name = "service_type")
	private String serviceType;

	// Average memory consumption in bytes
	@Column(name = "avg_mem")
	private double avgMem;

	@JsonIgnore
	@OneToMany(mappedBy = "serviceConfig", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<AppService> appServices = new HashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "serviceConfig", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ServiceConfigDependency> dependencies = new HashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "serviceConfigDependecy", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ServiceConfigDependency> dependsOn = new HashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "serviceConfig", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ServiceEventPrediction> serviceEventPreditions = new HashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "serviceConfig", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ServiceRule> serviceRules = new HashSet<>();

	public ServiceConfig() {

	}

	public ServiceConfig(Long id, String serviceName, String dockerRepo, String defaultExternalPort,
			String defaultInternalPort, String defaultDb, String launchCommand, int minReplics, int maxReplics,
			String outputLabel, double avgMem) {
		this.id = id;
		this.serviceName = serviceName;
		this.dockerRepo = dockerRepo;
		this.defaultExternalPort = defaultExternalPort;
		this.defaultInternalPort = defaultInternalPort;
		this.defaultDb = defaultDb;
		this.launchCommand = launchCommand;
		this.minReplics = minReplics;
		this.maxReplics = maxReplics;
		this.outputLabel = outputLabel;
		this.avgMem = avgMem;
	}

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the serviceName
	 */
	public String getServiceName() {
		return serviceName;
	}

	/**
	 * @param serviceName the serviceName to set
	 */
	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	/**
	 * @return the dockerRepo
	 */
	public String getDockerRepo() {
		return dockerRepo;
	}

	/**
	 * @param dockerRepo the dockerRepo to set
	 */
	public void setDockerRepo(String dockerRepo) {
		this.dockerRepo = dockerRepo;
	}

	/**
	 * @return the defaultExternalPort
	 */
	public String getDefaultExternalPort() {
		return defaultExternalPort;
	}

	/**
	 * @param defaultExternalPort the defaultExternalPort to set
	 */
	public void setDefaultExternalPort(String defaultExternalPort) {
		this.defaultExternalPort = defaultExternalPort;
	}

	/**
	 * @return the defaultInternalPort
	 */
	public String getDefaultInternalPort() {
		return defaultInternalPort;
	}

	/**
	 * @param defaultInternalPort the defaultInternalPort to set
	 */
	public void setDefaultInternalPort(String defaultInternalPort) {
		this.defaultInternalPort = defaultInternalPort;
	}

	/**
	 * @return the defaultDb
	 */
	public String getDefaultDb() {
		return defaultDb;
	}

	/**
	 * @param defaultDb the defaultDb to set
	 */
	public void setDefaultDb(String defaultDb) {
		this.defaultDb = defaultDb;
	}

	/**
	 * @return the launchCommand
	 */
	public String getLaunchCommand() {
		return launchCommand;
	}

	/**
	 * @param launchCommand the launchCommand to set
	 */
	public void setLaunchCommand(String launchCommand) {
		this.launchCommand = launchCommand;
	}

	/**
	 * @return the minReplics
	 */
	public int getMinReplics() {
		return minReplics;
	}

	/**
	 * @param minReplics the minReplics to set
	 */
	public void setMinReplics(int minReplics) {
		this.minReplics = minReplics;
	}

	/**
	 * @return the maxReplics
	 */
	public int getMaxReplics() {
		return maxReplics;
	}

	/**
	 * @param maxReplics the maxReplics to set
	 */
	public void setMaxReplics(int maxReplics) {
		this.maxReplics = maxReplics;
	}

	/**
	 * @return the outputLabel
	 */
	public String getOutputLabel() {
		return outputLabel;
	}

	/**
	 * @param outputLabel the outputLabel to set
	 */
	public void setOutputLabel(String outputLabel) {
		this.outputLabel = outputLabel;
	}

	/**
	 * @return the serviceType
	 */
	public String getServiceType() {
		return serviceType;
	}

	/**
	 * @param serviceType the serviceType to set
	 */
	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}

	/**
	 * @return the avgMem
	 */
	public double getAvgMem() {
		return avgMem;
	}

	/**
	 * @param avgMem the avgMem to set
	 */
	public void setAvgMem(double avgMem) {
		this.avgMem = avgMem;
	}

	/**
	 * @return the appServices
	 */
	public Set<AppService> getAppServices() {
		return appServices;
	}

	/**
	 * @param appServices the appServices to set
	 */
	public void setAppServices(Set<AppService> appServices) {
		this.appServices = appServices;
	}

	/**
	 * @return the dependencies
	 */
	public Set<ServiceConfigDependency> getDependencies() {
		return dependencies;
	}

	/**
	 * @param dependencies the dependencies to set
	 */
	public void setDependencies(Set<ServiceConfigDependency> dependencies) {
		this.dependencies = dependencies;
	}

	/**
	 * @return the dependsOn
	 */
	public Set<ServiceConfigDependency> getDependsOn() {
		return dependsOn;
	}

	/**
	 * @param dependsOn the dependsOn to set
	 */
	public void setDependsOn(Set<ServiceConfigDependency> dependsOn) {
		this.dependsOn = dependsOn;
	}

	/**
	 * @return the serviceEventPreditions
	 */
	public Set<ServiceEventPrediction> getServiceEventPreditions() {
		return serviceEventPreditions;
	}

	/**
	 * @param serviceEventPreditions the serviceEventPreditions to set
	 */
	public void setServiceEventPreditions(Set<ServiceEventPrediction> serviceEventPreditions) {
		this.serviceEventPreditions = serviceEventPreditions;
	}

	/**
	 * @return the serviceRules
	 */
	public Set<ServiceRule> getServiceRules() {
		return serviceRules;
	}

	/**
	 * @param serviceRules the serviceRules to set
	 */
	public void setServiceRules(Set<ServiceRule> serviceRules) {
		this.serviceRules = serviceRules;
    }

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ServiceConfig [id=" + id + ", serviceName=" + serviceName + ", dockerRepo=" + dockerRepo
				+ ", defaultExternalPort=" + defaultExternalPort + ", defaultInternalPort=" + defaultInternalPort
				+ ", defaultDb=" + defaultDb + ", launchCommand=" + launchCommand + ", outputLabel=" + outputLabel
				+ ", serviceType=" + serviceType + ", appServices=" + appServices + ", dependencies=" + dependencies
				+ "]";
	}

}
