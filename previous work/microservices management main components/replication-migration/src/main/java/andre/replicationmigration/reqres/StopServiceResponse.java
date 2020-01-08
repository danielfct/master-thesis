package andre.replicationmigration.reqres;

public class StopServiceResponse {
	
	private StopServiceReq stopServiceReq;
	private CommandResult commandResult;
	
	public StopServiceResponse() {
		
	}

	public StopServiceResponse(StopServiceReq stopServiceReq, CommandResult commandResult) {
		this.stopServiceReq = stopServiceReq;
		this.commandResult = commandResult;
	}

	public StopServiceReq getStopServiceReq() {
		return stopServiceReq;
	}

	public void setStopServiceReq(StopServiceReq stopServiceReq) {
		this.stopServiceReq = stopServiceReq;
	}

	public CommandResult getCommandResult() {
		return commandResult;
	}

	public void setCommandResult(CommandResult commandResult) {
		this.commandResult = commandResult;
	}

	@Override
	public String toString() {
		return "StopServiceResponse [stopServiceReq=" + stopServiceReq + ", commandResult=" + commandResult + "]";
	}
	
}
