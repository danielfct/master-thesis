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

package pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRulesService;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CloudHostsService {

  private final CloudHostRepository cloudHosts;
  private final HostRulesService hostRulesService;

  public CloudHostsService(CloudHostRepository cloudHosts, @Lazy HostRulesService hostRulesService) {
    this.cloudHosts = cloudHosts;
    this.hostRulesService = hostRulesService;
  }

  public Iterable<CloudHostEntity> getCloudHosts() {
    return cloudHosts.findAll();
  }

  public CloudHostEntity getCloudHost(String instanceId) {
    return cloudHosts.findByInstanceId(instanceId).orElseThrow(() ->
        new EntityNotFoundException(CloudHostEntity.class, "instanceId", instanceId));
  }

  public CloudHostEntity addCloudHost(CloudHostEntity cloudHost) {
    log.debug("Saving cloudHost {}", ToStringBuilder.reflectionToString(cloudHost));
    return cloudHosts.save(cloudHost);
  }

  public CloudHostEntity updateCloudHost(String instanceId, CloudHostEntity newCloudHost) {
    CloudHostEntity cloudHost = getCloudHost(instanceId);
    ObjectUtils.copyValidProperties(newCloudHost, cloudHost);
    return cloudHosts.save(cloudHost);
  }

  public void deleteCloudHost(String instanceId) {
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
