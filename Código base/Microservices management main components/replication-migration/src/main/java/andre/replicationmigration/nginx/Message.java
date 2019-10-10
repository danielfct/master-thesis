package andre.replicationmigration.nginx;

public class Message {

    private String message;

    public Message() {
    }

    public Message(String message) {
        this.message = message;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

}