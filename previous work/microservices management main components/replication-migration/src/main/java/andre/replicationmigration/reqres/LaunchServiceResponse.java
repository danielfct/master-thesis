package andre.replicationmigration.reqres;

public class LaunchServiceResponse {

	private LaunchServiceReq launchServiceReq;
	private CommandResult commandResult;
	
	public LaunchServiceResponse() {
		
	}

	public LaunchServiceResponse(LaunchServiceReq launchServiceReq, CommandResult commandResult) {
		this.launchServiceReq = launchServiceReq;
		this.commandResult = commandResult;
	}

	public LaunchServiceReq getLaunchServiceReq() {
		return launchServiceReq;
	}

	public void setLaunchServiceReq(LaunchServiceReq launchServiceReq) {
		this.launchServiceReq = launchServiceReq;
	}

	public CommandResult getCommandResult() {
		return commandResult;
	}

	public void setCommandResult(CommandResult commandResult) {
		this.commandResult = commandResult;
	}

	@Override
	public String toString() {
		return "LaunchServiceResponse [launchServiceReq=" + launchServiceReq + ", commandResult=" + commandResult + "]";
	}	
	
}
