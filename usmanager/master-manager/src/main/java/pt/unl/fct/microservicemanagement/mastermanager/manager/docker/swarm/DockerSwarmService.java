/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.MasterManagerException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.bash.BashCommandResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.bash.BashService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerCoreService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.nodes.NodeRole;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.nodes.NodesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.HostsService;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.swarm.SwarmJoin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DockerSwarmService {

  private final DockerCoreService dockerCoreService;
  private final NodesService nodesService;
  private final HostsService hostsService;
  private final BashService bashService;

  public DockerSwarmService(DockerCoreService dockerCoreService,
                            @Lazy NodesService nodesService,
                            @Lazy HostsService hostsService,
                            BashService bashService) {
    this.dockerCoreService = dockerCoreService;
    this.nodesService = nodesService;
    this.hostsService = hostsService;
    this.bashService = bashService;
  }

  public DockerClient getSwarmManager() {
    return dockerCoreService.getDockerClient(hostsService.getPrivateIp());
  }

  public Optional<String> getSwarmManagerNodeId(String hostname) {
    try (var docker = dockerCoreService.getDockerClient(hostname)) {
      return docker.info().swarm().controlAvailable()
          ? Optional.of(nodesService.getHostNode(hostname).getId())
          : Optional.empty();
    } catch (DockerException | InterruptedException e) {
      return Optional.empty();
    }
  }

  public Optional<String> getSwarmWorkerNodeId(String hostname) {
    try (var docker = dockerCoreService.getDockerClient(hostname)) {
      return Objects.equals(docker.info().swarm().localNodeState(), "active")
          && !docker.info().swarm().controlAvailable()
          ? Optional.of(nodesService.getHostNode(hostname).getId())
          : Optional.empty();
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public String initSwarm() {
    String privateIp = hostsService.getPrivateIp();
    log.info("Initializing docker swarm at {}", privateIp);
    String command = String.format("docker swarm init --advertise-addr %s", privateIp);
    BashCommandResult result = bashService.executeCommand(command);
    if (!result.isSuccessful()) {
      throw new MasterManagerException("Unable to init docker swarm at %s: %s", privateIp, result.getError());
    }
    String output = String.join("\n", result.getOutput());
    String nodeIdRegex = "(?<=Swarm initialized: current node \\()(.*)(?=\\) is now a manager)";
    Matcher nodeIdRegexExpression = Pattern.compile(nodeIdRegex).matcher(output);
    if (!nodeIdRegexExpression.find()) {
      throw new MasterManagerException("Unable to get docker swarm node id");
    }
    return nodeIdRegexExpression.group(0);
  }

  public String joinSwarm(String hostname, NodeRole role) {
    String publicIp = hostsService.getPublicIP();
    try (DockerClient swarmManager = getSwarmManager();
         DockerClient swarmWorker = dockerCoreService.getDockerClient(hostname)) {
      log.info("{} is joining the docker swarm as {}", hostname, role);
      String joinToken;
      switch (role) {
        case MANAGER:
          joinToken = swarmManager.inspectSwarm().joinTokens().manager();
          break;
        case WORKER:
          joinToken = swarmManager.inspectSwarm().joinTokens().worker();
          break;
        default:
          throw new UnsupportedOperationException();
      }
      SwarmJoin swarmJoin = SwarmJoin.builder()
          .listenAddr(hostname)
          .advertiseAddr(hostname)
          .joinToken(joinToken)
          .remoteAddrs(List.of(publicIp)).build();
      swarmWorker.joinSwarm(swarmJoin);
      switch (role) {
        case MANAGER:
          return getSwarmManagerNodeId(hostname).get();
        case WORKER:
          return getSwarmWorkerNodeId(hostname).get();
        default:
          throw new UnsupportedOperationException();
      }
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public void leaveSwarm(String hostname) {
    try (DockerClient docker = dockerCoreService.getDockerClient(hostname)) {
      docker.leaveSwarm(true);
      log.info("{} left the swarm", hostname);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

}
