package andre.replicationmigration.reqres;

public class ConditionReq {

    private long valueModeId;
    private long fieldId;
    private long operatorId;
    private double conditionValue;

    public ConditionReq() {
    }

    public ConditionReq(long valueModeId, long fieldId, long operatorId, double conditionValue) {
        this.valueModeId = valueModeId;
        this.fieldId = fieldId;
        this.operatorId = operatorId;
        this.conditionValue = conditionValue;
    }

    /**
     * @return the valueModeId
     */
    public long getValueModeId() {
        return valueModeId;
    }

    /**
     * @param valueModeId the valueModeId to set
     */
    public void setValueModeId(long valueModeId) {
        this.valueModeId = valueModeId;
    }

    /**
     * @return the fieldId
     */
    public long getFieldId() {
        return fieldId;
    }

    /**
     * @param fieldId the fieldId to set
     */
    public void setFieldId(long fieldId) {
        this.fieldId = fieldId;
    }

    /**
     * @return the operatorId
     */
    public long getOperatorId() {
        return operatorId;
    }

    /**
     * @param operatorId the operatorId to set
     */
    public void setOperatorId(long operatorId) {
        this.operatorId = operatorId;
    }

    /**
     * @return the conditionValue
     */
    public double getConditionValue() {
        return conditionValue;
    }

    /**
     * @param conditionValue the conditionValue to set
     */
    public void setConditionValue(double conditionValue) {
        this.conditionValue = conditionValue;
    }

}