import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor @Getter
public class StartDockerContainerResult {

    private final String hostname; // HostDetails hostDetails; TODO
    private final String serviceName;
    private final String containerId;
    private final Exception error;

    public StartDockerContainerResult(final String hostname, final String serviceName, final String containerId) {
        this.hostname = hostname;
        this.serviceName = serviceName;
        this.containerId = containerId;
        this.error = null;
    }

    public StartDockerContainerResult(final String hostname, final String serviceName, final Exception error) {
        this.hostname = hostname;
        this.serviceName = serviceName;
        this.containerId = "";
        this.error = error;
    }

    public boolean isSuccessful() {
        return error == null;
    }

    @Override
    public String toString() {
        return "[StartDockerContainerResult]: " +
                "hostname = " + hostname +
                ", serviceName = " + serviceName +
                (isSuccessful() ? ", containerId = " + containerId : ", \nerror = " + error.getMessage());
    }
}
