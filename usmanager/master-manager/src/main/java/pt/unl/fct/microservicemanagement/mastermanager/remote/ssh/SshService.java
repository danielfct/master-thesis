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

package pt.unl.fct.microservicemanagement.mastermanager.remote.ssh;

import pt.unl.fct.microservicemanagement.mastermanager.docker.DockerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.host.cloud.aws.AwsProperties;
import pt.unl.fct.microservicemanagement.mastermanager.host.edge.EdgeHostEntity;
import pt.unl.fct.microservicemanagement.mastermanager.host.edge.EdgeHostsService;

import java.io.File;
import java.io.IOException;
import java.net.NoRouteToHostException;
import java.security.Security;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.common.IOUtils;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.sftp.SFTPClient;
import net.schmizz.sshj.transport.verification.PromiscuousVerifier;
import net.schmizz.sshj.userauth.keyprovider.PKCS8KeyFile;
import net.schmizz.sshj.xfer.FileSystemFile;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SshService {

  private static final int EXEC_COMMAND_TIMEOUT = 30000;

  private final EdgeHostsService edgeHostsService;

  private final String awsKeyFilePath;
  private final String awsUser;
  private final Map<String, String> scriptPaths;

  public SshService(EdgeHostsService edgeHostsService, AwsProperties awsProperties, DockerProperties dockerProperties) {
    this.edgeHostsService = edgeHostsService;
    this.awsKeyFilePath = awsProperties.getAccess().getKeyFilePath();
    this.awsUser = awsProperties.getAccess().getUsername();
    String dockerScriptPath = dockerProperties.getInstallScriptPath();
    this.scriptPaths = Map.of(dockerScriptPath.substring(dockerScriptPath.lastIndexOf('/') + 1), dockerScriptPath);
    Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
  }

  private SSHClient initClient(String hostname) throws IOException {
    var sshClient = new SSHClient();
    //TODO try to use another hostkeyverifier
    sshClient.addHostKeyVerifier(new PromiscuousVerifier());
    sshClient.connect(hostname);
    if (edgeHostsService.hasEdgeHost(hostname)) {
      EdgeHostEntity edgeHost = edgeHostsService.getEdgeHostByHostname(hostname);
      String username = edgeHost.getSshUsername();
      //TODO improve security password
      String password = new String(Base64.getDecoder().decode(edgeHost.getSshPassword()));
      sshClient.authPassword(username, password);
      log.info("\nLogged in to edge hostname '{}' with username '{}' and password '{}'",
          hostname, username, password);
    } else {
      var keyFile = new PKCS8KeyFile();
      keyFile.init(new File(awsKeyFilePath));
      sshClient.authPublickey(awsUser, keyFile);
      log.info("\nLogged in to cloud hostname '{}' with pem key '{}'", hostname, awsKeyFilePath);
    }
    return sshClient;
  }

  public void uploadFile(String hostname, String filename) {
    try (SSHClient sshClient = initClient(hostname);
         SFTPClient sftpClient = sshClient.newSFTPClient()) {
      String scriptPath = scriptPaths.get(filename);
      if (scriptPath == null) {
        throw new NotFoundException("File %s not found", filename);
      }
      var file = new File(scriptPath);
      sftpClient.put(new FileSystemFile(file), filename);
    } catch (IOException e) {
      e.printStackTrace();
      throw new UploadFileException(e.getMessage());
    }
  }

  public CommandResult execCommand(String hostname, String command) {
    try (var sshClient = initClient(hostname);
         var session = sshClient.startSession()) {
      log.info("\nExecuting '{}' \non hostname '{}'", command, hostname);
      Session.Command cmd = session.exec(command);
      cmd.join(EXEC_COMMAND_TIMEOUT, TimeUnit.MILLISECONDS);
      String result = Arrays.stream(IOUtils.readFully(cmd.getInputStream()).toString().split("\\n"))
          .filter(Predicate.not(String::isEmpty))
          .collect(Collectors.joining());
      String error = Arrays.stream(IOUtils.readFully(cmd.getErrorStream()).toString().split("\\n"))
          .filter(Predicate.not(String::isEmpty))
          .collect(Collectors.joining());
      error = error.isEmpty() ? "None" : error;
      int exitStatus = cmd.getExitStatus();
      log.info("\nresult = '{}' with exit status '{}' and error '{}'", result, exitStatus, error);
      return new CommandResult(command, result, exitStatus);
    } catch (IOException e) {
      e.printStackTrace();
      return new CommandResult(command, e.getMessage(), -1);
    }
  }

  public boolean hasConnection(String hostname) {
    try (SSHClient client = initClient(hostname);
         Session ignored = client.startSession()) {
      return true;
    } catch (NoRouteToHostException ignored) {
      // empty
    } catch (IOException e) {
      e.printStackTrace();
    }
    return false;
  }

}
