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
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerCoreService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.nodes.NodesService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.hosts.HostsService;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.swarm.SwarmInit;
import com.spotify.docker.client.messages.swarm.SwarmJoin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DockerSwarmService {

  private final DockerCoreService dockerCoreService;
  private final HostsService hostsService;
  private final NodesService nodesService;
  private final String dockerSwarmManager;

  public DockerSwarmService(DockerCoreService dockerCoreService,
                            @Lazy HostsService hostsService,
                            @Lazy NodesService nodesService,
                            DockerProperties dockerProperties) {
    this.dockerCoreService = dockerCoreService;
    this.hostsService = hostsService;
    this.nodesService = nodesService;
    this.dockerSwarmManager = dockerProperties.getSwarm().getManager();
  }

  public DockerClient getSwarmManager() {
    return dockerCoreService.getDockerClient(dockerSwarmManager);
  }

  public Optional<String> isASwarmManager(String hostname) {
    try (var docker = dockerCoreService.getDockerClient(hostname)) {
      return docker.info().swarm().controlAvailable()
          ? Optional.of(nodesService.getHostNode(hostname).getId())
          : Optional.empty();
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public Optional<String> isASwarmWorker(String hostname) {
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
    try (var docker = getSwarmManager()) {
      String port = hostsService.findAvailableExternalPort("2377");
      String listenAddress = String.format("%s:%s", "0.0.0.0", port);
      log.info("Initializing docker swarm at {} with listen address {}", dockerSwarmManager, listenAddress);
      var swarmInit = SwarmInit.builder()
          .advertiseAddr(dockerSwarmManager)
          .listenAddr(listenAddress)
          .build();
      String swarmId = docker.initSwarm(swarmInit);
      log.info("Started docker swarm with id {}", swarmId);
      return swarmId;
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public String joinSwarm(String hostname) {
    try (DockerClient swarmManager = getSwarmManager();
         DockerClient swarmWorker = dockerCoreService.getDockerClient(hostname)) {
      String workerJoinToken = swarmManager.inspectSwarm().joinTokens().worker();
      SwarmJoin swarmJoin = SwarmJoin.builder()
          .listenAddr(hostname)
          .advertiseAddr(hostname)
          .joinToken(workerJoinToken)
          .remoteAddrs(List.of(dockerSwarmManager)).build();
      swarmWorker.joinSwarm(swarmJoin);
      String id = swarmWorker.info().id();
      log.info("{} joined the swarm as node {}", hostname, id);
      return id;
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

  public void leaveSwarm(String hostname) {
    try (DockerClient docker = dockerCoreService.getDockerClient(hostname)) {
      docker.leaveSwarm(true);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new MasterManagerException(e.getMessage());
    }
  }

}
