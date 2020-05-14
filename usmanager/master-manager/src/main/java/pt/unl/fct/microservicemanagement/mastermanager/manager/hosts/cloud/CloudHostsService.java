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
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsInstanceState;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.cloud.aws.AwsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRulesService;

import java.util.List;

import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.InstanceState;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CloudHostsService {

  private final CloudHostRepository cloudHosts;
  private final AwsService awsService;
  private final HostRulesService hostRulesService;

  public CloudHostsService(CloudHostRepository cloudHosts, @Lazy AwsService awsService,
                           @Lazy HostRulesService hostRulesService) {
    this.cloudHosts = cloudHosts;
    this.awsService = awsService;
    this.hostRulesService = hostRulesService;
  }

  public Iterable<CloudHostEntity> getCloudHosts() {
    return cloudHosts.findAll();
  }

  public CloudHostEntity getCloudHost(String instanceId) {
    return cloudHosts.findByInstanceId(instanceId).orElseThrow(() ->
        new EntityNotFoundException(CloudHostEntity.class, "instanceId", instanceId));
  }

  private CloudHostEntity saveCloudHost(CloudHostEntity cloudHost) {
    log.debug("Saving cloudHost {}", ToStringBuilder.reflectionToString(cloudHost));
    return cloudHosts.save(cloudHost);
  }

  private CloudHostEntity addCloudHostFromInstance(Instance instance) {
    InstanceState state = new InstanceState();
    state.setName(AwsInstanceState.RUNNING.getName());
    state.setCode(AwsInstanceState.RUNNING.getCode());
    CloudHostEntity cloudHost = CloudHostEntity.builder()
        .instanceId(instance.getInstanceId())
        .publicIpAddress(instance.getPublicIpAddress())
        .state(state)
        .build();
    return saveCloudHost(cloudHost);
  }

  public CloudHostEntity startCloudHost() {
    Instance instance = awsService.createInstance();
    return addCloudHostFromInstance(instance);
  }

  public CloudHostEntity startCloudHost(String instanceId) {
    Instance instance = awsService.startInstance(instanceId);
    return addCloudHostFromInstance(instance);
  }

  public void stopCloudHost(String instanceId) {
    awsService.stopInstance(instanceId);
    var cloudHost = getCloudHost(instanceId); //TODO put before stopInstance
    InstanceState state = new InstanceState();
    state.setName(AwsInstanceState.STOPPED.getName());
    state.setCode(AwsInstanceState.STOPPED.getCode());
    cloudHost = cloudHost.toBuilder().state(state).build();
    saveCloudHost(cloudHost);
  }

  public void terminateCloudHost(String instanceId) {
    awsService.terminateInstance(instanceId);
    var cloudHost = getCloudHost(instanceId);
    cloudHosts.delete(cloudHost);
  }

  public boolean hasCloudHost(String instanceId) {
    return cloudHosts.hasCloudHost(instanceId);
  }

  public List<HostRuleEntity> getRules(String instanceId) {
    assertHostExists(instanceId);
    return cloudHosts.getRules(instanceId);
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

  public void removeRules(String hostname, List<String> ruleNames) {
    assertHostExists(hostname);
    ruleNames.forEach(rule -> hostRulesService.removeCloudHost(rule, hostname));
  }

  private void assertHostExists(String instanceId) {
    if (!hasCloudHost(instanceId)) {
      throw new EntityNotFoundException(CloudHostEntity.class, "instanceId", instanceId);
    }
  }

}
