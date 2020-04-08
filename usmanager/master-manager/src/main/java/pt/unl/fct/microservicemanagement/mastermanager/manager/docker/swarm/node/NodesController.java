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

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.node;

import pt.unl.fct.microservicemanagement.mastermanager.manager.host.HostsService;
import pt.unl.fct.microservicemanagement.mastermanager.util.Json;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/nodes")
public class NodesController {

  private final DockerNodesService dockerNodesService;
  private final HostsService hostsService;

  public NodesController(DockerNodesService dockerNodesService, HostsService hostsService) {
    this.dockerNodesService = dockerNodesService;
    this.hostsService = hostsService;
  }

  @GetMapping
  public List<SimpleNode> getNodes() {
    return dockerNodesService.getNodes();
  }

  @GetMapping("/{id}")
  public SimpleNode getNode(@PathVariable("id") String id) {
    return dockerNodesService.getNode(id);
  }

  @PostMapping
  public void addNodes(@Json("quantity") Integer quantity, @Json("hostname") String hostname,
                       @Json("region") String region, @Json("country") String country, @Json("city") String city) {
    //TODO: return ids?
    System.out.println(quantity);
    System.out.println(hostname);
    System.out.println(region);
    System.out.println(country);
    System.out.println(city);
    if (hostname != null) {
      for (var i = 0; i < quantity; i++) {
        hostsService.addHost(hostname);
      }
    } else {
      for (var i = 0; i < quantity; i++) {
        hostsService.addHost(city, country, region);
      }
    }
  }

  @DeleteMapping("/{id}")
  public void removeNode(@PathVariable("id") String id) {
    var node = dockerNodesService.getNode(id);
    hostsService.removeHost(node.getHostname());
  }

}
