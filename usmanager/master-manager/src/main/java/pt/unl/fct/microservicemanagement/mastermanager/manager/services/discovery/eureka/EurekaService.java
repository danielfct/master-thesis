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

package pt.unl.fct.microservicemanagement.mastermanager.manager.services.discovery.eureka;

import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.SimpleContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.HostsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.location.RegionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.spotify.docker.client.DockerClient;
import org.springframework.stereotype.Service;

@Service
public class EurekaService {

  private static final String EUREKA = "eureka-server";

  private final DockerContainersService dockerContainersService;
  private final HostsService hostsService;
  private final RegionsService regionsService;
  private final ServicesService serviceService;
  private final int port;

  public EurekaService(DockerContainersService dockerContainersService, HostsService hostsService,
                       ServicesService serviceService, RegionsService regionsService,
                       EurekaProperties eurekaProperties) {
    this.dockerContainersService = dockerContainersService;
    this.hostsService = hostsService;
    this.regionsService = regionsService;
    this.serviceService = serviceService;
    this.port = eurekaProperties.getPort();
  }

  public Optional<String> getEurekaServerAddress(String region) {
    return dockerContainersService.getContainers(
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_NAME, EUREKA),
        DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_REGION, region))
        .stream()
        .map(container -> container.getLabels().get(DockerContainer.Label.SERVICE_ADDRESS))
        .findFirst();
  }

  public List<SimpleContainer> launchEurekaServers(String[] regions) {
    ServiceEntity service =
        serviceService.getService(EUREKA);
    double expectedMemoryConsumption = service.getExpectedMemoryConsumption();
    List<String> availableHostnames = Stream.of(regions)
        .map(regionsService::getRegion)
        .map(region -> hostsService.getAvailableNodeHostname(expectedMemoryConsumption, region.getName()))
        .collect(Collectors.toList());
    List<String> customEnvs = Collections.emptyList();
    Map<String, String> customLabels = Collections.emptyMap();
    String eurekaServers = availableHostnames.stream()
        .map(hostname -> String.format("http://%s:%s/eureka/", hostname, port))
        .collect(Collectors.joining(","));
    Map<String, String> dynamicLaunchParams = Map.of("${zone}", eurekaServers);
    return availableHostnames.stream()
        .map(hostname -> dockerContainersService.launchContainer(hostname, EUREKA, customEnvs,
            customLabels, dynamicLaunchParams))
        .collect(Collectors.toList());
  }

}
