package andre.replicationmigration.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import andre.replicationmigration.model.EdgeHost;
import andre.replicationmigration.services.testslogs.RepMigMonitoringService;

@Component
public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {

    @Value("${replic.prop.docker-master-node-hostname}")
    private String dockerMasterNodeHostname;

    @Value("${replic.prop.aws-initial-max-instances}")
    private int awsInitialMaxInstances;

    @Autowired
    private EdgeHostService edgeHostService;

    @Autowired
    private CommandSshService sshService;

    @Autowired
    private ContainerMonitoringService containerMonitoringService;

    @Autowired
    private HostMonitoringService hostMonitoringService;

    @Autowired
    private RepMigMonitoringService repMigMonitoringService;

    @Autowired
    private HostService hostService;

    @Autowired
    private DockerCore dockerCore;

    /**
     * This event is executed as late as conceivably possible to indicate that the
     * application is ready to service requests.
     */
    @Override
    public void onApplicationEvent(final ApplicationReadyEvent event) {
        initDockerComponents();
    }

    private void initDockerComponents() {
        boolean isHostRunning = sshService.isHostRunning(dockerMasterNodeHostname);
        if (isHostRunning) {
            boolean isDockerApiProxyRunning = sshService.launchDockerApiProxy(dockerMasterNodeHostname);
            if (isDockerApiProxyRunning) {
                hostService.startMasterHostComponents(dockerMasterNodeHostname, isHostRunning, isDockerApiProxyRunning);
                if (!edgeHostService.hasEdgeHost(dockerMasterNodeHostname)) { // Master is on AWS
                    this.joinSwarmWorkersOnAws();
                } else {
                    EdgeHost dockerMasterHost = edgeHostService.getEdgeHostByHostname(dockerMasterNodeHostname);
                    if (!dockerMasterHost.isLocal()) { // Master is accessible through internet
                        this.joinSwarmWorkersOnAws();
                    } else { // Master is only local
                        this.joinSwarmSimilarEdgeHosts(dockerMasterHost.isLocal());
                    }
                }
                containerMonitoringService.initContainerMonitorTimer();
                hostMonitoringService.initHostMonitorTimer();
                repMigMonitoringService.initRepMigMonitorTimer();
            }
        } else {
            System.out.println("-> Doker master node is not connected. Fail to init docker components.");
        }
    }

    private void joinSwarmSimilarEdgeHosts(boolean masterNodeIsLocal) {
        String partialHostname = dockerMasterNodeHostname;
        int MAX_WORKERS = 1;
        String[] masterHostSplit = dockerMasterNodeHostname.split("\\.");
        if (masterHostSplit.length > 3)
            partialHostname = masterHostSplit[0] + "." + masterHostSplit[1] + "." + masterHostSplit[2];
        List<EdgeHost> localHosts = edgeHostService.getHostsByPartialHostname(partialHostname);
        int count = 0;
        boolean success = false;
        for (EdgeHost host : localHosts) {
            if (count < MAX_WORKERS) {
                if (!host.getHostname().equals(dockerMasterNodeHostname) && host.isLocal() == masterNodeIsLocal) {
                    success = hostService.startHostComponents(host.getHostname(), 1);
                    if (success)
                        count++;
                }
            } else
                break;
        }
    }

    private void joinSwarmWorkersOnAws() {
        int presentWorkers = dockerCore.getAvailableNodes().size() - 1;
        int maxInitialWorkers = awsInitialMaxInstances < 0 ? 0 : awsInitialMaxInstances - 1;
        int workersToAdd = maxInitialWorkers - presentWorkers;
        int addedWorkers = 0;
        for (int i = 0; i < workersToAdd; i++) {
            hostService.addAwsHostToSwarm();
            addedWorkers++;
            System.out.println("-> Added new AWS node: " + addedWorkers + " of " + workersToAdd);
        }
    }
}