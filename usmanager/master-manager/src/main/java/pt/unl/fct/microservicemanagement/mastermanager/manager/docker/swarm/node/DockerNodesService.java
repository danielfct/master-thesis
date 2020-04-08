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

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.swarm.DockerSwarmService;

import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.swarm.Node;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public final class DockerNodesService {

  private final DockerSwarmService dockerSwarmService;

  public DockerNodesService(DockerSwarmService dockerSwarmService) {
    this.dockerSwarmService = dockerSwarmService;
  }

  public List<SimpleNode> getNodes() {
    return getNodes(null);
  }

  private List<SimpleNode> getNodes(Predicate<Node> filter) {
    //TODO use dockerClient.listNodes(Node.Criteria) instead to shorten GET result?
    try (var swarmManager = dockerSwarmService.getSwarmManager()) {
      Stream<Node> nodeStream = swarmManager.listNodes().stream();
      if (filter != null) {
        nodeStream = nodeStream.filter(filter);
      }
      return nodeStream.map(n -> new SimpleNode(n.id(), n.status().addr(), n.status().state(),
          NodeRole.from(n.spec().role()))).collect(Collectors.toList());
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new GetNodesException(e.getMessage());
    }
  }

  public SimpleNode getNode(String id) {
    return getNodes(node -> Objects.equals(node.id(), id)).stream()
        .findFirst()
        .orElseThrow(() -> new EntityNotFoundException(SimpleNode.class, "id", id));
  }

  public List<SimpleNode> getAvailableNodes() {
    return getAvailableNodes(null);
  }

  public List<SimpleNode> getAvailableNodes(Predicate<Node> filter) {
    Predicate<Node> readyFilter = n -> n.status().state().equals("ready");
    Predicate<Node> availableFilter = filter == null ? readyFilter : filter.and(readyFilter);
    return getNodes(availableFilter);
  }

  public boolean hasNode(Predicate<Node> predicate) {
    return !getAvailableNodes(predicate).isEmpty();
  }

  public void deleteUnresponsiveNodes() {
    log.info("Deleting unresponsive nodes...");
    log.info("before: {}", getNodes());
    deleteNodes(n -> !n.status().state().equals("ready"));
    log.info("after: {}", getNodes());
  }

  public void deleteHostNodes(String nodeHostname) {
    deleteNodes(n -> n.status().addr().equals(nodeHostname));
  }

  private void deleteNodes(Predicate<Node> filter) {
    getNodes(filter).forEach(n -> deleteNode(n.getId()));
  }

  private void deleteNode(String nodeId) {
    try (var swarmManager = dockerSwarmService.getSwarmManager()) {
      swarmManager.deleteNode(nodeId, true);
      log.info("Deleted node '{}'", nodeId);
    } catch (DockerException | InterruptedException e) {
      e.printStackTrace();
      throw new DeleteNodeException(e.getMessage());
    }
  }

  public boolean isNode(String hostname) {
    return getAvailableNodes(n -> Objects.equals(n.description().hostname(), hostname)).isEmpty();
  }


}
