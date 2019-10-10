package andre.replicationmigration.reqres;

import java.util.List;

public class CommandResult {

	private String command;
	private List<String> result;
	private String resultStatus;
	
	public CommandResult(){}

	public CommandResult(String command, List<String> result, String resultStatus) {
		this.command = command;
		this.result = result;
		this.resultStatus = resultStatus;
	}

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	public List<String> getResult() {
		return result;
	}

	public void setResult(List<String> result) {
		this.result = result;
	}

	public String getResultStatus() {
		return resultStatus;
	}

	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus;
	}

	@Override
	public String toString() {
		return "CommandResult [command=" + command + ", result=" + result + ", resultStatus=" + resultStatus + "]";
	}

	
	
}
