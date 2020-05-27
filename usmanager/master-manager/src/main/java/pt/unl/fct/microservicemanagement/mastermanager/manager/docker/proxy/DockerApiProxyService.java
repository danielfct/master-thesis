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

import org.springframework.context.annotation.Lazy;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.MasterManagerException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.ContainerConstants;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.ContainerEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.ContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.CommandResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.SshService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DockerApiProxyService {

  public static final String DOCKER_API_PROXY = "docker-api-proxy";

  private final ContainersService containersService;
  private final SshService sshService;

  private final String dockerApiProxyUsername;
  private final String dockerApiProxyPassword;
  private final int dockerApiProxyPort;

  public DockerApiProxyService(@Lazy ContainersService containersService, SshService sshService,
                               DockerProperties dockerProperties) {
    this.containersService = containersService;
    this.sshService = sshService;
    this.dockerApiProxyUsername = dockerProperties.getApiProxy().getUsername();
    this.dockerApiProxyPassword = dockerProperties.getApiProxy().getPassword();
    this.dockerApiProxyPort = dockerProperties.getApiProxy().getPort();
  }

  public ContainerEntity launchDockerApiProxy(String hostname) {
    var privateIpCommand = "/sbin/ip -o -4 addr list docker0 | awk '{print $4}' | cut -d/ -f1";
    CommandResult privateIpResult = sshService.execCommand(hostname, "launchDockerApiProxy", privateIpCommand);
    if (!privateIpResult.isSuccessful()) {
      throw new MasterManagerException("Unsuccessful launch of docker api proxy on host %s: %s", hostname,
          privateIpResult.getError());
    }
    String privateIp = privateIpResult.getOutput();
    var environment = List.of(
        String.format("%s=%s", ContainerConstants.Environment.BASIC_AUTH_USERNAME, dockerApiProxyUsername),
        String.format("%s=%s", ContainerConstants.Environment.BASIC_AUTH_PASSWORD,
            dockerApiProxyPassword),
        String.format("%s=http://%s:%d", ContainerConstants.Environment.PROXY_PASS, privateIp,
            dockerApiProxyPort));
    var labels = Map.of(
        ContainerConstants.Label.IS_REPLICABLE, String.valueOf(false),
        ContainerConstants.Label.IS_STOPPABLE, String.valueOf(false));
    return containersService.launchContainer(hostname, DOCKER_API_PROXY, true, environment, labels);
  }

}
