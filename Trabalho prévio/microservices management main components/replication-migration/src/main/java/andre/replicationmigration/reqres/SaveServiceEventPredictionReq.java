package andre.replicationmigration.reqres;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;

import org.springframework.util.StringUtils;

public class SaveServiceEventPredictionReq {

    private long serviceId;
    private String description;
    private String startDate;
    private String startTime;
    private String endDate;
    private String endTime;
    private int minReplics;

    public SaveServiceEventPredictionReq() {

    }

    public SaveServiceEventPredictionReq(long serviceId, String description, String startDate, String startTime,
            String endDate, String endTime, int minReplics) {
        this.serviceId = serviceId;
        this.description = description;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.minReplics = minReplics;
    }

    /**
     * @return the serviceId
     */
    public long getServiceId() {
        return serviceId;
    }

    /**
     * @param serviceId the serviceId to set
     */
    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the startDate
     */
    public String getStartDate() {
        return startDate;
    }

    /**
     * @param startDate the startDate to set
     */
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the startTime
     */
    public String getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endDate
     */
    public String getEndDate() {
        return endDate;
    }

    /**
     * @param endDate the endDate to set
     */
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    /**
     * @return the endTime
     */
    public String getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    /**
     * @return the minReplics
     */
    public int getMinReplics() {
        return minReplics;
    }

    /**
     * @param minReplics the minReplics to set
     */
    public void setMinReplics(int minReplics) {
        this.minReplics = minReplics;
    }

    public Timestamp getStartDateTimeStamp() {
        int count = StringUtils.countOccurrencesOf(startTime, ":");
        String saveStartTime = count == 1 ? startTime + ":00" : startTime;
        return getTimeStamp(startDate, saveStartTime);
    }

    public Timestamp getEndDateTimeStamp() {
        int count = StringUtils.countOccurrencesOf(endTime, ":");
        String saveEndTime = count == 1 ? endTime + ":00" : endTime;
        return getTimeStamp(endDate, saveEndTime);
    }

    private Timestamp getTimeStamp(String date, String time) {
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        SimpleDateFormat simpleStartDate = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
        try {
            Instant instant = simpleStartDate.parse(date + " " + time).toInstant();
            timestamp = Timestamp.from(instant);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return timestamp;
    }
}