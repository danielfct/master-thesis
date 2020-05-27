/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.containers.ContainerRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.containers.ContainerRulesService;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ContainersService {

  private final DockerContainersService dockerContainersService;
  private final ContainerRulesService containerRulesService;

  private final ContainerRepository containers;

  public ContainersService(@Lazy DockerContainersService dockerContainersService,
                           ContainerRulesService containerRulesService,
                           ContainerRepository containers) {
    this.dockerContainersService = dockerContainersService;
    this.containerRulesService = containerRulesService;
    this.containers = containers;
  }

  public ContainerEntity addContainerFromDockerContainer(SimpleContainer simpleContainer) {
    try {
      return getContainer(simpleContainer.getId());
    } catch (EntityNotFoundException e) {
      ContainerEntity container = ContainerEntity.builder()
          .containerId(simpleContainer.getId())
          .created(simpleContainer.getCreated())
          .image(simpleContainer.getImage())
          .command(simpleContainer.getCommand())
          .hostname(simpleContainer.getHostname())
          .ports(simpleContainer.getPorts())
          .labels(simpleContainer.getLabels())
          .build();
      return addContainer(container);
    }
  }

  public ContainerEntity addContainer(ContainerEntity container) {
    log.debug("Saving container {}", ToStringBuilder.reflectionToString(container));
    return containers.save(container);
  }

  public Iterable<ContainerEntity> getContainers() {
    return containers.findAll();
  }

  public List<ContainerEntity> getContainers(Map<String, String> labels) {
    // TODO try to build a database query instead
    Iterable<ContainerEntity> containers = getContainers();
    return StreamSupport.stream(containers.spliterator(), false)
        .filter(container -> container.getLabels().entrySet().containsAll(labels.entrySet()))
        .collect(Collectors.toList());
  }

  public ContainerEntity getContainer(String containerId) {
    return containers.findByContainerId(containerId).orElseThrow(() ->
        new EntityNotFoundException(ContainerEntity.class, "containerId", containerId));
  }

  public List<ContainerEntity> reloadContainers() {
    containers.deleteAll(); //TODO cant delete all or else all associations are lost
    List<ContainerEntity> containersList = new LinkedList<>();
    dockerContainersService.getContainers().forEach(dockerContainer -> {
      ContainerEntity container = addContainerFromDockerContainer(dockerContainer);
      containersList.add(containers.save(container));
    });
    return containersList;
  }

  public ContainerEntity launchContainer(String hostname, String serviceName) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, boolean singleton) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, singleton);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, List<String> environment) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, environment);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName,
                                         boolean singleton, List<String> environment) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, singleton, environment);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, Map<String, String> labels) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, labels);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName,
                                         boolean singleton, Map<String, String> labels) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, singleton, labels);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, List<String> environment,
                                         Map<String, String> labels) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, environment, labels);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, List<String> environment,
                                         Map<String, String> labels, Map<String, String> dynamicLaunchParams) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, environment, labels,
        dynamicLaunchParams);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName,
                                         boolean singleton, List<String> environment, Map<String, String> labels) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, singleton, environment,
        labels);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, boolean singleton,
                                         List<String> environment, Map<String, String> labels,
                                         Map<String, String> dynamicLaunchParams) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, singleton, environment,
        labels, dynamicLaunchParams);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, String internalPort,
                                         String externalPort) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, internalPort,
        externalPort);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity launchContainer(String hostname, String serviceName, boolean singleton, String internalPort,
                                         String externalPort) {
    SimpleContainer container = dockerContainersService.launchContainer(hostname, serviceName, singleton, internalPort,
        externalPort);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity replicateContainer(String id, String hostname) {
    SimpleContainer container = dockerContainersService.replicateContainer(id, hostname);
    return addContainerFromDockerContainer(container);
  }

  public ContainerEntity migrateContainer(String id, String hostname) {
    SimpleContainer container = dockerContainersService.migrateContainer(id, hostname);
    return addContainerFromDockerContainer(container);
  }

  public Map<String, List<SimpleContainer>> launchApp(String appName, String region, String country, String city) {
    return dockerContainersService.launchApp(appName, region, country, city);
  }

  public void deleteContainer(String id) {
    ContainerEntity container = getContainer(id);
    dockerContainersService.stopContainer(id);
    containers.delete(container);
  }

  public List<ContainerRuleEntity> getRules(String containerId) {
    assertContainerExists(containerId);
    return containers.getRules(containerId);
  }

  public void addRule(String containerId, String ruleName) {
    assertContainerExists(containerId);
    containerRulesService.addContainer(ruleName, containerId);
  }

  public void addRules(String containerId, List<String> ruleNames) {
    assertContainerExists(containerId);
    ruleNames.forEach(rule -> containerRulesService.addContainer(rule, containerId));
  }

  public void removeRule(String containerId, String ruleName) {
    assertContainerExists(containerId);
    containerRulesService.removeContainer(ruleName, containerId);
  }

  public void removeRules(String containerId, List<String> ruleNames) {
    assertContainerExists(containerId);
    ruleNames.forEach(rule -> containerRulesService.removeContainer(rule, containerId));
  }

  public boolean hasContainer(String containerId) {
    return containers.hasContainer(containerId);
  }

  private void assertContainerExists(String containerId) {
    if (!hasContainer(containerId)) {
      throw new EntityNotFoundException(ContainerEntity.class, "containerId", containerId);
    }
  }

}
