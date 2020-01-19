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

package pt.unl.fct.microservicemanagement.mastermanager.docker.swarm;

import pt.unl.fct.microservicemanagement.mastermanager.docker.DockerCoreService;
import pt.unl.fct.microservicemanagement.mastermanager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.remote.ssh.CommandResult;
import pt.unl.fct.microservicemanagement.mastermanager.remote.ssh.SshService;

import java.util.List;

import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.swarm.SwarmJoin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DockerSwarmService {

  private final DockerCoreService dockerCoreService;
  private final SshService sshService;
  private final String dockerSwarmManager;

  public DockerSwarmService(DockerCoreService dockerCoreService,
                            SshService sshService,
                            DockerProperties dockerProperties) {
    this.dockerCoreService = dockerCoreService;
    this.sshService = sshService;
    this.dockerSwarmManager = dockerProperties.getSwarm().getManager();
  }

  public DockerClient getSwarmManager() {
    return dockerCoreService.getDockerClient(dockerSwarmManager);
  }

  public void initSwarm() {
    try (DockerClient swarmManager = getSwarmManager()) {
      log.info("\nStarting docker swarm '{}' on host '{}'...", swarmManager.inspectSwarm().id(), dockerSwarmManager);
      var command = String.format("docker swarm init --advertise-addr %s", dockerSwarmManager);
      CommandResult result = sshService.execCommand(dockerSwarmManager, command);
      if (result.isSuccessful()) {
        log.info("\ndone");
      } else {
        log.info("\nfailed with exit status '{}' due to '{}'", result.getExitStatus(), result.getResult());
      }
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new InitSwarmException(e.getMessage());
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
      throw new JoinSwarmException(e.getMessage());
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
