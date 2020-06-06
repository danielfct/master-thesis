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
 * furnished to do so, subject to the following cloudHosts:
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

package pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.containers.ContainerEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.containers.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsInstanceState;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsSimpleInstance;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metrics.simulated.hosts.SimulatedHostMetricEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metrics.simulated.hosts.SimulatedHostMetricsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRulesService;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.InstanceState;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CloudHostsService {

  private final AwsService awsService;
  private final HostRulesService hostRulesService;
  private final SimulatedHostMetricsService simulatedHostMetricsService;

  private final CloudHostRepository cloudHosts;

  public CloudHostsService(@Lazy AwsService awsService,
                           @Lazy HostRulesService hostRulesService,
                           @Lazy SimulatedHostMetricsService simulatedHostMetricsService,
                           CloudHostRepository cloudHosts) {
    this.awsService = awsService;
    this.hostRulesService = hostRulesService;
    this.simulatedHostMetricsService = simulatedHostMetricsService;
    this.cloudHosts = cloudHosts;
  }

  public List<CloudHostEntity> getCloudHosts() {
    return cloudHosts.findAll();
  }

  public CloudHostEntity getCloudHost(String instanceId) {
    return cloudHosts.findByInstanceId(instanceId).orElseThrow(() ->
        new EntityNotFoundException(CloudHostEntity.class, "instanceId", instanceId));
  }

  public CloudHostEntity getCloudHostByHostname(String hostname) {
    return cloudHosts.findByPublicIpAddress(hostname).orElseThrow(() ->
        new EntityNotFoundException(CloudHostEntity.class, "hostname", hostname));
  }

  private CloudHostEntity saveCloudHost(CloudHostEntity cloudHost) {
    log.debug("Saving cloudHost {}", ToStringBuilder.reflectionToString(cloudHost));
    return cloudHosts.save(cloudHost);
  }

  private CloudHostEntity saveCloudHostFromInstance(Long id, Instance instance) {
    CloudHostEntity cloudHost = CloudHostEntity.builder()
        .id(id)
        .instanceId(instance.getInstanceId())
        .instanceType(instance.getInstanceType())
        .state(instance.getState())
        .imageId(instance.getImageId())
        .publicDnsName(instance.getPublicDnsName())
        .publicIpAddress(instance.getPublicIpAddress())
        .placement(instance.getPlacement())
        .build();
    return saveCloudHost(cloudHost);
  }

  private CloudHostEntity saveCloudHostFromInstance(Instance instance) {
    return saveCloudHostFromInstance(0L, instance);
  }

  private CloudHostEntity addCloudHostFromSimpleInstance(AwsSimpleInstance simpleInstance) {
    CloudHostEntity cloudHost = CloudHostEntity.builder()
        .instanceId(simpleInstance.getInstanceId())
        .instanceType(simpleInstance.getInstanceType())
        .state(simpleInstance.getState())
        .imageId(simpleInstance.getImageId())
        .publicDnsName(simpleInstance.getPublicDnsName())
        .publicIpAddress(simpleInstance.getPublicIpAddress())
        .placement(simpleInstance.getPlacement())
        .build();
    return saveCloudHost(cloudHost);
  }

  public CloudHostEntity startCloudHost() {
    Instance instance = awsService.createInstance();
    return saveCloudHostFromInstance(instance);
  }

  public CloudHostEntity startCloudHost(CloudHostEntity cloudHost) {
    return startCloudHost(cloudHost.getInstanceId());
  }

  public CloudHostEntity startCloudHost(String instanceId) {
    CloudHostEntity cloudHost = getCloudHost(instanceId);
    InstanceState state = new InstanceState()
        .withCode(AwsInstanceState.PENDING.getCode())
        .withName(AwsInstanceState.PENDING.getName());
    cloudHost.setState(state);
    cloudHost = cloudHosts.save(cloudHost);
    Instance instance = awsService.startInstance(instanceId);
    return saveCloudHostFromInstance(cloudHost.getId(), instance);
  }

  public CloudHostEntity stopCloudHost(String instanceId) {
    CloudHostEntity cloudHost = getCloudHost(instanceId);
    InstanceState state = new InstanceState()
        .withCode(AwsInstanceState.STOPPING.getCode())
        .withName(AwsInstanceState.STOPPING.getName());
    cloudHost.setState(state);
    cloudHost = cloudHosts.save(cloudHost);
    Instance instance = awsService.stopInstance(instanceId);
    return saveCloudHostFromInstance(cloudHost.getId(), instance);
  }

  public void terminateCloudHost(String instanceId) {
    CloudHostEntity cloudHost = getCloudHost(instanceId);
    InstanceState state = new InstanceState()
        .withCode(AwsInstanceState.SHUTTING_DOWN.getCode())
        .withName(AwsInstanceState.SHUTTING_DOWN.getName());
    cloudHost.setState(state);
    cloudHost = cloudHosts.save(cloudHost);
    awsService.terminateInstance(instanceId);
    cloudHosts.delete(cloudHost);
  }

  public List<CloudHostEntity> reloadCloudInstances() {
    List<CloudHostEntity> cloudHosts = getCloudHosts();
    List<AwsSimpleInstance> awsInstances = awsService.getSimpleInstances();
    List<String> awsInstancesIds = awsInstances
        .stream().map(AwsSimpleInstance::getInstanceId).collect(Collectors.toList());
    Iterator<CloudHostEntity> cloudHostsIterator = cloudHosts.iterator();
    // Remove invalid cloud host entities
    while (cloudHostsIterator.hasNext()) {
      CloudHostEntity cloudHost = cloudHostsIterator.next();
      String instanceId = cloudHost.getInstanceId();
      if (!awsInstancesIds.contains(instanceId)) {
        this.cloudHosts.delete(cloudHost);
        cloudHostsIterator.remove();
      }
    }
    // Add missing cloud host entities
    awsInstances.forEach(instance -> {
      String instanceId = instance.getInstanceId();
      if (instance.getState().getCode() != AwsInstanceState.TERMINATED.getCode() && !hasCloudHost(instanceId)) {
        CloudHostEntity cloudHost = addCloudHostFromSimpleInstance(instance);
        cloudHosts.add(cloudHost);
        log.debug("Added missing cloud host {}", instanceId);
      }
    });
    return cloudHosts;
  }

  public List<HostRuleEntity> getRules(String instanceId) {
    assertHostExists(instanceId);
    return cloudHosts.getRules(instanceId);
  }

  public HostRuleEntity getRule(String instanceId, String ruleName) {
    assertHostExists(instanceId);
    return cloudHosts.getRule(instanceId, ruleName).orElseThrow(() ->
        new EntityNotFoundException(HostRuleEntity.class, "ruleName", ruleName)
    );
  }

  public void addRule(String instanceId, String ruleName) {
    assertHostExists(instanceId);
    hostRulesService.addCloudHost(ruleName, instanceId);
  }

  public void addRules(String instanceId, List<String> ruleNames) {
    assertHostExists(instanceId);
    ruleNames.forEach(rule -> hostRulesService.addCloudHost(rule, instanceId));
  }

  public void removeRule(String instanceId, String ruleName) {
    assertHostExists(instanceId);
    hostRulesService.removeCloudHost(ruleName, instanceId);
  }

  public void removeRules(String instanceId, List<String> ruleNames) {
    assertHostExists(instanceId);
    ruleNames.forEach(rule -> hostRulesService.removeCloudHost(rule, instanceId));
  }

  public List<SimulatedHostMetricEntity> getSimulatedMetrics(String instanceId) {
    assertHostExists(instanceId);
    return cloudHosts.getSimulatedMetrics(instanceId);
  }

  public SimulatedHostMetricEntity getSimulatedMetric(String instanceId, String simulatedMetricName) {
    assertHostExists(instanceId);
    return cloudHosts.getSimulatedMetric(instanceId, simulatedMetricName).orElseThrow(() ->
        new EntityNotFoundException(SimulatedHostMetricEntity.class, "simulatedMetricName", simulatedMetricName)
    );
  }

  public void addSimulatedMetric(String instanceId, String simulatedMetricName) {
    assertHostExists(instanceId);
    simulatedHostMetricsService.addCloudHost(simulatedMetricName, instanceId);
  }

  public void addSimulatedMetrics(String instanceId, List<String> simulatedMetricNames) {
    assertHostExists(instanceId);
    simulatedMetricNames.forEach(simulatedMetric ->
        simulatedHostMetricsService.addCloudHost(simulatedMetric, instanceId));
  }

  public void removeSimulatedMetric(String instanceId, String simulatedMetricName) {
    assertHostExists(instanceId);
    simulatedHostMetricsService.addCloudHost(simulatedMetricName, instanceId);
  }

  public void removeSimulatedMetrics(String instanceId, List<String> simulatedMetricNames) {
    assertHostExists(instanceId);
    simulatedMetricNames.forEach(simulatedMetric ->
        simulatedHostMetricsService.addCloudHost(simulatedMetric, instanceId));
  }

  public boolean hasCloudHost(String instanceId) {
    return cloudHosts.hasCloudHost(instanceId);
  }

  public boolean hasCloudHostByHostname(String hostname) {
    return cloudHosts.hasCloudHostByHostname(hostname);
  }

  private void assertHostExists(String instanceId) {
    if (!hasCloudHost(instanceId)) {
      throw new EntityNotFoundException(CloudHostEntity.class, "instanceId", instanceId);
    }
  }
}
