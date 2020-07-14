import com.spotify.docker.client.DefaultDockerClient;
import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.LogStream;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.Container;
import com.spotify.docker.client.messages.ContainerConfig;
import com.spotify.docker.client.messages.HostConfig;
import com.spotify.docker.client.messages.PortBinding;
import exceptions.ContainerNotFoundException;
import exceptions.ExecuteSSHCommandException;
import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.common.IOUtils;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.transport.verification.PromiscuousVerifier;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.spotify.docker.client.DockerClient.LogsParam.stderr;
import static com.spotify.docker.client.DockerClient.LogsParam.stdout;
import static java.util.concurrent.TimeUnit.SECONDS;

public class Main {

    private static final String MACHINE_USERNAME = "daniel";
    private static final String MACHINE_PASSWORD = new String(Base64.getDecoder().decode("enhj"));
    private static final String DOCKER_API_PROXY_USERNAME = "username";
    private static final String DOCKER_API_PROXY_PASSWORD = "password";

    private enum ConsulMode {
        SERVER, AGENT
    }

    private enum ContainerState {
        NOT_FOUND, CREATED, RESTARTING, RUNNING, REMOVING, PAUSED, EXITED, DEAD;

        boolean isRunning() {
           return this == CREATED || this == RESTARTING || this == RUNNING;
        }

        boolean isStopped() {
            return this == NOT_FOUND || this == REMOVING || this == PAUSED || this == EXITED || this == DEAD;
        }
    }

    public static void main(String[] args) {
        /*if (!executeScript("localhost", "docker-install.sh")) {
            System.out.println("Failed to install Docker on this machine.");
        }*/
        if (startDockerApiProxy("localhost")) {
            System.out.println("Started Docker Api Proxy on localhost.");
        } else {
            System.out.println("Failed to start Docker Api Proxy on localhost.");
        }
        if (getContainerState("consul-server1").isRunning()) {
            System.out.println("Consul Containerized Agent is already running on localhost");
        } else if (startContainerizedService("docker-consul", "localhost").isSuccessful()) {
            System.out.println("Started Consul Containerized Agent on localhost");
        } else {
            System.out.println("Failed to start Consul Containerized Agent on localhost.");
        }
        /*if (!launchConsul("localhost", ConsulMode.SERVER)) {
            System.out.println("Failed to launch Consul Server on this machine.");
        }*/
        /*if (!launchConsulAgent("localhost", ConsulMode.AGENT)) {
        )) {
            System.out.println("Failed to launch Consul Agent on this machine.");
        }*/
    }

    private static Optional<Container> getContainerByName(final String name) {
        final var dockerClient = getDockerClient("localhost");
        Optional<Container> container = Optional.empty();
        try {
            container = dockerClient.listContainers(
                    DockerClient.ListContainersParam.filter("name", name))
                    .stream().findFirst();
        } catch (DockerException | InterruptedException e) {
            e.printStackTrace();
        }
        return container;
    }

    private static ContainerState getContainerState(final String containerName) {
        final var container = getContainerByName(containerName);
        return container.isEmpty() ?
                ContainerState.NOT_FOUND :
                ContainerState.valueOf(container.get().state().toUpperCase());
    }

    private static DockerClient getDockerClient(String hostname) {
        final var uri = "http://" + hostname + ":2375";
        final var authorization = "Basic " + new String(Base64.getEncoder().encode(
                (DOCKER_API_PROXY_USERNAME + ":" + DOCKER_API_PROXY_PASSWORD).getBytes()));
        return DefaultDockerClient.builder()
                .uri(uri)
                .header("Authorization", authorization)
                .connectTimeoutMillis(SECONDS.toMillis(10))
                .readTimeoutMillis(SECONDS.toMillis(30))
                .build();
    }

    public static StartDockerContainerResult startContainerizedService(String serviceName, String hostname) {
        final var ports = Map.of(
                "8500", List.of(PortBinding.of("", "8500")),
                "8600/udp", List.of(PortBinding.of("", "8600"))
        );
        final var hostConfig = HostConfig.builder()
                .autoRemove(true)
                .portBindings(ports)
                .build();
        final var containerName = "consul-server1";
        final var dockerRepository = "danielfct/" + serviceName;
        var launchCommand = List.of(
                "agent",
                "-server",
                "-ui",
                "-node=server-1",
                "-bootstrap-expect=1",
                "-client=0.0.0.0");
        final var containerConfig = ContainerConfig.builder()
                .hostConfig(hostConfig)
                .image(dockerRepository)
                .exposedPorts("8500", "8600/udp")
                .cmd(launchCommand)
                .build();
/*command = "docker run -itd -p 8500:8500 -p 8600:8600/udp --name=badger --rm consul agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0";*/
        StartDockerContainerResult result;
        try {
            final var dockerClient = getDockerClient(hostname);
            dockerClient.pull(dockerRepository);
            final var container = dockerClient.createContainer(containerConfig, containerName);
            dockerClient.startContainer(container.id());

            final String logs;
            try (LogStream stream = dockerClient.logs(container.id(), stdout(), stderr())) {
                logs = stream.readFully();
            }
            System.out.println(logs);
            result = new StartDockerContainerResult(hostname, serviceName, container.id());
        }
        catch (DockerException | InterruptedException e) {
            e.printStackTrace();
            result = new StartDockerContainerResult(hostname, serviceName, e);
        }
        System.out.println(result);
        return result;
    }

    private static SSHClient initClient(String hostname) throws IOException {
        final var sshClient = new SSHClient();
        sshClient.addHostKeyVerifier(new PromiscuousVerifier());
        sshClient.connect(hostname);
        sshClient.authPassword(MACHINE_USERNAME, MACHINE_PASSWORD);
        System.out.printf("Connected to %s@%s\n", MACHINE_USERNAME, hostname);
        return sshClient;
    }

    private static CommandResult execute(final String hostname, final String command)
            throws ExecuteSSHCommandException {
        try (final var sshClient = initClient(hostname);
             final var session = sshClient.startSession()) {
            final Session.Command cmd = session.exec(command);
            cmd.join(60, TimeUnit.SECONDS);
            final var output = Arrays.stream(IOUtils.readFully(cmd.getInputStream()).toString().split("\\n"))
                    .filter(Predicate.not(String::isEmpty))
                    .collect(Collectors.toList());
            final var error = Arrays.stream(IOUtils.readFully(cmd.getErrorStream()).toString().split("\\n"))
                    .filter(Predicate.not(String::isEmpty))
                    .collect(Collectors.toList());
            final var exitStatus = cmd.getExitStatus();
            final var commandResult = new CommandResult(MACHINE_USERNAME, hostname, command, output, error, exitStatus);
            System.out.println(commandResult);
            return commandResult;
        } catch (IOException e) {
            e.printStackTrace();
            throw new ExecuteSSHCommandException(e.getMessage());
        }
    }

    /*private static boolean executeScript(final String hostname, final String scriptName) {
        return executeScript(hostname, scriptName, "");
    }

    private static boolean executeScript(final String hostname, final String scriptName, final String args) {
        final var file = new File("src/main/resources/scripts/" + scriptName);
        final var command = SUDO + " bash '" + file.getAbsolutePath() + "' " + args;
        try {
            final var result = execute(hostname, command);
            return result.isSuccessful();
        } catch (JSchException | IOException e) {
            e.printStackTrace();
            return false;
        }
    }*/

    private static boolean startDockerApiProxy(final String hostname) {
        final var serviceName = "docker-api-proxy";
        final var serviceType = "system";
        final var externalPort = 2375;
        final var internalPort = 80;
        final var dockerRepositoryName = "danielfct/nginx-proxy";
        //TODO change to a startContainerizedService call
        final var command = String.format("COUNT_API_PROXY=$(docker ps --filter 'name=%s' | grep '%s' | wc -l) && " +
                        "if [ $COUNT_API_PROXY = 1 ]; then echo 'Proxy is running'; " +
                        "else PRIVATE_IP=$(/sbin/ip -o -4 addr list docker0 | awk '{print $4}' | cut -d/ -f1) && " +
                        "docker pull %s && " +
                        "docker run -itd --name=docker-api-proxy -p %s:%s --rm " +
                        "-e BASIC_AUTH_USERNAME=%s " +
                        "-e BASIC_AUTH_PASSWORD=%s " +
                        "-e PROXY_PASS=http://$PRIVATE_IP:2376 " +
                        "-l serviceName=%s " +
                        "-l serviceType=%s " +
                        "-l serviceAddr=%s:%s " +
                        "-l serviceHostname=%s %s && " +
                        "echo 'Proxy launched'; fi",
                serviceName, dockerRepositoryName, dockerRepositoryName, externalPort, internalPort,
                DOCKER_API_PROXY_USERNAME, DOCKER_API_PROXY_PASSWORD, serviceName, serviceType, hostname, externalPort,
                hostname, dockerRepositoryName);
        try {
            final var result = execute(hostname, command);
            return result.isSuccessful();
        } catch (ExecuteSSHCommandException e) {
            e.printStackTrace();
            return false;
        }
    }

    private static boolean launchConsul(final String hostname, final ConsulMode mode) {
        final String command;
        switch (mode) {
            case SERVER:
                command = "docker run -itd -p 8500:8500 -p 8600:8600/udp --name=badger --rm " +
                        "consul agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0";
                break;
            case AGENT:
                command = "docker run -itd --name=fox --rm " +
                        "consul agent -node=client-1 -join=172.17.0.2";
                break;
            default:
                throw new IllegalArgumentException("ConsulMode not supported");
        }
        try {
            final var result = execute(hostname, command);
            return result.isSuccessful();
        } catch (ExecuteSSHCommandException e) {
            e.printStackTrace();
            return false;
        }
    }

}
