import com.spotify.docker.client.DefaultDockerClient;
import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.LogStream;
import com.spotify.docker.client.exceptions.DockerException;
import com.spotify.docker.client.messages.Container;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.spotify.docker.client.DockerClient.LogsParam.stderr;
import static com.spotify.docker.client.DockerClient.LogsParam.stdout;
import static java.util.concurrent.TimeUnit.SECONDS;

public class GetContainerLogs {


    private static final String DOCKER_API_PROXY_USERNAME = "username";
    private static final String DOCKER_API_PROXY_PASSWORD = "password";

    public static void main(String[] args) {
        final var dockerClient = getDockerClient("localhost");
        while (true) {
            try {
                final Optional<String> containerId = dockerClient.listContainers(
                        DockerClient.ListContainersParam.filter("name", "consul-server1"))
                        .stream().findFirst().map(Container::id);
                if (containerId.isEmpty()) {
                    continue;
                }
                try (LogStream stream = dockerClient.logs(containerId.get(), stdout(), stderr())) {
                    final var logs = stream.readFully();
                    System.out.println(logs);
                }
                Thread.sleep(5000);
            } catch (DockerException | InterruptedException e) {
                e.printStackTrace();
            }
        }
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
}
