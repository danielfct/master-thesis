package andre.replicationmigration.services.rules;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.model.rules.AppRule;
import andre.replicationmigration.model.rules.ComponentDecisionHostLog;
import andre.replicationmigration.model.rules.ComponentDecisionLog;
import andre.replicationmigration.model.rules.ComponentDecisionServiceLog;
import andre.replicationmigration.model.rules.ComponentDecisionValueLog;
import andre.replicationmigration.model.rules.Condition;
import andre.replicationmigration.model.rules.Decision;
import andre.replicationmigration.model.rules.Field;
import andre.replicationmigration.model.rules.GenericHostRule;
import andre.replicationmigration.model.rules.HostEventLog;
import andre.replicationmigration.model.rules.HostRule;
import andre.replicationmigration.model.rules.Operator;
import andre.replicationmigration.model.rules.Rule;
import andre.replicationmigration.model.rules.RuleCondition;
import andre.replicationmigration.model.rules.ServiceEventLog;
import andre.replicationmigration.model.rules.ServiceRule;
import andre.replicationmigration.model.rules.ComponentType;
import andre.replicationmigration.model.rules.ValueMode;
import andre.replicationmigration.repositories.AppPackageRepository;
import andre.replicationmigration.repositories.ServiceConfigRepository;
import andre.replicationmigration.repositories.rules.AppRuleRepository;
import andre.replicationmigration.repositories.rules.ComponentDecisionHostLogRepository;
import andre.replicationmigration.repositories.rules.ComponentDecisionLogRepository;
import andre.replicationmigration.repositories.rules.ComponentDecisionServiceLogRepository;
import andre.replicationmigration.repositories.rules.ComponentDecisionValueLogRepository;
import andre.replicationmigration.repositories.rules.ConditionRepository;
import andre.replicationmigration.repositories.rules.DecisionRepository;
import andre.replicationmigration.repositories.rules.FieldRepository;
import andre.replicationmigration.repositories.rules.GenericHostRuleRepository;
import andre.replicationmigration.repositories.rules.HostEventLogRepository;
import andre.replicationmigration.repositories.rules.HostRuleRepository;
import andre.replicationmigration.repositories.rules.OperatorRepository;
import andre.replicationmigration.repositories.rules.RuleConditionRepository;
import andre.replicationmigration.repositories.rules.RuleRepository;
import andre.replicationmigration.repositories.rules.ServiceEventLogRepository;
import andre.replicationmigration.repositories.rules.ServiceRuleRepository;
import andre.replicationmigration.repositories.rules.ComponentTypeRepository;
import andre.replicationmigration.repositories.rules.ValueModeRepository;
import andre.replicationmigration.reqres.ConditionReq;
import andre.replicationmigration.reqres.RuleReq;

@Service
public class RuleDataService {

    @Autowired
    private FieldRepository fieldRepo;

    @Autowired
    private OperatorRepository operatorRepo;

    @Autowired
    private ComponentTypeRepository componentTypeRepo;

    @Autowired
    private DecisionRepository decisionRepo;

    @Autowired
    private RuleRepository ruleRepo;

    @Autowired
    private ConditionRepository conditionRepo;

    @Autowired
    private RuleConditionRepository ruleConditionRepo;

    @Autowired
    private AppRuleRepository appRuleRepo;

    @Autowired
    private ServiceRuleRepository serviceRuleRepo;

    @Autowired
    private AppPackageRepository appPackageRepo;

    @Autowired
    private ServiceConfigRepository serviceConfigRepo;

    @Autowired
    private ValueModeRepository valueModeRepo;

    @Autowired
    private HostRuleRepository hostRuleRepo;

    @Autowired
    private GenericHostRuleRepository genericHostRuleRepo;

    @Autowired
    private ComponentDecisionLogRepository componentDecisionLogRepo;

    @Autowired
    private ComponentDecisionServiceLogRepository componentDecisionServiceLogRepo;

    @Autowired
    private ComponentDecisionHostLogRepository componentDecisionHostLogRepo;

    @Autowired
    private ComponentDecisionValueLogRepository componentDecisionValueLogRepo;

    @Autowired
    private HostEventLogRepository hostEventLogRepo;

    @Autowired
    private ServiceEventLogRepository serviceEventLogRepo;

    private AtomicLong lastUpdateHostRules;
    private AtomicLong lastUpdateAppRules;

    public RuleDataService() {
        this.lastUpdateHostRules = new AtomicLong(0);
        this.lastUpdateAppRules = new AtomicLong(0);
    }

    public long getLastUpdateHostRules() {
        return lastUpdateHostRules.get();
    }

    private void setLastUpdateHostRules() {
        long currTime = System.currentTimeMillis();
        lastUpdateHostRules.getAndSet(currTime);
    }

    public long getLastUpdateAppRules() {
        return lastUpdateAppRules.get();
    }

    private void setLastUpdateAppRules() {
        long currTime = System.currentTimeMillis();
        lastUpdateAppRules.getAndSet(currTime);
    }

    public Iterable<ValueMode> getValueModes() {
        return valueModeRepo.findAll();
    }

    public Iterable<Field> getFields() {
        return fieldRepo.findAll();
    }

    public Field getFieldsByName(String name) {
        List<Field> fields = fieldRepo.findByFieldName(name);
        if (fields.isEmpty())
            return null;

        return fields.get(0);
    }

    public Iterable<Operator> getOperators() {
        return operatorRepo.findAll();
    }

    public Iterable<ComponentType> getComponentTypes() {
        return componentTypeRepo.findAll();
    }

    public Iterable<Decision> getDecisions() {
        return decisionRepo.findAll();
    }

    public List<Decision> getHostDecisions() {
        return decisionRepo.getDecisionsByComponentType("HOST");
    }

    public List<Decision> getContainerDecisions() {
        return decisionRepo.getDecisionsByComponentType("CONTAINER");
    }

    private Decision getDecisionsByComponentTypeAndByDecisionName(String componentTypeName, String decisionName) {
        List<ComponentType> componentTypes = componentTypeRepo.findByComponentTypeName(componentTypeName);
        if (!componentTypes.isEmpty()) {
            List<Decision> decisions = decisionRepo.getDecisionsByComponentTypeAndByDecisionName(componentTypeName,
                    decisionName);
            if (!decisions.isEmpty())
                return decisions.get(0);
        }
        return null;
    }

    public Iterable<Rule> getRules() {
        return ruleRepo.findAll();
    }

    public List<Rule> getHostRules() {
        return ruleRepo.getRulesByComponentType("HOST");
    }

    public List<Rule> getContainerRules() {
        return ruleRepo.getRulesByComponentType("CONTAINER");
    }

    public Rule getRuleById(long id) {
        return ruleRepo.findOne(id);
    }

    public long saveRule(long id, RuleReq ruleReq) {
        Rule rule;
        ComponentType componentType = componentTypeRepo.findOne(ruleReq.getComponentTypeId());
        Decision decision = decisionRepo.findOne(ruleReq.getDecisionId());
        if (id > 0)
            rule = ruleRepo.findOne(id);
        else
            rule = new Rule();
        rule.setRuleName(ruleReq.getRuleName());
        rule.setComponentType(componentType);
        rule.setDecision(decision);
        rule.setPriority(ruleReq.getPriority());
        long ruleId = ruleRepo.save(rule).getId();

        setLastUpdateHostRules();
        setLastUpdateAppRules();

        return ruleId;
    }

    public void deleteRule(long id) {
        ruleRepo.delete(id);

        setLastUpdateHostRules();
        setLastUpdateAppRules();
    }

    public Iterable<Condition> getConditions() {
        return conditionRepo.findAll();
    }

    public List<Condition> getConditionsByRuleId(long ruleId) {
        return ruleConditionRepo.getConditionsByRuleId(ruleId);
    }

    public long addConditionToRule(long ruleId, long conditionId) {
        List<RuleCondition> ruleConditionList = ruleConditionRepo.getRuleConditionByRuleIdAndConditionId(ruleId,
                conditionId);
        long id = 0;
        if (ruleConditionList.isEmpty()) {
            RuleCondition ruleCondition = new RuleCondition();
            Rule rule = ruleRepo.findOne(ruleId);
            Condition condition = conditionRepo.findOne(conditionId);
            ruleCondition.setRule(rule);
            ruleCondition.setCondition(condition);
            id = ruleConditionRepo.save(ruleCondition).getId();
        } else
            id = ruleConditionList.get(0).getId();

        setLastUpdateHostRules();
        setLastUpdateAppRules();

        return id;
    }

    public long deleteConditionFromRule(long ruleId, long conditionId) {
        List<RuleCondition> ruleConditionList = ruleConditionRepo.getRuleConditionByRuleIdAndConditionId(ruleId,
                conditionId);
        long id = 0;
        if (!ruleConditionList.isEmpty()) {
            long ruleConditionId = ruleConditionList.get(0).getId();
            ruleConditionRepo.delete(ruleConditionId);
            id = ruleConditionId;
        }
        setLastUpdateHostRules();
        setLastUpdateAppRules();

        return id;
    }

    public Condition getConditionById(long id) {
        return conditionRepo.findOne(id);
    }

    public long saveCondition(long id, ConditionReq conditionReq) {
        Condition condition;
        ValueMode valueMode = valueModeRepo.findOne(conditionReq.getValueModeId());
        Field field = fieldRepo.findOne(conditionReq.getFieldId());
        Operator operator = operatorRepo.findOne(conditionReq.getOperatorId());
        if (id > 0)
            condition = conditionRepo.findOne(id);
        else
            condition = new Condition();

        condition.setValueMode(valueMode);
        condition.setField(field);
        condition.setOperator(operator);
        condition.setConditionValue(conditionReq.getConditionValue());

        setLastUpdateHostRules();
        setLastUpdateAppRules();

        return conditionRepo.save(condition).getId();
    }

    public void deleteCondition(long id) {
        conditionRepo.delete(id);

        setLastUpdateHostRules();
        setLastUpdateAppRules();
    }

    public List<AppRule> getAppRulesByAppId(long appId) {
        return appRuleRepo.getAppRulesByAppId(appId);
    }

    public long saveAppRule(long appId, long ruleId) {
        List<AppRule> appRuleList = appRuleRepo.getAppRuleByAppIdAndRuleId(appId, ruleId);
        long id = 0;
        if (!appRuleList.isEmpty())
            id = appRuleList.get(0).getId();

        else {
            AppRule appRule = new AppRule();
            AppPackage appPackage = appPackageRepo.findOne(appId);
            Rule rule = ruleRepo.findOne(ruleId);
            appRule.setAppPackage(appPackage);
            appRule.setRule(rule);
            id = appRuleRepo.save(appRule).getId();
        }
        setLastUpdateAppRules();

        return id;
    }

    public boolean deleteAppRule(long appId, long ruleId) {
        List<AppRule> appRuleList = appRuleRepo.getAppRuleByAppIdAndRuleId(appId, ruleId);
        boolean success = false;

        if (!appRuleList.isEmpty()) {
            long appRuleId = appRuleList.get(0).getId();
            appRuleRepo.delete(appRuleId);
            success = true;
        }
        setLastUpdateAppRules();

        return success;
    }

    public List<ServiceRule> getServiceRulesByServiceId(long serviceId) {
        return serviceRuleRepo.getServiceRulesByServiceId(serviceId);
    }

    public List<ServiceRule> getServiceRulesByServiceName(String serviceName) {
        return serviceRuleRepo.getServiceRulesByServiceName(serviceName);
    }

    public long saveServiceRule(long serviceId, long ruleId) {
        List<ServiceRule> serviceRuleList = serviceRuleRepo.getServiceRuleByServiceIdAndRuleId(serviceId, ruleId);
        long id = 0;
        if (!serviceRuleList.isEmpty())
            id = serviceRuleList.get(0).getId();

        else {
            ServiceRule serviceRule = new ServiceRule();
            ServiceConfig serviceConfig = serviceConfigRepo.findOne(serviceId);
            Rule rule = ruleRepo.findOne(ruleId);
            serviceRule.setServiceConfig(serviceConfig);
            serviceRule.setRule(rule);
            id = serviceRuleRepo.save(serviceRule).getId();
        }
        setLastUpdateAppRules();

        return id;
    }

    public boolean deleteServiceRule(long serviceId, long ruleId) {
        List<ServiceRule> serviceRuleList = serviceRuleRepo.getServiceRuleByServiceIdAndRuleId(serviceId, ruleId);
        boolean success = false;

        if (!serviceRuleList.isEmpty()) {
            long serviceRuleId = serviceRuleList.get(0).getId();
            serviceRuleRepo.delete(serviceRuleId);
            success = true;
        }
        setLastUpdateAppRules();

        return success;
    }

    public List<HostRule> getHostRulesByHostname(String hostname) {
        return hostRuleRepo.getHostRulesByHostname(hostname);
    }

    public long saveHostRule(String hostname, long ruleId) {
        List<HostRule> hostRuleList = hostRuleRepo.getHostRuleByHostnameAndRuleId(hostname, ruleId);
        long id = 0;
        if (!hostRuleList.isEmpty())
            id = hostRuleList.get(0).getId();

        else {
            HostRule hostRule = new HostRule();
            Rule rule = ruleRepo.findOne(ruleId);
            hostRule.setHostname(hostname);
            hostRule.setRule(rule);
            id = hostRuleRepo.save(hostRule).getId();
        }
        setLastUpdateHostRules();

        return id;
    }

    public boolean deleteHostRule(String hostname, long ruleId) {
        List<HostRule> hostRuleList = hostRuleRepo.getHostRuleByHostnameAndRuleId(hostname, ruleId);
        boolean success = false;
        if (!hostRuleList.isEmpty()) {
            long hostRuleId = hostRuleList.get(0).getId();
            hostRuleRepo.delete(hostRuleId);
            success = true;
        }
        setLastUpdateHostRules();

        return success;
    }

    public Iterable<GenericHostRule> getGenericHostRules() {
        return genericHostRuleRepo.findAll();
    }

    public long saveGenericHostRule(long ruleId) {
        List<GenericHostRule> genericHostRuleList = genericHostRuleRepo.getGenericHostRuleByRuleId(ruleId);
        long id = 0;
        if (!genericHostRuleList.isEmpty())
            id = genericHostRuleList.get(0).getId();

        else {
            GenericHostRule genericHostRule = new GenericHostRule();
            Rule rule = ruleRepo.findOne(ruleId);
            genericHostRule.setRule(rule);
            id = genericHostRuleRepo.save(genericHostRule).getId();
        }
        setLastUpdateHostRules();

        return id;
    }

    public boolean deleteGenericHostRule(long ruleId) {
        List<GenericHostRule> genericHostRuleList = genericHostRuleRepo.getGenericHostRuleByRuleId(ruleId);
        boolean success = false;
        if (!genericHostRuleList.isEmpty()) {
            long genericHostRuleId = genericHostRuleList.get(0).getId();
            genericHostRuleRepo.delete(genericHostRuleId);
            success = true;
        }
        setLastUpdateHostRules();

        return success;
    }

    public Iterable<ComponentDecisionLog> getComponentDecisionLogs() {
        return componentDecisionLogRepo.findAll();
    }

    private ComponentDecisionLog saveComponentDecisionLog(boolean isContainer, String decision, long ruleId) {
        String componentTypeName = isContainer ? "CONTAINER" : "HOST";
        List<ComponentType> componentTypes = componentTypeRepo.findByComponentTypeName(componentTypeName);
        if (!componentTypes.isEmpty()) {
            ComponentType componentType = componentTypes.get(0);
            List<Decision> decisions = decisionRepo
                    .getDecisionsByComponentTypeAndByDecisionName(componentType.getComponentTypeName(), decision);
            if (!decisions.isEmpty()) {
                Decision dbDecision = decisions.get(0);
                Rule rule = ruleRepo.findOne(ruleId);
                Timestamp timestamp = Timestamp.from(Instant.now());
                ComponentDecisionLog componentDecisionLog = new ComponentDecisionLog(componentType, dbDecision, rule,
                        timestamp);
                return componentDecisionLogRepo.save(componentDecisionLog);
            }
        }
        return null;
    }

    public ComponentDecisionServiceLog saveComponentDecisionServiceLog(String containerId, String serviceName,
            String decision, long ruleId, String otherInfo) {
        ComponentDecisionLog componentDecisionLog = saveComponentDecisionLog(true, decision, ruleId);
        if (componentDecisionLog != null) {
            ComponentDecisionServiceLog componentDecisionServiceLog = new ComponentDecisionServiceLog(
                    componentDecisionLog, containerId, serviceName, otherInfo);
            return componentDecisionServiceLogRepo.save(componentDecisionServiceLog);
        }
        return null;
    }

    public ComponentDecisionHostLog saveComponentDecisionHostLog(String hostname, String decision, long ruleId) {
        ComponentDecisionLog componentDecisionLog = saveComponentDecisionLog(false, decision, ruleId);
        if (componentDecisionLog != null) {
            ComponentDecisionHostLog componentDecisionHostLog = new ComponentDecisionHostLog(componentDecisionLog,
                    hostname);
            return componentDecisionHostLogRepo.save(componentDecisionHostLog);
        }
        return null;
    }

    public void saveComponentDecisionValueLogs(List<ComponentDecisionValueLog> componentDecisionValueLogs) {
        componentDecisionValueLogRepo.save(componentDecisionValueLogs);
    }

    public void saveComponentDecisionValueLogsFromFields(ComponentDecisionLog componentDecisionLog,
            Map<String, Double> fields) {
        List<ComponentDecisionValueLog> componentDecisionValueLogs = new ArrayList<>(fields.size() / 3);
        for (Entry<String, Double> field : fields.entrySet()) {
            if (field.getKey().contains("effective-val")) {
                String fieldName = field.getKey().split("-effective-val")[0];
                Field dbField = getFieldsByName(fieldName);
                componentDecisionValueLogs
                        .add(new ComponentDecisionValueLog(componentDecisionLog, dbField, field.getValue()));
            }
        }
        saveComponentDecisionValueLogs(componentDecisionValueLogs);
    }

    public HostEventLog saveHostEventLog(String hostname, String decisionName) {
        HostEventLog hostEventLog = null;
        Decision decision = getDecisionsByComponentTypeAndByDecisionName("HOST", decisionName);

        if (decision != null) {
            List<HostEventLog> hostEventLogs = hostEventLogRepo.findByHostname(hostname);
            if (!hostEventLogs.isEmpty()) {
                hostEventLog = hostEventLogs.get(0);
                if (hostEventLog.getDecision().getId() != decision.getId()) {
                    hostEventLog.setDecision(decision);
                    hostEventLog.setCount(1);
                } else {
                    hostEventLog.setCount(hostEventLog.getCount() + 1);
                }

            } else {
                hostEventLog = new HostEventLog(hostname, decision, 1);
            }
            hostEventLog = hostEventLogRepo.save(hostEventLog);
        }
        return hostEventLog;
    }

    public ServiceEventLog saveServiceEventLog(String containerId, String serviceName, String decisionName) {
        ServiceEventLog serviceEventLog = null;
        Decision decision = getDecisionsByComponentTypeAndByDecisionName("CONTAINER", decisionName);

        if (decision != null) {
            List<ServiceEventLog> serviceEventLogs = serviceEventLogRepo.findByContainerId(containerId);
            if (!serviceEventLogs.isEmpty()) {
                serviceEventLog = serviceEventLogs.get(0);
                if (serviceEventLog.getDecision().getId() != decision.getId()) {
                    serviceEventLog.setDecision(decision);
                    serviceEventLog.setCount(1);
                } else {
                    serviceEventLog.setCount(serviceEventLog.getCount() + 1);
                }

            } else {
                serviceEventLog = new ServiceEventLog(containerId, serviceName, decision, 1);
            }
            serviceEventLog = serviceEventLogRepo.save(serviceEventLog);
        }
        return serviceEventLog;
    }

    public void resetServiceEventLog(String serviceName) {
        Decision decision = getDecisionsByComponentTypeAndByDecisionName("CONTAINER", "NONE");
        if (decision != null) {
            List<ServiceEventLog> servicesEventLogs = serviceEventLogRepo.findByServiceName(serviceName);
            if (!servicesEventLogs.isEmpty()) {
                for(ServiceEventLog serviceEventLog : servicesEventLogs) {                    
                    serviceEventLog.setDecision(decision);
                    serviceEventLog.setCount(1);                    
                    serviceEventLog = serviceEventLogRepo.save(serviceEventLog);
                }                
            }            
        }        
    }

    public List<ServiceEventLog> getServiceEventLogsByServiceName(String serviceName) {
        return serviceEventLogRepo.findByServiceName(serviceName);
    }

    public List<ServiceEventLog> getServiceEventLogsByContainerId(String containerId) {
        return serviceEventLogRepo.findByContainerId(containerId);
    }

    public List<ComponentDecisionServiceLog> getComponentDecisionServiceLogByServiceName(String serviceName){
        return componentDecisionServiceLogRepo.findByServiceName(serviceName);
    }

    public List<ComponentDecisionServiceLog> getComponentDecisionServiceLogByContainerId(String containerId){
        return componentDecisionServiceLogRepo.findByServiceName(containerId);
    }
}