package andre.replicationmigration.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import andre.replicationmigration.entities.HostFieldAvg;
import andre.replicationmigration.entities.ServiceConfigOrder;
import andre.replicationmigration.entities.ServiceFieldAvg;
import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.model.EdgeHost;
import andre.replicationmigration.model.MonitoringHostLog;
import andre.replicationmigration.model.MonitoringServiceLog;
import andre.replicationmigration.model.Region;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.model.ServiceEventPrediction;
import andre.replicationmigration.model.metrics.ContainerSimulatedMetrics;
import andre.replicationmigration.model.metrics.DefaultHostSimulatedMetrics;
import andre.replicationmigration.model.metrics.ServiceSimulatedMetrics;
import andre.replicationmigration.model.metrics.SpecificHostSimulatedMetrics;
import andre.replicationmigration.model.rules.AppRule;
import andre.replicationmigration.model.rules.ComponentDecisionServiceLog;
import andre.replicationmigration.model.rules.ComponentType;
import andre.replicationmigration.model.rules.Condition;
import andre.replicationmigration.model.rules.Decision;
import andre.replicationmigration.model.rules.Field;
import andre.replicationmigration.model.rules.GenericHostRule;
import andre.replicationmigration.model.rules.HostRule;
import andre.replicationmigration.model.rules.Operator;
import andre.replicationmigration.model.rules.Rule;
import andre.replicationmigration.model.rules.ServiceEventLog;
import andre.replicationmigration.model.rules.ServiceRule;
import andre.replicationmigration.model.rules.ValueMode;
import andre.replicationmigration.model.testslogs.MonitoringServiceLogTests;
import andre.replicationmigration.reqres.AppRuleReq;
import andre.replicationmigration.reqres.ConditionReq;
import andre.replicationmigration.reqres.HostRuleReq;
import andre.replicationmigration.reqres.RuleReq;
import andre.replicationmigration.reqres.SaveAppReq;
import andre.replicationmigration.reqres.SaveServiceConfigReq;
import andre.replicationmigration.reqres.SaveServiceEventPredictionReq;
import andre.replicationmigration.reqres.SearchDockerRepo;
import andre.replicationmigration.reqres.ServiceRuleReq;
import andre.replicationmigration.services.AppPackageService;
import andre.replicationmigration.services.EdgeHostService;
import andre.replicationmigration.services.MonitoringDataService;
import andre.replicationmigration.services.RegionService;
import andre.replicationmigration.services.ServicesConfigsService;
import andre.replicationmigration.services.metrics.SimulatedMetricsDataService;
import andre.replicationmigration.services.rules.RuleDataService;
import andre.replicationmigration.services.testslogs.TestsLogsService;

@Controller
@RequestMapping(value = "/api")
public class ApiDataController {

	@Autowired
	private AppPackageService appPackageService;

	@Autowired
	private ServicesConfigsService servicesConfigsService;

	@Autowired
	private EdgeHostService edgeHostsServices;

	@Autowired
	private RuleDataService ruleDataService;

	@Autowired
	private MonitoringDataService monitoringDataService;

	@Autowired
	private SimulatedMetricsDataService simulatedMetricsDataService;

	@Autowired
	private RegionService regionService;

	@Autowired
	private TestsLogsService testsLogsService;

	@RequestMapping(value = "/services")
	public @ResponseBody Iterable<ServiceConfig> getServices() {
		return servicesConfigsService.getServicesConfigs();
	}

	@RequestMapping(value = "/services/{serviceId}")
	public @ResponseBody ServiceConfig getServiceById(@PathVariable long serviceId) {
		return servicesConfigsService.getServicesConfigsById(serviceId);
	}

	@RequestMapping(value = "/services/{serviceId}", method = RequestMethod.POST)
	public @ResponseBody long saveServiceById(@PathVariable long serviceId,
			@RequestBody SaveServiceConfigReq saveServiceConfigReq) {
		return servicesConfigsService.saveServiceConfig(serviceId, saveServiceConfigReq);
	}

	@RequestMapping(value = "/services/{serviceId}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteServiceById(@PathVariable long serviceId) {
		return servicesConfigsService.deleteServiceConfig(serviceId);
	}

	@RequestMapping(value = "/services/search/dockerRepo", method = RequestMethod.POST)
	public @ResponseBody List<ServiceConfig> getServiceByDockerRepo(@RequestBody SearchDockerRepo searchDockerRepo) {
		return servicesConfigsService.getServicesByDockerRepo(searchDockerRepo.getDockerRepo());
	}

	@RequestMapping(value = "/services/search/name/{serviceName}")
	public @ResponseBody ServiceConfig getServiceByDockerRepo(@PathVariable String serviceName) {
		return servicesConfigsService.getServiceLaunchConfig(serviceName);
	}

	@RequestMapping(value = "/services/{serviceId}/dependencies")
	public @ResponseBody List<ServiceConfig> getServicesDependencies(@PathVariable long serviceId) {
		return servicesConfigsService.getServiceDependenciesByServiceId(serviceId);
	}

	@RequestMapping(value = "/apps")
	public @ResponseBody Iterable<AppPackage> getApps() {
		return appPackageService.getApps();
	}

	@RequestMapping(value = "/apps/{appId}")
	public @ResponseBody AppPackage saveApp(@PathVariable long appId) {
		return appPackageService.getAppById(appId);
	}

	@RequestMapping(value = "/apps/{appId}", method = RequestMethod.POST)
	public @ResponseBody long saveApp(@PathVariable long appId, @RequestBody SaveAppReq saveAppReq) {
		return appPackageService.saveApp(appId, saveAppReq);
	}

	@RequestMapping(value = "/apps/{appId}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteApp(@PathVariable long appId) {
		return appPackageService.deleteApp(appId);
	}

	@RequestMapping(value = "/apps/{appId}/services")
	public @ResponseBody List<ServiceConfigOrder> getServicesByAppId(@PathVariable long appId) {
		return appPackageService.getServiceConfigByAppId(appId);
	}

	@RequestMapping(value = "/edgehosts")
	public @ResponseBody Iterable<EdgeHost> getEdgeHosts() {
		return edgeHostsServices.getEdgeHost();
	}

	@RequestMapping(value = "/edgehosts/{edgeHostId}", method = RequestMethod.POST)
	public @ResponseBody long saveEdgeHost(@PathVariable long edgeHostId, @RequestBody EdgeHost edgeHost) {
		return edgeHostsServices.saveEdgeHost(edgeHostId, edgeHost);
	}

	@RequestMapping(value = "/edgehosts/{edgeHostId}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteEdgeHost(@PathVariable long edgeHostId) {
		return edgeHostsServices.deleteEdgeHost(edgeHostId);
	}

	@RequestMapping(value = "/fields")
	public @ResponseBody Iterable<Field> getFields() {
		return ruleDataService.getFields();
	}

	@RequestMapping(value = "/valuemodes")
	public @ResponseBody Iterable<ValueMode> getValueModes() {
		return ruleDataService.getValueModes();
	}

	@RequestMapping(value = "/operators")
	public @ResponseBody Iterable<Operator> getOperators() {
		return ruleDataService.getOperators();
	}

	@RequestMapping(value = "/componentTypes")
	public @ResponseBody Iterable<ComponentType> getRuleTyIterable() {
		return ruleDataService.getComponentTypes();
	}

	@RequestMapping(value = "/decisions")
	public @ResponseBody Iterable<Decision> getDecisions() {
		return ruleDataService.getDecisions();
	}

	@RequestMapping(value = "/decisions/host")
	public @ResponseBody List<Decision> getHostDecisions() {
		return ruleDataService.getHostDecisions();
	}

	@RequestMapping(value = "/decisions/container")
	public @ResponseBody List<Decision> getContainerDecisions() {
		return ruleDataService.getContainerDecisions();
	}

	@RequestMapping(value = "/rules")
	public @ResponseBody Iterable<Rule> getRules() {
		return ruleDataService.getRules();
	}

	@RequestMapping(value = "/rules/host")
	public @ResponseBody List<Rule> getHostRules() {
		return ruleDataService.getHostRules();
	}

	@RequestMapping(value = "/rules/container")
	public @ResponseBody List<Rule> getContainerRules() {
		return ruleDataService.getContainerRules();
	}

	@RequestMapping(value = "/rules/{ruleId}")
	public @ResponseBody Rule getRuleById(@PathVariable long ruleId) {
		return ruleDataService.getRuleById(ruleId);
	}

	@RequestMapping(value = "/rules/{ruleId}/conditions")
	public @ResponseBody List<Condition> getConditionsByRuleById(@PathVariable long ruleId) {
		return ruleDataService.getConditionsByRuleId(ruleId);
	}

	@RequestMapping(value = "/rules/{ruleId}", method = RequestMethod.POST)
	public @ResponseBody long saveRule(@PathVariable long ruleId, @RequestBody RuleReq ruleReq) {
		return ruleDataService.saveRule(ruleId, ruleReq);
	}

	@RequestMapping(value = "/rules/{ruleId}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteRule(@PathVariable long ruleId) {
		ruleDataService.deleteRule(ruleId);
		return ruleId;
	}

	@RequestMapping(value = "/rules/{ruleId}/conditions/{conditionId}", method = RequestMethod.POST)
	public @ResponseBody long addConditionToRule(@PathVariable long ruleId, @PathVariable long conditionId) {
		return ruleDataService.addConditionToRule(ruleId, conditionId);
	}

	@RequestMapping(value = "/rules/{ruleId}/conditions/{conditionId}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteConditionFromRule(@PathVariable long ruleId, @PathVariable long conditionId) {
		return ruleDataService.deleteConditionFromRule(ruleId, conditionId);
	}

	@RequestMapping(value = "/conditions")
	public @ResponseBody Iterable<Condition> getConditions() {
		return ruleDataService.getConditions();
	}

	@RequestMapping(value = "/conditions/{conditionId}")
	public @ResponseBody Condition getConditionById(@PathVariable long conditionId) {
		return ruleDataService.getConditionById(conditionId);
	}

	@RequestMapping(value = "/conditions/{conditionId}", method = RequestMethod.POST)
	public @ResponseBody long saveCondition(@PathVariable long conditionId, @RequestBody ConditionReq conditionReq) {
		return ruleDataService.saveCondition(conditionId, conditionReq);
	}

	@RequestMapping(value = "/conditions/{conditionId}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteCondition(@PathVariable long conditionId) {
		ruleDataService.deleteCondition(conditionId);
		return conditionId;
	}

	@RequestMapping(value = "/apps/{appId}/rules")
	public @ResponseBody List<AppRule> getAppRulesByAppId(@PathVariable long appId) {
		return ruleDataService.getAppRulesByAppId(appId);
	}

	@RequestMapping(value = "/apps/{appId}/rules", method = RequestMethod.POST)
	public @ResponseBody long saveAppRule(@PathVariable long appId, @RequestBody AppRuleReq appRule) {
		return ruleDataService.saveAppRule(appId, appRule.getRuleId());
	}

	@RequestMapping(value = "/apps/{appId}/rules", method = RequestMethod.DELETE)
	public @ResponseBody boolean deleteAppRule(@PathVariable long appId, @RequestBody AppRuleReq appRule) {
		return ruleDataService.deleteAppRule(appId, appRule.getRuleId());
	}

	@RequestMapping(value = "/services/{serviceId}/rules")
	public @ResponseBody List<ServiceRule> getAppRulesByServiceId(@PathVariable long serviceId) {
		return ruleDataService.getServiceRulesByServiceId(serviceId);
	}

	@RequestMapping(value = "/services/{serviceId}/rules", method = RequestMethod.POST)
	public @ResponseBody long saveServiceRule(@PathVariable long serviceId, @RequestBody ServiceRuleReq serviceRule) {
		return ruleDataService.saveServiceRule(serviceId, serviceRule.getRuleId());
	}

	@RequestMapping(value = "/services/{serviceId}/rules", method = RequestMethod.DELETE)
	public @ResponseBody boolean deleteServiceRule(@PathVariable long serviceId, @RequestBody ServiceRuleReq serviceRule) {
		return ruleDataService.deleteServiceRule(serviceId, serviceRule.getRuleId());
	}

	@RequestMapping(value = "/hosts/{hostname}/rules")
	public @ResponseBody List<HostRule> getHostRulesByHostname(@PathVariable String hostname) {
		return ruleDataService.getHostRulesByHostname(hostname);
	}

	@RequestMapping(value = "/hosts/{hostname}/rules", method = RequestMethod.POST)
	public @ResponseBody long saveHostRule(@PathVariable String hostname, @RequestBody HostRuleReq hostRule) {
		return ruleDataService.saveHostRule(hostname, hostRule.getRuleId());
	}

	@RequestMapping(value = "/hosts/{hostname}/rules", method = RequestMethod.DELETE)
	public @ResponseBody boolean deleteHostRule(@PathVariable String hostname, @RequestBody HostRuleReq hostRule) {
		return ruleDataService.deleteHostRule(hostname, hostRule.getRuleId());
	}

	@RequestMapping(value = "/hosts/genericrules")
	public @ResponseBody Iterable<GenericHostRule> getGenericHostRules() {
		return ruleDataService.getGenericHostRules();
	}

	@RequestMapping(value = "/hosts/genericrules/{ruleId}", method = RequestMethod.POST)
	public @ResponseBody long saveGenericHostRule(@PathVariable long ruleId) {
		return ruleDataService.saveGenericHostRule(ruleId);
	}

	@RequestMapping(value = "/hosts/genericrules/{ruleId}", method = RequestMethod.DELETE)
	public @ResponseBody boolean deleteGenericHostRule(@PathVariable long ruleId) {
		return ruleDataService.deleteGenericHostRule(ruleId);
	}

	@RequestMapping(value = "/monitoring/logs/services")
	public @ResponseBody Iterable<MonitoringServiceLog> getMonitoringServiceLogs() {
		return monitoringDataService.getMonitoringServiceLogs();
	}

	@RequestMapping(value = "/monitoring/logs/services/{serviceName}/avg")
	public @ResponseBody List<ServiceFieldAvg> getMonitoringServiceLogsByService(@PathVariable String serviceName) {
		return monitoringDataService.getAvgServiceFields(serviceName);
	}

	@RequestMapping(value = "/monitoring/logs/services/{serviceName}/fields/{field}/avg")
	public @ResponseBody ServiceFieldAvg getMonitoringServiceLogsByServiceAndField(@PathVariable String serviceName,
			@PathVariable String field) {
		return monitoringDataService.getAvgServiceField(serviceName, field);
	}

	@RequestMapping(value = "/monitoring/logs/hosts")
	public @ResponseBody Iterable<MonitoringHostLog> getMonitoringHostLogs() {
		return monitoringDataService.getMonitoringHostLogs();
	}

	@RequestMapping(value = "/monitoring/logs/hosts/{hostname}/avg")
	public @ResponseBody List<HostFieldAvg> getMonitoringHostLogsByHost(@PathVariable String hostname) {
		return monitoringDataService.getAvgHostFields(hostname);
	}

	@RequestMapping(value = "/monitoring/logs/hosts/{hostname}/fields/{field}/avg")
	public @ResponseBody HostFieldAvg getMonitoringHostLogsByHostAndField(@PathVariable String hostname,
			@PathVariable String field) {
		return monitoringDataService.getAvgHostField(hostname, field);
	}

	@RequestMapping(value = "/serviceeventpredictions")
	public @ResponseBody Iterable<ServiceEventPrediction> getServiceEventPredicitons() {
		return servicesConfigsService.getServiceEventPredictions();
	}

	@RequestMapping(value = "/serviceeventpredictions/{id}")
	public @ResponseBody ServiceEventPrediction getServiceEventPredicitonById(@PathVariable long id) {
		return servicesConfigsService.getServiceEventPredictionById(id);
	}

	@RequestMapping(value = "/serviceeventpredictions/{id}", method = RequestMethod.POST)
	public @ResponseBody long saveServiceEventPrediciton(@PathVariable long id,
			@RequestBody SaveServiceEventPredictionReq serviceEventPredictionReq) {
		return servicesConfigsService.saveServiceEventPrediction(id, serviceEventPredictionReq);
	}

	@RequestMapping(value = "/serviceeventpredictions/{id}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteServiceEventPrediciton(@PathVariable long id) {
		return servicesConfigsService.deleteServiceEventPrediction(id);
	}

	@RequestMapping(value = "/simulatedmetrics/services")
	public @ResponseBody Iterable<ServiceSimulatedMetrics> getServiceSimulatedMetrics() {
		return simulatedMetricsDataService.getAllServiceSimulatedMetrics();
	}

	@RequestMapping(value = "/simulatedmetrics/services/{id}")
	public @ResponseBody ServiceSimulatedMetrics getServiceSimulatedMetricsById(@PathVariable long id) {
		return simulatedMetricsDataService.getServiceSimulatedMetricsById(id);
	}

	@RequestMapping(value = "/simulatedmetrics/services/{id}", method = RequestMethod.POST)
	public @ResponseBody long saveServiceSimulatedMetrics(@PathVariable long id,
			@RequestBody ServiceSimulatedMetrics serviceSimulatedMetrics) {
		return simulatedMetricsDataService.saveServiceSimulatedMetrics(id, serviceSimulatedMetrics);
	}

	@RequestMapping(value = "/simulatedmetrics/services/{id}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteServiceSimulatedMetrics(@PathVariable long id) {
		return simulatedMetricsDataService.deleteServiceSimulatedMetrics(id);
	}

	@RequestMapping(value = "/simulatedmetrics/containers")
	public @ResponseBody Iterable<ContainerSimulatedMetrics> getContainerSimulatedMetrics() {
		return simulatedMetricsDataService.getAllContainerSimulatedMetrics();
	}

	@RequestMapping(value = "/simulatedmetrics/containers/{id}")
	public @ResponseBody ContainerSimulatedMetrics getContainerSimulatedMetricsById(@PathVariable long id) {
		return simulatedMetricsDataService.getContainerSimulatedMetricsById(id);
	}

	@RequestMapping(value = "/simulatedmetrics/containers/{id}", method = RequestMethod.POST)
	public @ResponseBody long saveContainerSimulatedMetrics(@PathVariable long id,
			@RequestBody ContainerSimulatedMetrics containerSimulatedMetrics) {
		return simulatedMetricsDataService.saveContainerSimulatedMetrics(id, containerSimulatedMetrics);
	}

	@RequestMapping(value = "/simulatedmetrics/containers/{id}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteContainerSimulatedMetrics(@PathVariable long id) {
		return simulatedMetricsDataService.deleteContainerSimulatedMetrics(id);
	}

	@RequestMapping(value = "/simulatedmetrics/defaulthosts")
	public @ResponseBody Iterable<DefaultHostSimulatedMetrics> getDefaultHostSimulatedMetrics() {
		return simulatedMetricsDataService.getAllDefaultHostSimulatedMetrics();
	}

	@RequestMapping(value = "/simulatedmetrics/defaulthosts/{id}")
	public @ResponseBody DefaultHostSimulatedMetrics getDefaultHostSimulatedMetricsById(@PathVariable long id) {
		return simulatedMetricsDataService.getDefaultHostSimulatedMetricsById(id);
	}

	@RequestMapping(value = "/simulatedmetrics/defaulthosts/{id}", method = RequestMethod.POST)
	public @ResponseBody long saveDefaultHostSimulatedMetrics(@PathVariable long id,
			@RequestBody DefaultHostSimulatedMetrics defaultHostSimulatedMetrics) {
		return simulatedMetricsDataService.saveDefaultHostSimulatedMetrics(id, defaultHostSimulatedMetrics);
	}

	@RequestMapping(value = "/simulatedmetrics/defaulthosts/{id}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteDefaultHostSimulatedMetrics(@PathVariable long id) {
		return simulatedMetricsDataService.deleteDefaultHostSimulatedMetrics(id);
	}

	@RequestMapping(value = "/simulatedmetrics/specifichosts")
	public @ResponseBody Iterable<SpecificHostSimulatedMetrics> getSpecificHostSimulatedMetrics() {
		return simulatedMetricsDataService.getAllSpecificHostSimulatedMetrics();
	}

	@RequestMapping(value = "/simulatedmetrics/specifichosts/{id}")
	public @ResponseBody SpecificHostSimulatedMetrics getSpecificHostSimulatedMetricsById(@PathVariable long id) {
		return simulatedMetricsDataService.getSpecificHostSimulatedMetricsById(id);
	}

	@RequestMapping(value = "/simulatedmetrics/specifichosts/{id}", method = RequestMethod.POST)
	public @ResponseBody long saveSpecificHostSimulatedMetrics(@PathVariable long id,
			@RequestBody SpecificHostSimulatedMetrics specificHostSimulatedMetrics) {
		return simulatedMetricsDataService.saveSpecificHostSimulatedMetrics(id, specificHostSimulatedMetrics);
	}

	@RequestMapping(value = "/simulatedmetrics/specifichosts/{id}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteSpecificHostSimulatedMetrics(@PathVariable long id) {
		return simulatedMetricsDataService.deleteSpecificHostSimulatedMetrics(id);
	}

	@RequestMapping(value = "/regions")
	public @ResponseBody Iterable<Region> getRegions() {
		return regionService.getRegions();
	}

	@RequestMapping(value = "/regions/{id}")
	public @ResponseBody Region getRegionsById(@PathVariable long id) {
		return regionService.getRegionById(id);
	}

	@RequestMapping(value = "/regions/{id}", method = RequestMethod.POST)
	public @ResponseBody long saveRegion(@PathVariable long id, @RequestBody Region region) {
		return regionService.saveRegion(id, region);
	}

	@RequestMapping(value = "/regions/{id}", method = RequestMethod.DELETE)
	public @ResponseBody long deleteRegion(@PathVariable long id) {
		return regionService.deleteRegion(id);
	}

	@RequestMapping(value = "/serviceeventlogs/services/{serviceName}")
	public @ResponseBody List<ServiceEventLog> getServiceEventLogsByServiceName(@PathVariable String serviceName) {
		return ruleDataService.getServiceEventLogsByServiceName(serviceName);
	}

	@RequestMapping(value = "/serviceeventlogs/containers/{containerId}")
	public @ResponseBody List<ServiceEventLog> getServiceEventLogsByContainerId(@PathVariable String containerId) {
		return ruleDataService.getServiceEventLogsByContainerId(containerId);
	}

	@RequestMapping(value = "/testslogs/monitoringservices")
	public @ResponseBody Iterable<MonitoringServiceLogTests> getMonitoringServiceLogTests() {
		return testsLogsService.getMonitoringServiceLogTests();
	}

	@RequestMapping(value = "/testslogs/monitoringservices/services/{serviceName}")
	public @ResponseBody List<MonitoringServiceLogTests> getMonitoringServiceLogTestsByServiceName(@PathVariable String serviceName) {
		return testsLogsService.getMonitoringServiceLogTestsByServiceName(serviceName);
	}

	@RequestMapping(value = "/testslogs/monitoringservices/containers/{containerId}")
	public @ResponseBody List<MonitoringServiceLogTests> getMonitoringServiceLogTestsByContainerId(@PathVariable String containerId) {
		return testsLogsService.getMonitoringServiceLogTestsByContainerId(containerId);
	}

	@RequestMapping(value = "/decisionlog/services/{serviceName}")
	public @ResponseBody List<ComponentDecisionServiceLog> getComponentDecisionServiceLogByServiceName(@PathVariable String serviceName) {
		return ruleDataService.getComponentDecisionServiceLogByServiceName(serviceName);
	}

	@RequestMapping(value = "/decisionlog/containers/{containerId}")
	public @ResponseBody List<ComponentDecisionServiceLog> getComponentDecisionServiceLogByContainerId(@PathVariable String containerId) {
		return ruleDataService.getComponentDecisionServiceLogByContainerId(containerId);
	}

}
