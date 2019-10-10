package andre.replicationmigration.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.EdgeHost;
import andre.replicationmigration.repositories.EdgeHostRepository;

@Service
public class EdgeHostService {

    @Autowired
    private EdgeHostRepository edgeHosts;

    public EdgeHost getEdgeHostByHostname(String hostname) {
        List<EdgeHost> edgeHostsList = edgeHosts.findByHostname(hostname);
        return edgeHostsList.isEmpty() ? null : edgeHostsList.get(0);
    }

    public boolean hasEdgeHost(String hostname) {
        return getEdgeHostByHostname(hostname) != null;
    }

    public List<EdgeHost> getEdgeHostsByIsLocal(boolean isLocal) {
        return edgeHosts.findByisLocal(isLocal);
    }

    public Iterable<EdgeHost> getEdgeHost() {
        return edgeHosts.findAll();
    }

    public long saveEdgeHost(long edgeHostId, EdgeHost edgeHost) {
        if(edgeHostId > 0)
            edgeHost.setId(edgeHostId);
        return edgeHosts.save(edgeHost).getId();
    }

    public long deleteEdgeHost(long edgeHostId) {       
        edgeHosts.delete(edgeHostId);
        return edgeHostId;
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

}