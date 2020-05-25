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

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.proxy;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.MasterManagerException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.CommandResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.SshService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;

import org.springframework.stereotype.Service;

@Service
public class DockerApiProxyService {

  public static final String DOCKER_API_PROXY = "docker-api-proxy";

  private final DockerContainersService dockerContainersService;
  private final ServicesService serviceService;
  private final SshService sshService;

  private final String dockerApiProxyUsername;
  private final String dockerApiProxyPassword;
  private final String dockerHubUsername;

  public DockerApiProxyService(DockerContainersService dockerContainersService, ServicesService serviceService,
                               SshService sshService,
                               DockerProperties dockerProperties) {
    this.dockerContainersService = dockerContainersService;
    this.serviceService = serviceService;
    this.sshService = sshService;
    this.dockerApiProxyUsername = dockerProperties.getApiProxy().getUsername();
    this.dockerApiProxyPassword = dockerProperties.getApiProxy().getPassword();
    this.dockerHubUsername = dockerProperties.getHub().getUsername();
  }

  public void launchDockerApiProxy(String hostname) {
    ServiceEntity dockerApiProxy = serviceService.getService(DOCKER_API_PROXY);
    String serviceName = dockerApiProxy.getServiceName();
    String serviceType = dockerApiProxy.getServiceType();
    String externalPort = dockerApiProxy.getDefaultExternalPort();
    String internalPort = dockerApiProxy.getDefaultInternalPort();
    var dockerRepository = String.format("%s/%s", dockerHubUsername, dockerApiProxy.getDockerRepository());
    var command = String.format("COUNT_API_PROXY=$(docker ps --filter 'name=%s' | grep '%s' | wc -l) && "
            + "if [ $COUNT_API_PROXY = 1 ]; then echo 'Proxy is running'; "
            + "else PRIVATE_IP=$(/sbin/ip -o -4 addr list docker0 | awk '{print $4}' | cut -d/ -f1) && "
            + "docker pull %s && "
            + "docker run -itd --name=docker-api-proxy -p %s:%s --rm "
            + "-e BASIC_AUTH_USERNAME=%s -e BASIC_AUTH_PASSWORD=%s -e PROXY_PASS=http://$PRIVATE_IP:2376 "
            + "-l serviceName=%s -l serviceType=%s -l serviceAddr=%s:%s -l serviceHostname=%s -l isReplicable=%b "
            + "-l isStoppable=%b %s && echo 'Proxy launched'; fi",
        serviceName, dockerRepository, dockerRepository, externalPort, internalPort,
        dockerApiProxyUsername, dockerApiProxyPassword, serviceName, serviceType, hostname, externalPort,
        hostname, false, false, dockerRepository);
    //TODO use launchContainer instead
    CommandResult commandResult = sshService.execCommand(hostname, "launchDockerApiProxy", command);

    dockerContainersService.launchSingletonService(hostname)

    if (!commandResult.isSuccessful()) {
      throw new MasterManagerException("Unsuccessful launch of docker api proxy on host %s: %s", hostname,
          commandResult.getError());
    }
  }

}
