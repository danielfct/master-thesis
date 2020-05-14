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

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container;

import net.minidev.json.JSONArray;
import pt.unl.fct.microservicemanagement.mastermanager.manager.loadbalancer.nginx.NginxLoadBalancerService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.location.RegionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.discovery.eureka.EurekaService;
import pt.unl.fct.microservicemanagement.mastermanager.util.Json;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/containers")
public class ContainersController {

  //TODO substituir os reqs por objetos, ou @JsonValue annotation

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

  @GetMapping("/{id}")
  public SimpleContainer getContainer(@PathVariable String id) {
    return dockerContainersService.getContainer(id);
  }

  @PostMapping
  public SimpleContainer launchContainer(@Json String hostname, @Json String service,
                                         @Json String internalPort, @Json String externalPort) {
    return dockerContainersService.launchContainer(hostname, service, internalPort, externalPort);
  }

  @DeleteMapping("/{id}")
  public void stopContainer(@PathVariable String id) {
    dockerContainersService.stopContainer(id);
  }

  @PostMapping("/{id}/replicate")
  public SimpleContainer replicateContainer(@PathVariable String id, @Json String hostname) {
    return dockerContainersService.replicateContainer(id, hostname);
  }

  @PostMapping("/{id}/migrate")
  public SimpleContainer migrateContainer(@PathVariable String id, @Json String hostname) {
    return dockerContainersService.migrateContainer(id, hostname);
  }

  //FIXME add appId to launchAppReq
  @PostMapping("/app/{appId}")
  public Map<String, List<SimpleContainer>> launchApp(@PathVariable long appId,
                                                      @RequestBody LaunchAppReq launchAppReq) {
    final var region = launchAppReq.getRegion();
    final var country = launchAppReq.getCountry();
    final var city = launchAppReq.getCity();
    return dockerContainersService.launchMicroserviceApplication(appId, region, country, city);
  }

  @PostMapping("/loadBalancer")
  public List<String> launchLoadBalancer(@Json String service, @Json JSONArray regions) {
    return nginxLoadBalancerService.launchLoadBalancers(service, regions.toArray(new String[0]));
  }

  @PostMapping("/eureka")
  public List<SimpleContainer> launchEureka(@RequestBody List<RegionEntity> regions) {
    return eurekaService.launchEurekaServers(regions);
  }

}
