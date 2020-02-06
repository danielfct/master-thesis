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

package pt.unl.fct.microservicemanagement.mastermanager.manager.host;

import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.SimpleContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud.aws.AwsLaunchServiceReq;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud.aws.AwsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud.aws.AwsSimpleInstance;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.edge.EdgeHostEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.edge.EdgeHostsService;

import java.util.List;
import java.util.Map;

import com.amazonaws.services.ec2.model.Instance;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hosts")
public class HostsController {

  private final EdgeHostsService edgeHostsService;
  private final AwsService aws;
  private final DockerContainersService dockerContainersService;

  public HostsController(EdgeHostsService edgeHostsService, AwsService aws,
                         DockerContainersService dockerContainersService) {
    this.edgeHostsService = edgeHostsService;
    this.aws = aws;
    this.dockerContainersService = dockerContainersService;
  }

  @GetMapping("/edge")
  public Iterable<EdgeHostEntity> getEdgeHosts() {
    return edgeHostsService.getEdgeHosts();
  }

  /*@PostMapping("/edge")
    public long addEdgeHost(@RequestBody EdgeHost edgeHost) {
        Validation.validatePostRequest(edgeHost.getId());
        return edgeHostsService.addEdgeHost(edgeHost);
    }

    @PutMapping("/edge/{id}")
    public long updateEdgeHost(@PathVariable long id,
                                             @RequestBody EdgeHost edgeHost) {
        Validation.validatePutRequest(id, edgeHost.getId());
        return edgeHostsService.updateEdgeHost(id, edgeHost);
    }*/

  @PostMapping("/edge/{id}")
  public long saveEdgeHost(@PathVariable long id, @RequestBody EdgeHostEntity edgeHost) {
    return edgeHostsService.saveEdgeHost(id, edgeHost);
  }

  @DeleteMapping("/edge/{id}")
  public void deleteEdgeHost(@PathVariable long id) {
    edgeHostsService.deleteEdgeHost(id);
  }

  @GetMapping("/cloud")
  public List<AwsSimpleInstance> getEC2Instances() {
    return aws.getSimpleInstances();
  }

  @PostMapping("/cloud")
  public String createEC2Instance() {
    return aws.createEC2();
  }

  @GetMapping("/cloud/{id}")
  public Instance getEC2Instance(@PathVariable String id) {
    return aws.getInstance(id);
  }

  @GetMapping("/cloud/{id}/simple")
  public AwsSimpleInstance getEC2SimpleInstance(@PathVariable String id) {
    return aws.getSimpleInstance(id);
  }

  @PostMapping("/cloud/service")
  public SimpleContainer launchEC2Service(@RequestBody AwsLaunchServiceReq launchServiceReq) {
    //TODO fix ui
    String instanceId = launchServiceReq.getInstanceId();
    Instance instance = aws.startInstanceById(instanceId);
    String ec2PublicIp = instance.getPublicIpAddress();
    String serviceName = launchServiceReq.getService();
    String internalPort = launchServiceReq.getInternalPort();
    String externalPort = launchServiceReq.getExternalPort();
    var dynamicLaunchParams = Map.of(
        "${eurekaHost}", launchServiceReq.getEurekaHost(),
        String.format("${%sDatabaseHost}", serviceName), launchServiceReq.getDatabase());
    return dockerContainersService.launchContainer(ec2PublicIp, serviceName, internalPort, externalPort,
        dynamicLaunchParams);
  }

}
