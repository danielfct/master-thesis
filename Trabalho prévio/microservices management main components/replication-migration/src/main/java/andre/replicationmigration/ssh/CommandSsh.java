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
import net.schmizz.sshj.transport.verification.PromiscuousVerifier;
import net.schmizz.sshj.userauth.keyprovider.PKCS8KeyFile;
import net.schmizz.sshj.xfer.FileSystemFile;

@Component
public class CommandSsh {

	@Value("${replic.prop.aws-key-file-path}")
	private String awsKeyFilePath;

	@Value("${replic.prop.aws-username}")
	private String awsUser;

	public CommandSsh() {
		Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
	}

	private SSHClient initClient(String hostname, String username, String password) throws IOException {
		SSHClient client = new SSHClient();
		client.addHostKeyVerifier(new PromiscuousVerifier());
		client.connect(hostname);
		client.authPassword(username, password);

		return client;
	}

	private SSHClient initClient(String hostname) throws IOException {
		SSHClient client = new SSHClient();
		client.addHostKeyVerifier(new PromiscuousVerifier());
		client.connect(hostname);

		PKCS8KeyFile keyFile = new PKCS8KeyFile();
		keyFile.init(new File(awsKeyFilePath));
		client.authPublickey(awsUser, keyFile);

		return client;
	}

	private CommandResult exec(Session session, String command) {
		try {
			final Command cmd = session.exec(command);
			List<String> listResult = new ArrayList<>();
			listResult.addAll(Arrays.asList(IOUtils.readFully(cmd.getInputStream()).toString().split("\\n")));
			cmd.join(10, TimeUnit.SECONDS);
			String exitStatus = "" + cmd.getExitStatus();
			return new CommandResult(command, listResult, exitStatus);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public CommandResult exec(String hostname, String username, String password, String command) {
		CommandResult result = null;
		try {
			SSHClient client = this.initClient(hostname, username, password);
			try {
				final Session session = client.startSession();
				try {
					result = this.exec(session, command);
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

	public CommandResult exec(String hostname, String command) {
		CommandResult result = null;
		try {
			SSHClient client = this.initClient(hostname);
			try {
				final Session session = client.startSession();
				try {
					result = this.exec(session, command);
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

	public boolean uploadFile(String hostname, String username, String password, String filePath, String toPath) {
		try {
			SSHClient client = this.initClient(hostname, username, password);
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
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public boolean uploadFile(String hostname, String filePath, String toPath) {
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
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public boolean isHostRunning(String hostname) {
		boolean result = false;
		try {
			SSHClient client = this.initClient(hostname);
			try {
				final Session session = client.startSession();
				try {
					result = true;
				} finally {
					session.close();
				}
			} finally {
				client.close();
			}
		} catch (Exception e) {
			result = false;
		}
		return result;
	}

	public boolean isHostRunning(String hostname, String username, String password) {
		boolean result = false;
		try {
			SSHClient client = this.initClient(hostname, username, password);
			try {
				final Session session = client.startSession();
				try {
					result = true;
				} finally {
					session.close();
				}
			} finally {
				client.close();
			}
		} catch (Exception e) {
			result = false;
		}
		return result;
	}
}
