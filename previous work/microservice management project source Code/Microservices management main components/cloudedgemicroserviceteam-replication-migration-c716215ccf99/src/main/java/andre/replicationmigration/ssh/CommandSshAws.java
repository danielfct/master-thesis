package andre.replicationmigration.ssh;

import java.io.File;
import java.io.IOException;
import java.security.Security;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import andre.replicationmigration.reqres.CommandResult;
import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.common.IOUtils;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.connection.channel.direct.Session.Command;
import net.schmizz.sshj.sftp.SFTPClient;
import net.schmizz.sshj.transport.TransportException;
import net.schmizz.sshj.transport.verification.PromiscuousVerifier;
import net.schmizz.sshj.userauth.UserAuthException;
import net.schmizz.sshj.userauth.keyprovider.PKCS8KeyFile;
import net.schmizz.sshj.xfer.FileSystemFile;

@Deprecated
@Component
public class CommandSshAws {

	@Value("${replic.prop.aws-key-file-path}")
	private String awsKeyFilePath;

	@Value("${replic.prop.aws-username}")
	private String awsUser;

	@Value("${replic.prop.docker-init-script-path}")
	private String dockerInitScriptPath;

	private SSHClient initClient(String hostname) {
		SSHClient client = new SSHClient();
		client.addHostKeyVerifier(new PromiscuousVerifier());
		try {
			client.connect(hostname);
		} catch (IOException e) {
			e.printStackTrace();
		}
		PKCS8KeyFile keyFile = new PKCS8KeyFile();
		keyFile.init(new File(awsKeyFilePath));
		try {
			client.authPublickey(awsUser, keyFile);
		} catch (UserAuthException | TransportException e) {
			e.printStackTrace();
		}

		return client;
	}

	public CommandSshAws() {
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
	}

	public CommandResult exec(String hostname, String command) {
		CommandResult result = null;
		try {
			SSHClient client = this.initClient(hostname);
			try {
				final Session session = client.startSession();
				try {
					List<String> listResult = new ArrayList<>();
					final Command cmd = session.exec(command);
					listResult.addAll(Arrays.asList(IOUtils.readFully(cmd.getInputStream()).toString().split("\\n")));
					cmd.join(10, TimeUnit.SECONDS);
					String exitStatus = "" + cmd.getExitStatus();

					result = new CommandResult(command, listResult, exitStatus);
				} finally {
					session.close();
				}
			} finally {
				client.close();
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public void uploadFile(String hostname, String filePath, String toPath) {
		try {
			SSHClient client = this.initClient(hostname);
			try {
				final SFTPClient sftp = client.newSFTPClient();
				File file = new File(filePath);
				try {
					sftp.put(new FileSystemFile(file), toPath);
				} finally {
					sftp.close();
				}
			} finally {
				client.disconnect();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}	

}
