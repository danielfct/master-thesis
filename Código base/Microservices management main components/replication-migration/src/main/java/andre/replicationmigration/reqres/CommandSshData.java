package andre.replicationmigration.reqres;

public class CommandSshData {

	private String hostname, username, password, command;

	public CommandSshData(){}

	public CommandSshData(String hostname, String username, String password, String command) {		
		this.hostname = hostname;
		this.username = username;
		this.password = password;
		this.command = command;
	}

	public String getHostname() {
		return hostname;
	}

	public void setHostname(String hostname) {
		this.hostname = hostname;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	@Override
	public String toString() {
		return "CommandSshData [hostname=" + hostname + ", username=" + username + ", password=" + password
				+ ", command=" + command + "]";
	}
	
	
}
