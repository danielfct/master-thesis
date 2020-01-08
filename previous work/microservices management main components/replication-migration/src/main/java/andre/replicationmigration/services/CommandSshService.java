package andre.replicationmigration.services;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.EdgeHost;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.reqres.CommandResult;
import andre.replicationmigration.ssh.CommandSsh;

@Service
public class CommandSshService {

    @Autowired
    private CommandSsh ssh;

    @Autowired
    private EdgeHostService hosts;

    @Autowired
    private ServicesConfigsService serviceConfigsService;

    @Value("${replic.prop.docker-init-script-path}")
    private String dockerInitScriptPath;

    public boolean uploadDockerScript(String hostname) {
        return uploadScript(dockerInitScriptPath, hostname);
    }

    public boolean uploadScript(String scriptPath, String hostname) {
        String[] scriptSplit = scriptPath.split("/");
        String scriptName = scriptSplit[scriptSplit.length - 1];
        if (hosts.hasEdgeHost(hostname)) {
            EdgeHost host = hosts.getEdgeHostByHostname(hostname);
            String username = host.getSshUsername();
            String password = new String(Base64.getDecoder().decode(host.getSshPassword()));
            return ssh.uploadFile(hostname, username, password, scriptPath, scriptName);
        }
        return ssh.uploadFile(hostname, scriptPath, scriptName);
    }

    private String getDockerApiProxyLabels(ServiceConfig dockerApiProxy, String hostname) {
        String serviceName = "-l serviceName=" + dockerApiProxy.getServiceName();
        String serviceType = " -l serviceType=" + dockerApiProxy.getServiceType();
        String serviceAddr = " -l serviceAddr=" + hostname + ":" + dockerApiProxy.getDefaultExternalPort();
        String serviceHostname = " -l serviceHostname=" + hostname;

        return serviceName + serviceType + serviceAddr + serviceHostname;
    }

    public boolean launchDockerApiProxy(String hostname) {
        ServiceConfig dockerApiProxy = serviceConfigsService.getServiceLaunchConfig("docker-api-proxy");
        String labels = getDockerApiProxyLabels(dockerApiProxy, hostname);

        String command = "COUNT_API_PROXY=$(docker ps --filter 'name=" + dockerApiProxy.getServiceName() + "' | grep '"
                + dockerApiProxy.getDockerRepo()
                + "' | wc -l) && if [ $COUNT_API_PROXY = 1 ]; then echo '-> Proxy is running';"
                + " else PRIVATE_IP=$(/sbin/ip -o -4 addr list docker0 | awk '{print $4}' | cut -d/ -f1)"
                + " && docker pull acarrusca/nginx-proxy && docker run -itd --name=docker-api-proxy -p "
                + dockerApiProxy.getDefaultExternalPort() + ":" + dockerApiProxy.getDefaultInternalPort() + " --rm -e"
                + " BASIC_AUTH_USERNAME=username -e BASIC_AUTH_PASSWORD=password -e PROXY_PASS=http://$PRIVATE_IP:2376 "
                + labels + " " + dockerApiProxy.getDockerRepo() + " && echo '-> Proxy launched'; fi";

        CommandResult result = execCommand(hostname, command);

        return result.getResultStatus().equals("0");
    }

    public boolean isHostRunning(String hostname) {
        if (hosts.hasEdgeHost(hostname)) {
            EdgeHost host = hosts.getEdgeHostByHostname(hostname);
            String username = host.getSshUsername();
            String password = new String(Base64.getDecoder().decode(host.getSshPassword()));
            return ssh.isHostRunning(hostname, username, password);
        } else {
            return ssh.isHostRunning(hostname);
        }
    }

    public boolean dockerInitSwarm(String hostname) {
        String command = "docker swarm init --advertise-addr " + hostname;
        CommandResult result = execCommand(hostname, command);

        System.out.println("-> SSH docker swarm init on " + hostname);
        for (String resultLine : result.getResult()) {
            if (!resultLine.equals(""))
                System.out.println("-> " + resultLine);
        }
        System.out.println("-> Result: " + result.getResultStatus());

        return result.getResultStatus().equals("0");
    }

    private CommandResult execCommand(String hostname, String command) {
        if (hosts.hasEdgeHost(hostname)) {
            EdgeHost host = hosts.getEdgeHostByHostname(hostname);
            String username = host.getSshUsername();
            String password = new String(Base64.getDecoder().decode(host.getSshPassword()));
            return ssh.exec(hostname, username, password, command);
        } else {
            return ssh.exec(hostname, command);
        }
    }

}