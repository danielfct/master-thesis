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

package pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.MasterManagerException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerCoreService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.remote.ssh.SshService;

import java.util.List;
import java.util.Objects;

import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.swarm.SwarmInit;
import com.spotify.docker.client.messages.swarm.SwarmJoin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DockerSwarmService {

  private final DockerCoreService dockerCoreService;
  private final String dockerSwarmManager;

  public DockerSwarmService(DockerCoreService dockerCoreService,
                            SshService sshService,
                            DockerProperties dockerProperties) {
    this.dockerCoreService = dockerCoreService;
    this.dockerSwarmManager = dockerProperties.getSwarm().getManager();
  }

  public DockerClient getSwarmManager() {
    return dockerCoreService.getDockerClient(dockerSwarmManager);
  }

  public boolean isASwarmManager(String hostname) {
    try (var docker = dockerCoreService.getDockerClient(hostname)) {
      return docker.info().swarm().controlAvailable();
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new DockerOperationException("Failed to execute 'isASwarmManager': %s", e.getMessage());
    }
  }

  public boolean isASwarmWorker(String hostname) {
    try (var docker = dockerCoreService.getDockerClient(hostname)) {
      return Objects.equals(docker.info().swarm().localNodeState(), "active")
          && !docker.info().swarm().controlAvailable();
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new DockerOperationException("Failed to execute 'isASwarmWorker': %s", e.getMessage());
    }
  }

  public void initSwarm() {
    try (var docker = getSwarmManager()) {
      log.info("Initializing docker swarm at {}...", dockerSwarmManager);
      var swarmInit = SwarmInit.builder()
          .advertiseAddr(dockerSwarmManager)
          .listenAddr("0.0.0.0:2377")
          .build();
      String swarmId = docker.initSwarm(swarmInit);
      log.info("Started docker swarm with id {}...", swarmId);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new DockerOperationException("Failed to execute 'initSwarm': %s", e.getMessage());
    }
  }

  public void joinSwarm(String hostname) {
    try (DockerClient swarmManager = getSwarmManager();
         DockerClient swarmWorker = dockerCoreService.getDockerClient(hostname)) {
      String workerJoinToken = swarmManager.inspectSwarm().joinTokens().worker();
      SwarmJoin swarmJoin = SwarmJoin.builder().listenAddr(hostname).advertiseAddr(hostname).joinToken(workerJoinToken)
          .remoteAddrs(List.of(dockerSwarmManager)).build();
      swarmWorker.joinSwarm(swarmJoin);
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
      throw new LeaveSwarmException(e.getMessage());
    }
  }

}
