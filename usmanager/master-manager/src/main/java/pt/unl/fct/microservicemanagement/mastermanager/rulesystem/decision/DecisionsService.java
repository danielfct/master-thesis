/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.ComponentTypeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.FieldRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.ComponentTypeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RulesService;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleEntity;

@org.springframework.stereotype.Service
@Slf4j
public class DecisionsService {

  private final DecisionRepository decisions;
  private final ComponentTypeRepository componentTypes;
  private final ComponentDecisionLogRepository componentDecisionLogs;
  private final ComponentDecisionServiceLogRepository componentDecisionServiceLogs;
  private final ComponentDecisionHostLogRepository componentDecisionHostLogs;
  private final ComponentDecisionValueLogRepository componentDecisionValueLogs;
  private final RulesService rulesService;
  private final FieldRepository fields;

  public DecisionsService(DecisionRepository decisions, ComponentTypeRepository componentTypes,
                          ComponentDecisionLogRepository componentDecisionLogs,
                          ComponentDecisionServiceLogRepository componentDecisionServiceLogs,
                          ComponentDecisionHostLogRepository componentDecisionHostLogs,
                          ComponentDecisionValueLogRepository componentDecisionValueLogs,
                          @Lazy RulesService rulesService, FieldRepository fields) {
    this.decisions = decisions;
    this.componentTypes = componentTypes;
    this.componentDecisionLogs = componentDecisionLogs;
    this.componentDecisionServiceLogs = componentDecisionServiceLogs;
    this.componentDecisionHostLogs = componentDecisionHostLogs;
    this.componentDecisionValueLogs = componentDecisionValueLogs;
    this.rulesService = rulesService;
    this.fields = fields;
  }

  public Iterable<DecisionEntity> getDecisions() {
    return decisions.findAll();
  }

  public DecisionEntity getDecision(long id) {
    return decisions.findById(id).orElseThrow(() -> new NotFoundException("Decision not found"));
  }

  public List<DecisionEntity> getHostDecisions() {
    return decisions.getDecisionsByComponentType("HOST");
  }

  public List<DecisionEntity> getContainerDecisions() {
    return decisions.getDecisionsByComponentType("CONTAINER");
  }

  public DecisionEntity getDecisionByComponentTypeAndByDecisionName(String componentTypeName, String decisionName) {
    return decisions.getDecisionByComponentTypeAndByDecisionName(componentTypeName, decisionName);
  }

  public ComponentDecisionServiceLog saveComponentDecisionServiceLog(String containerId, String serviceName,
                                                                     String decision, long ruleId, String otherInfo) {
    var componentDecisionLog = saveComponentDecisionLog("CONTAINER", decision, ruleId);
    var componentDecisionServiceLog = ComponentDecisionServiceLog.builder()
        .componentDecisionLog(componentDecisionLog).containerId(containerId).serviceName(serviceName)
        .otherInfo(otherInfo).build();
    return componentDecisionServiceLogs.save(componentDecisionServiceLog);
  }

  public ComponentDecisionHostLog saveComponentDecisionHostLog(String hostname, String decision, long ruleId) {
    final var componentDecisionLog = saveComponentDecisionLog("HOST", decision, ruleId);
    final var componentDecisionHostLog = ComponentDecisionHostLog.builder().componentDecisionLog(componentDecisionLog)
        .hostname(hostname).build();
    return componentDecisionHostLogs.save(componentDecisionHostLog);
  }

  private ComponentDecisionLog saveComponentDecisionLog(String componentTypeName, String decisionName, long ruleId) {
    ComponentTypeEntity componentType = componentTypes.findByComponentTypeName(componentTypeName);
    DecisionEntity decision = decisions.getDecisionByComponentTypeAndByDecisionName(componentTypeName, decisionName);
    RuleEntity rule = rulesService.getRule(ruleId);
    var timestamp = Timestamp.from(Instant.now());
    var componentDecisionLog = ComponentDecisionLog.builder().componentType(componentType).decision(decision).rule(rule)
        .timestamp(timestamp).build();
    return componentDecisionLogs.save(componentDecisionLog);
  }

  public void saveComponentDecisionValueLogsFromFields(ComponentDecisionLog componentDecisionLog,
                                                       final Map<String, Double> fieldsValues) {
    final var componentDecisionValueLogsList = fieldsValues.entrySet().stream()
        .filter(fieldValue -> fieldValue.getKey().contains("effective-val"))
        .map(fieldValue ->
            ComponentDecisionValueLog.builder()
                .componentDecisionLog(componentDecisionLog)
                .field(fields.findByFieldName(fieldValue.getKey().split("-effective-val")[0]))
                .componentValue(fieldValue.getValue())
                .build())
        .collect(Collectors.toList());
    componentDecisionValueLogs.saveAll(componentDecisionValueLogsList);
  }

  public List<ComponentDecisionServiceLog> getComponentDecisionServiceLogByServiceName(String serviceName) {
    return componentDecisionServiceLogs.findByServiceName(serviceName);
  }

  public List<ComponentDecisionServiceLog> getComponentDecisionServiceLogByContainerId(String containerId) {
    return componentDecisionServiceLogs.findByServiceName(containerId);
  }

}
