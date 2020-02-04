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

package pt.unl.fct.microservicemanagement.mastermanager.host.edge;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class EdgeHostsService {

  private final EdgeHostRepository edgeHosts;

  public EdgeHostsService(EdgeHostRepository edgeHosts) {
    this.edgeHosts = edgeHosts;
  }

  public Iterable<EdgeHost> getEdgeHosts() {
    return edgeHosts.findAll();
  }

  /*public long addEdgeHost(EdgeHost edgeHost) {
        return edgeHosts.save(edgeHost).getId();
    }

    public long updateEdgeHost(long id, EdgeHost newEdgeHost) {
        final var edgeHost = getEdgeHost(id);
        Utils.copyValidProperties(newEdgeHost, edgeHost);
        return edgeHosts.save(edgeHost).getId();
   }*/

  public long saveEdgeHost(long edgeHostId, EdgeHost edgeHost) {
    if (edgeHostId > 0) {
      edgeHost.setId(edgeHostId);
    }
    return edgeHosts.save(edgeHost).getId();
  }

  public void deleteEdgeHost(long edgeHostId) {
    edgeHosts.deleteById(edgeHostId);
  }

  public EdgeHost getEdgeHostByHostname(String hostname) {
    return edgeHosts.findByHostname(hostname);
  }

  public List<EdgeHost> getHostsByPartialHostname(String partialHostname) {
    return edgeHosts.findByHostnameContaining(partialHostname);
  }

  public List<EdgeHost> getHostsByRegion(String region) {
    return edgeHosts.findByRegion(region);
  }

  public List<EdgeHost> getHostsByCountry(String country) {
    return edgeHosts.findByCountry(country);
  }

  public boolean hasEdgeHost(String hostname) {
    return edgeHosts.hasEdgeHost(hostname);
  }

}
