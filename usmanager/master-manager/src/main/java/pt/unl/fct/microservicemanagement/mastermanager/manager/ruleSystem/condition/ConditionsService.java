package pt.unl.fct.microservicemanagement.mastermanager.manager.ruleSystem.condition;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.builder.ToStringBuilder;

@Slf4j
@org.springframework.stereotype.Service
public class ConditionsService {

  private final ConditionRepository conditions;

  public ConditionsService(ConditionRepository conditions) {
    this.conditions = conditions;
  }

  public Iterable<ConditionEntity> getConditions() {
    return conditions.findAll();
  }

  public ConditionEntity getCondition(Long id) {
    return conditions.findById(id).orElseThrow(() ->
        new EntityNotFoundException(ConditionEntity.class, "id", id.toString()));
  }

  public ConditionEntity getCondition(String conditionName) {
    return conditions.findByName(conditionName).orElseThrow(() ->
        new EntityNotFoundException(ConditionEntity.class, "conditionName", conditionName));
  }

  public ConditionEntity addCondition(ConditionEntity condition) {
    log.debug("Saving condition {}", ToStringBuilder.reflectionToString(condition));
    return conditions.save(condition);
  }

  public ConditionEntity updateCondition(String conditionName, ConditionEntity newCondition) {
    var condition = getCondition(conditionName);
    ObjectUtils.copyValidProperties(newCondition, condition);
    condition = conditions.save(condition);
    return condition;
  }

  public void deleteCondition(String conditionName) {
    var condition = getCondition(conditionName);
    conditions.delete(condition);
  }
  
}
