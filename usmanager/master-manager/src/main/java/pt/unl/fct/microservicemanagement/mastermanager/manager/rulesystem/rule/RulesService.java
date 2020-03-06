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

package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rule;

import org.springframework.context.annotation.Lazy;
import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.ContainerEvent;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.Event;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.HostEvent;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metric.FieldEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metric.FieldRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metric.ValueModeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.metric.ValueModeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.ComponentTypeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.ComponentTypeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.Condition;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionReq;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.ContainerDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.Decision;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.HostDecisionResult;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.RuleDecision;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServicesService;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.drools.core.event.DefaultAgendaEventListener;
import org.drools.template.ObjectDataCompiler;
import org.kie.api.KieServices;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.event.rule.AfterMatchFiredEvent;
import org.kie.api.event.rule.AgendaEventListener;
import org.kie.api.io.Resource;
import org.kie.api.runtime.StatelessKieSession;
import org.kie.api.runtime.rule.Match;
import org.springframework.cache.annotation.Cacheable;

@Slf4j
@org.springframework.stereotype.Service
public class RulesService {

  // TODO split into multiple services
  // TODO replace returning nulls by throwing NotFoundException

  private final RuleRepository rules;
  private final RuleConditionRepository ruleConditions;
  private final AppRuleRepository appRules;
  private final ServiceRuleRepository serviceRules;
  private final GenericHostRuleRepository genericHostRules;
  private final HostRuleRepository hostRules;
  private final FieldRepository fields;
  private final OperatorRepository operators;
  private final ComponentTypeRepository componentTypes;
  private final DecisionsService decisions;
  private final ConditionRepository conditions;
  private final ValueModeRepository valueModes;

  private final ServicesService servicesService;

  private final String containerRuleTemplateFile;
  private final String hostRuleTemplateFile;
  private AtomicLong lastUpdateHostRules;
  private AtomicLong lastUpdateAppRules;
  private final Map<String, StatelessKieSession> hostRuleSessions;
  private final Map<String, StatelessKieSession> serviceRuleSessions;
  private final Map<String, Long> lastUpdateRules;

  public RulesService(RuleRepository ruleRepo, RuleConditionRepository ruleConditionRepo,
                      AppRuleRepository appRuleRepo, ServiceRuleRepository serviceRuleRepo,
                      GenericHostRuleRepository genericHostRuleRepo, HostRuleRepository hostRuleRepo,
                      FieldRepository fieldRepo, OperatorRepository operatorRepo,
                      ComponentTypeRepository componentTypeRepo, DecisionsService decisions,
                      ConditionRepository conditionRepo, ValueModeRepository valueModeRepo,
                      @Lazy ServicesService servicesService,
                      RulesProperties rulesProperties) {
    this.rules = ruleRepo;
    this.ruleConditions = ruleConditionRepo;
    this.appRules = appRuleRepo;
    this.serviceRules = serviceRuleRepo;
    this.genericHostRules = genericHostRuleRepo;
    this.hostRules = hostRuleRepo;
    this.fields = fieldRepo;
    this.operators = operatorRepo;
    this.componentTypes = componentTypeRepo;
    this.decisions = decisions;
    this.conditions = conditionRepo;
    this.valueModes = valueModeRepo;
    this.servicesService = servicesService;
    this.containerRuleTemplateFile = rulesProperties.getContainerRuleTemplateFile();
    this.hostRuleTemplateFile = rulesProperties.getHostRuleTemplateFile();
    this.lastUpdateHostRules = new AtomicLong(0);
    this.lastUpdateAppRules = new AtomicLong(0);
    this.hostRuleSessions = new HashMap<>();
    this.serviceRuleSessions = new HashMap<>();
    this.lastUpdateRules = new HashMap<>();
  }

  private void setLastUpdateHostRules() {
    long currTime = System.currentTimeMillis();
    lastUpdateHostRules.getAndSet(currTime);
  }

  private void setLastUpdateAppRules() {
    long currTime = System.currentTimeMillis();
    lastUpdateAppRules.getAndSet(currTime);
  }

  public Iterable<RuleEntity> getRules() {
    return rules.findAll();
  }

  public RuleEntity getRule(long id) {
    return rules.findById(id).orElseThrow(() -> new NotFoundException("Rule not found"));
  }

  public RuleEntity getRule(String name) {
    return rules.findByNameIgnoreCase(name).orElseThrow(() -> new NotFoundException("Rule not found"));
  }

  /*public long addRuleRule rule, long componentTypeId, long decisionId) {
    final var componentType = getComponentType(componentTypeId);
    final var decision = decisions.getDecision(decisionId);
    rule.setComponentType(componentType);
    rule.setDecision(decision);
    final var id = ruleRepo.save(rule).getId();
    setLastUpdateHostRules();
    setLastUpdateAppRules();
    return id;
  }

  public long updateRulelong id, Rule newRule, long componentTypeId, long decisionId) {
    final var rule = getRule(id);
    Utils.copyValidProperties(newRule, rule);

    ComponentType componentType = getComponentType(ruleReq.getComponentTypeId());
    Decision decision = decisions.getDecision(ruleReq.getDecisionId());
    rule.setRuleName(ruleReq.getRuleName());
    rule.setComponentType(componentType);
    rule.setDecision(decision);
    rule.setPriority(ruleReq.getPriority());
    long ruleId = ruleRepo.save(rule).getId();

    setLastUpdateHostRules();
    setLastUpdateAppRules();

    return ruleId;
  }*/

  public long saveRule(long id, RuleReq ruleReq) {
    final RuleEntity rule = id > 0 ? getRule(id) : new RuleEntity();
    rule.setName(ruleReq.getRuleName());
    final var componentType = getComponentType(ruleReq.getComponentTypeId());
    rule.setComponentType(componentType);
    final var decision = decisions.getDecision(ruleReq.getDecisionId());
    rule.setDecision(decision);
    rule.setPriority(ruleReq.getPriority());
    long ruleId = rules.save(rule).getId();
    setLastUpdateHostRules();
    setLastUpdateAppRules();
    return ruleId;
  }

  public void deleteRule(long id) {
    final var rule = getRule(id);
    rules.delete(rule);
    setLastUpdateHostRules();
    setLastUpdateAppRules();
  }

  public List<RuleEntity> getHostRules() {
    return rules.getRulesByComponentType("Host");
  }

  public List<RuleEntity> getContainerRules() {
    return rules.getRulesByComponentType("Container");
  }


  //TODO move to ValueModesService
  public Iterable<ValueModeEntity> getValueModes() {
    return valueModes.findAll();
  }

  private ValueModeEntity getValueMode(long id) {
    return valueModes.findById(id).orElseThrow(() -> new NotFoundException("Value mode not found"));
  }

  //TODO move to FieldsService
  public Iterable<FieldEntity> getFields() {
    return fields.findAll();
  }

  public FieldEntity getField(long id) {
    return fields.findById(id).orElseThrow(() -> new NotFoundException("Field not found"));
  }

  //TODO move to OperatorsService
  public Iterable<OperatorEntity> getOperators() {
    return operators.findAll();
  }

  private OperatorEntity getOperator(long id) {
    return operators.findById(id).orElseThrow(() -> new NotFoundException("Operator not found"));
  }

  //TODO move to ComponentTypesService
  public Iterable<ComponentTypeEntity> getComponentTypes() {
    return componentTypes.findAll();
  }

  private ComponentTypeEntity getComponentType(long id) {
    return componentTypes.findById(id).orElseThrow(() -> new NotFoundException("Component type not found"));
  }

  //TODO move to ConditionsService
  public Iterable<ConditionEntity> getConditions() {
    return conditions.findAll();
  }

  public ConditionEntity getCondition(long id) {
    return conditions.findById(id).orElseThrow(() -> new NotFoundException("Condition not found"));
  }

  public List<ConditionEntity> getRuleConditions(long ruleId) {
    return ruleConditions.getConditionsByRuleId(ruleId);
  }

  public long addConditionToRule(long ruleId, long conditionId) {
    var ruleCondition = ruleConditions.getRuleConditionByRuleIdAndConditionId(ruleId, conditionId);
    final long id;
    if (ruleCondition == null) {
      ruleCondition = new RuleConditionEntity();
      RuleEntity rule = getRule(ruleId);
      ConditionEntity condition = getCondition(conditionId);
      ruleCondition.setRule(rule);
      ruleCondition.setCondition(condition);
      id = ruleConditions.save(ruleCondition).getId();
    } else {
      id = ruleCondition.getId();
    }
    setLastUpdateHostRules();
    setLastUpdateAppRules();
    return id;
  }

  public long deleteConditionFromRule(long ruleId, long conditionId) {
    final var ruleCondition = ruleConditions.getRuleConditionByRuleIdAndConditionId(ruleId, conditionId);
    long id = 0;
    if (ruleCondition != null) {
      ruleConditions.delete(ruleCondition);
      id = ruleCondition.getId();
    }
    setLastUpdateHostRules();
    setLastUpdateAppRules();
    return id;
  }

  public long saveCondition(long id, ConditionReq conditionReq) {
    var valueMode = getValueMode(conditionReq.getValueModeId());
    var field = getField(conditionReq.getFieldId());
    var operator = getOperator(conditionReq.getOperatorId());
    var value = conditionReq.getConditionValue();
    var condition = (id > 0 ? getCondition(id).toBuilder() : ConditionEntity.builder())
        .valueMode(valueMode)
        .field(field)
        .operator(operator)
        .conditionValue(value);
    setLastUpdateHostRules();
    setLastUpdateAppRules();
    return conditions.save(condition.build()).getId();
  }

  public void deleteCondition(long id) {
    final var condition = getCondition(id);
    conditions.delete(condition);
    setLastUpdateHostRules();
    setLastUpdateAppRules();
  }


  public List<AppRule> getAppRulesByAppId(long appId) {
    return appRules.getAppRulesByAppId(appId);
  }

  public boolean deleteAppRule(long appId, long ruleId) {
    AppRule appRule = appRules.getAppRuleByAppIdAndRuleId(appId, ruleId);
    boolean success = false;
    if (appRule != null) {
      appRules.delete(appRule);
      success = true;
    }
    setLastUpdateAppRules();
    return success;
  }

  public List<ServiceRuleEntity> getServiceRulesByServiceId(long serviceId) {
    return serviceRules.getServiceRulesByServiceId(serviceId);
  }

  private List<ServiceRuleEntity> getServiceRulesByServiceName(String serviceName) {
    return serviceRules.getServiceRulesByServiceName(serviceName);
  }

  public long saveServiceRule(long serviceId, long ruleId) {
    var serviceRule = serviceRules.getServiceRuleByServiceIdAndRuleId(serviceId, ruleId);
    final long id;
    if (serviceRule != null) {
      id = serviceRule.getId();
    } else {
      serviceRule = new ServiceRuleEntity();
      final var service = servicesService.getService(serviceId);
      serviceRule.setService(service);
      final var rule = getRule(ruleId);
      serviceRule.setRule(rule);
      id = serviceRules.save(serviceRule).getId();
    }
    setLastUpdateAppRules();
    return id;
  }

  public boolean deleteServiceRule(long serviceId, long ruleId) {
    final var serviceRule = serviceRules.getServiceRuleByServiceIdAndRuleId(serviceId, ruleId);
    boolean success = false;
    if (serviceRule != null) {
      serviceRules.delete(serviceRule);
      success = true;
    }
    setLastUpdateAppRules();
    return success;
  }

  public List<HostRule> getHostRulesByHostname(String hostname) {
    return hostRules.getHostRulesByHostname(hostname);
  }

  public long saveHostRule(String hostname, long ruleId) {
    var hostRule = hostRules.getHostRuleByHostnameAndRuleId(hostname, ruleId);
    final long id;
    if (hostRule != null) {
      id = hostRule.getId();
    } else {
      hostRule = new HostRule();
      hostRule.setHostname(hostname);
      final var rule = getRule(ruleId);
      hostRule.setRule(rule);
      id = hostRules.save(hostRule).getId();
    }
    setLastUpdateHostRules();
    return id;
  }

  public boolean deleteHostRule(String hostname, long ruleId) {
    final var hostRule = hostRules.getHostRuleByHostnameAndRuleId(hostname, ruleId);
    boolean success = false;
    if (hostRule != null) {
      hostRules.delete(hostRule);
      success = true;
    }
    setLastUpdateHostRules();

    return success;
  }

  public Iterable<GenericHostRuleEntity> getGenericHostRules() {
    return genericHostRules.findAll();
  }

  public long saveGenericHostRule(long ruleId) {
    var genericHostRule = genericHostRules.getGenericHostRuleByRuleId(ruleId);
    final long id;
    if (genericHostRule != null) {
      id = genericHostRule.getId();
    } else {
      genericHostRule = new GenericHostRuleEntity();
      final var rule = getRule(ruleId);
      genericHostRule.setRule(rule);
      id = genericHostRules.save(genericHostRule).getId();
    }
    setLastUpdateHostRules();
    return id;
  }

  public boolean deleteGenericHostRule(long ruleId) {
    final var genericHostRule = genericHostRules.getGenericHostRuleByRuleId(ruleId);
    boolean success = false;
    if (genericHostRule != null) {
      genericHostRules.delete(genericHostRule);
      success = true;
    }
    setLastUpdateHostRules();
    return success;
  }


  // RULE_SERVICE

  public ContainerDecisionResult processContainerEvent(long appId, String serviceHostname,
                                                       ContainerEvent containerEvent) {
    final var serviceName = containerEvent.getServiceName();
    if (shouldCreateNewRuleSession(serviceName, lastUpdateAppRules.get())) {
      List<Rule> rulesList = generateRulesByService(appId, serviceName);
      Map<Long, String> drls = executeDrlsRules(containerEvent, rulesList, containerRuleTemplateFile);
      createNewServiceRuleSession(serviceName, drls);
    }
    return evaluate(serviceHostname, containerEvent);
  }

  public HostDecisionResult processHostEvent(String hostname, HostEvent hostEvent) {
    if (shouldCreateNewRuleSession(hostname, lastUpdateHostRules.get())) {
      List<Rule> rulesList = generateHostRulesByHostname(hostname);
      Map<Long, String> drls = executeDrlsRules(hostEvent, rulesList, hostRuleTemplateFile);
      createNewHostRuleSession(hostname, drls);
    }
    return evaluate(hostEvent);
  }

  private Map<Long, String> executeDrlsRules(Event event, List<Rule> rulesList, String templateFile) {
    final var drls = new HashMap<Long, String>();
    //try {
    for (Rule rule : rulesList) {
      String drl = applyRuleTemplate(event, rule, templateFile);
      drls.put(rule.getId(), drl);
    }
    //} catch (Exception e) {
    //  e.printStackTrace();
    //}
    return drls;
  }

  private boolean shouldCreateNewRuleSession(String key, long lastUpdate) {
    final long currVal = lastUpdateRules.getOrDefault(key, -1L);
    if (currVal < lastUpdate) {
      lastUpdateRules.put(key, lastUpdate);
      return true;
    }
    return false;
  }

  private void createNewServiceRuleSession(String serviceName, Map<Long, String> drls) {
    KieServices kieServices = KieServices.Factory.get();
    KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
    for (Map.Entry<Long, String> drl : drls.entrySet()) {
      Resource resource = kieServices.getResources().newByteArrayResource(drl.getValue().getBytes());
      resource.setTargetPath("rules/rule_container_" + drl.getKey() + ".drl");
      kieFileSystem.write(resource);
    }
    kieServices.newKieBuilder(kieFileSystem).buildAll();
    final var serviceRuleSession = newStatelessKieSession(kieServices);
    serviceRuleSessions.put(serviceName, serviceRuleSession);
  }

  private void createNewHostRuleSession(String hostname, Map<Long, String> drls) {
    final var kieServices = KieServices.Factory.get();
    final var kieFileSystem = kieServices.newKieFileSystem();
    for (Map.Entry<Long, String> drl : drls.entrySet()) {
      final var resource = kieServices.getResources().newByteArrayResource(drl.getValue().getBytes());
      resource.setTargetPath("rules/rule_host_" + drl.getKey() + ".drl");
      kieFileSystem.write(resource);
    }
    kieServices.newKieBuilder(kieFileSystem).buildAll();
    final var hostRuleSession = newStatelessKieSession(kieServices);
    hostRuleSessions.put(hostname, hostRuleSession);
  }

  private StatelessKieSession newStatelessKieSession(KieServices kieServices) {
    final var kieContainer = kieServices.newKieContainer(kieServices.getRepository().getDefaultReleaseId());
    final var serviceRuleSession = kieContainer.getKieBase().newStatelessKieSession();
    final var agendaEventListener = new TrackingAgendaEventListener();
    serviceRuleSession.addEventListener(agendaEventListener);
    return serviceRuleSession;
  }

  private ContainerDecisionResult evaluate(String serviceHostname, ContainerEvent event) {
    final var containerDecision = new Decision();
    final StatelessKieSession serviceRuleSession = serviceRuleSessions.get(event.getServiceName());
    serviceRuleSession.getGlobals().set("containerDecision", containerDecision);
    serviceRuleSession.execute(event);
    final var ruleId = getRuleFired(new ArrayList<>(serviceRuleSession.getAgendaEventListeners()));
    return new ContainerDecisionResult(serviceHostname, event.getContainerId(), event.getServiceName(),
        containerDecision.getDecision(), ruleId, event.getFields(), containerDecision.getPriority());
  }

  private HostDecisionResult evaluate(HostEvent event) {
    final var hostDecision = new Decision();
    final var hostname = event.getHostname();
    final StatelessKieSession hostRuleSession = hostRuleSessions.get(hostname);
    hostRuleSession.getGlobals().set("hostDecision", hostDecision);
    hostRuleSession.execute(event);
    final long ruleId = getRuleFired(new ArrayList<>(hostRuleSession.getAgendaEventListeners()));
    return new HostDecisionResult(hostname, hostDecision.getDecision(), ruleId, event.getFields(),
        hostDecision.getPriority());
  }

  private long getRuleFired(List<AgendaEventListener> agendaEvents) {
    if (agendaEvents.isEmpty()) {
      return 0;
    }
    final var agendaEvent = (TrackingAgendaEventListener) agendaEvents.get(0);
    final var matchList = agendaEvent.getMatchList();
    if (matchList.isEmpty()) {
      return 0;
    }
    final var ruleNameSplit = matchList.get(0).getRule().getName().split("_");
    agendaEvent.reset();
    return Long.parseLong(ruleNameSplit[2]);
  }

  private String applyRuleTemplate(Event event, Rule rule, String templateFile) {
    final var data = Map.of(
        "ruleId", rule.getId(),
        "rule", rule,
        "eventType", event.getClass().getName(),
        "decision", RuleDecision.class.getSimpleName() + "." + rule.getDecision().toString(),
        "priority", rule.getPriority());
    final var ruleTemplate = new ByteArrayInputStream(getRuleTemplate(templateFile)
        .getBytes(StandardCharsets.UTF_8));
    return new ObjectDataCompiler().compile(List.of(data), ruleTemplate);
  }

  //RULE_GENERATION

  private List<Rule> generateGenericHostRules() {
    Iterable<GenericHostRuleEntity> genericHostRulesList = getGenericHostRules();
    var rulesList = new ArrayList<Rule>();
    genericHostRulesList.forEach(rule -> rulesList.add(generateRule(rule.getRule())));
    return rulesList;
  }

  private List<Rule> generateHostRulesByHostname(String hostname) {
    final List<HostRule> hostRulesList = getHostRulesByHostname(hostname);
    final List<Rule> genericRules = generateGenericHostRules();
    final var rulesList = new ArrayList<Rule>(hostRulesList.size() + genericRules.size());
    rulesList.addAll(genericRules);
    hostRulesList.forEach(rule -> rulesList.add(generateRule(rule.getRule())));
    log.info("Generating host rules... (count: " + rulesList.size() + ")");
    return rulesList;
  }

  private List<Rule> generateRulesByApp(long appId) {
    final List<AppRule> appRulesList = getAppRulesByAppId(appId);
    final List<Rule> rulesList = new ArrayList<>(appRulesList.size());
    appRulesList.forEach(appRule -> rulesList.add(generateRule(appRule.getRule())));
    log.info("Generating app rules... (count: " + rulesList.size() + ")");
    return rulesList;
  }

  private List<Rule> generateRulesByService(long appId, String serviceName) {
    List<ServiceRuleEntity> serviceRulesList = getServiceRulesByServiceName(serviceName);
    List<Rule> rulesList = generateRulesByApp(appId);
    serviceRulesList.forEach(rule -> rulesList.add(generateRule(rule.getRule())));
    log.info("Generating service rules... (count: " + rulesList.size() + ")");
    return rulesList;
  }

  private Rule generateRule(RuleEntity ruleEntity) {
    RuleDecision decision = RuleDecision.fromValue(ruleEntity.getDecision().getDecisionName());
    int priority = ruleEntity.getPriority();
    List<ConditionEntity> conditionsEntities = getRuleConditions(ruleEntity.getId());
    var conditionsList = new ArrayList<Condition>(conditionsEntities.size());
    for (var conditionEntity : conditionsEntities) {
      double value = conditionEntity.getConditionValue();
      String valueModeName = conditionEntity.getValueMode().getValueModeName();
      var fieldName = String.format("%s-%S", conditionEntity.getField().getName(), valueModeName);
      var operator = Operator.fromValue(conditionEntity.getOperator().getName());
      var condition = new Condition(fieldName, value, operator);
      conditionsList.add(condition);
    }
    var rule = new Rule(ruleEntity.getId(), decision, priority);
    rule.setConditions(conditionsList);
    return rule;
  }

  @Cacheable(cacheNames = "ruleTemplateCache", key = "#templateFile")
  public String getRuleTemplate(String templateFile) {
    log.info("Getting rule template...");
    InputStream ruleTemplate = Thread.currentThread().getContextClassLoader().getResourceAsStream(templateFile);
    var result = new ByteArrayOutputStream();
    var buffer = new byte[1024];
    int length;
    try {
      while ((length = ruleTemplate.read(buffer)) != -1) {
        result.write(buffer, 0, length);
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
    return result.toString(StandardCharsets.UTF_8);
  }

  @Getter
  static final class TrackingAgendaEventListener extends DefaultAgendaEventListener {

    private final List<Match> matchList;

    TrackingAgendaEventListener() {
      matchList = new LinkedList<>();
    }

    @Override
    public void afterMatchFired(AfterMatchFiredEvent event) {
      matchList.add(event.getMatch());
    }

    public boolean isRuleFired(String ruleName) {
      return matchList.stream()
          .map(Match::getRule).map(org.kie.api.definition.rule.Rule::getName)
          .anyMatch(n -> Objects.equals(n, ruleName));
    }

    public void reset() {
      matchList.clear();
    }

    @Override
    public String toString() {
      return matchList.isEmpty()
          ? "No matches occurred."
          : "Matches: " + matchList.stream().map(m -> "\n  rule: "
          + m.getRule().getName()).collect(Collectors.joining());
    }

  }

}
