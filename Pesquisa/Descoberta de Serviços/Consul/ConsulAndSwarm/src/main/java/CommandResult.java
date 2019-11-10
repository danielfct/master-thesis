import lombok.*;
import net.schmizz.sshj.common.IOUtils;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@AllArgsConstructor @Getter
public class CommandResult {

    private final String username;
    private final String hostname;
    private final String command;
    private final List<String> output;
    private final List<String> error;
    private final int exitCode;

    public boolean isSuccessful() {
        return exitCode == 0;
    }

    @Override
    public String toString() {
        return username + "@" + hostname + ":\n" +
                "$ " + command + "\n" +
                "> " + String.join("\n> ", isSuccessful() ? output : error) + "\n" +
                "Exit code: " + exitCode;
    }

}
