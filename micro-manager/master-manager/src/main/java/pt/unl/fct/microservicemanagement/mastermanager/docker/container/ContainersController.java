/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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

package pt.unl.fct.microservicemanagement.mastermanager.docker.container;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pt.unl.fct.microservicemanagement.mastermanager.loadbalancer.nginx.NginxLoadBalancerService;
import pt.unl.fct.microservicemanagement.mastermanager.microservices.discovery.eureka.EurekaService;
import pt.unl.fct.microservicemanagement.mastermanager.location.Region;

@RestController
@RequestMapping("/containers")
public class ContainersController {

  private final DockerContainersService dockerContainersService;
  private final EurekaService eurekaService;
  private final NginxLoadBalancerService nginxLoadBalancerService;

  public ContainersController(DockerContainersService dockerContainersService,
                              EurekaService eurekaService,
                              NginxLoadBalancerService nginxLoadBalancerService) {
    this.dockerContainersService = dockerContainersService;
    this.eurekaService = eurekaService;
    this.nginxLoadBalancerService = nginxLoadBalancerService;
  }

  @GetMapping
  public List<SimpleContainer> getContainers() {
    return dockerContainersService.getContainers();
  }

  @PostMapping
  public String launchContainer(@RequestBody LaunchServiceReq launchServiceReq) {
    return dockerContainersService.launchContainer(launchServiceReq.getHostname(), launchServiceReq.getService(),
      launchServiceReq.getInternalPort(), launchServiceReq.getExternalPort());
  }

  @GetMapping("/{id}")
  public SimpleContainer getContainer(@PathVariable String id) {
    return dockerContainersService.getContainer(id);
  }

  @DeleteMapping("/{id}")
  public void stopContainer(@PathVariable String id,
                            @RequestBody StopServiceReq stopServiceReq) {
    final var containerId = stopServiceReq.getContainerId();
    final var hostname = stopServiceReq.getHostname();
    dockerContainersService.stopContainer(containerId, hostname);
  }

  @PostMapping("/{id}/replicate")
  public String replicateContainer(@PathVariable String id,
                                   @RequestBody ReplicateContainerReq repContainerReq) {
    //TODO fix ui
    final var containerId = repContainerReq.getContainerId();
    final var fromHostname = repContainerReq.getFromHostname();
    final var toHostname = repContainerReq.getToHostname();
    return dockerContainersService.replicateContainer(containerId, fromHostname, toHostname);
  }

  @PostMapping("/{id}/migrate")
  public String migrateContainer(@PathVariable String id,
                                 @RequestBody MigrateContainerReq migContainerReq) {
    //FIXME fix ui
    final var containerId = migContainerReq.getContainerId();
    final var fromHostname = migContainerReq.getFromHostname();
    final var toHostname = migContainerReq.getToHostname();
    final var secondsBeforeStop = migContainerReq.getSecondsBeforeStop();
    return dockerContainersService.migrateContainer(containerId, fromHostname, toHostname, secondsBeforeStop);
  }

  //FIXME add appId to launchAppReq
  @PostMapping("/app/{appId}")
  public Map<String, List<String>> launchApp(@PathVariable long appId,
                                             @RequestBody LaunchAppReq launchAppReq) {
    final var region = launchAppReq.getRegion();
    final var country = launchAppReq.getCountry();
    final var city = launchAppReq.getCity();
    return dockerContainersService.launchMicroserviceApplication(appId, region, country, city);
  }

  @PostMapping("/eureka")
  public List<String> launchEureka(@RequestBody List<Region> regions) {
    return eurekaService.launchEurekaServers(regions);
  }

  @PostMapping("/loadBalancer")
  public List<String> launchLoadBalancer(@RequestBody LaunchLoadBalacerReq loadBalancerReq) {
    final var serviceName = loadBalancerReq.getServiceName();
    final var regions = loadBalancerReq.getRegions();
    return nginxLoadBalancerService.launchLoadBalancers(serviceName, regions);
  }

}
