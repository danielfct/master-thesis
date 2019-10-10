package andre.replicationmigration.services.rules;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.rules.AppRule;
import andre.replicationmigration.model.rules.GenericHostRule;
import andre.replicationmigration.model.rules.HostRule;
import andre.replicationmigration.model.rules.ServiceRule;
import andre.replicationmigration.util.rules.Condition;
import andre.replicationmigration.util.rules.Condition.Operator;
import andre.replicationmigration.util.rules.Rule;
import andre.replicationmigration.util.rules.RuleDecision.Decision;

@Service
public class RuleGenerationService {

    @Autowired
    private RuleDataService ruleDataService;   

    public long getLastUpdateHostRules() {
        return ruleDataService.getLastUpdateHostRules();
    }

    public long getLastUpdateAppRules() {
        return ruleDataService.getLastUpdateAppRules();
    }

    private List<Rule> generateGenericHostRules() {
        Iterable<GenericHostRule> genericHostRules = ruleDataService.getGenericHostRules();
        List<Rule> rules = new ArrayList<>();
        for (GenericHostRule genericHostRule : genericHostRules) {
            rules.add(generateRule(genericHostRule.getRule()));
        }
        return rules;
    }
   
    public List<Rule> generateHostRulesByHostname(String hostname) {
        List<HostRule> hostRules = ruleDataService.getHostRulesByHostname(hostname);
        List<Rule> genericRules = generateGenericHostRules();
        List<Rule> rules = new ArrayList<>(hostRules.size() + genericRules.size());
        rules.addAll(genericRules);
        for (HostRule hostRule : hostRules) {
            rules.add(generateRule(hostRule.getRule()));
        }

        System.out.println("-> Generating host rules... (count: " + rules.size() + ")");
        return rules;
    }

    
    private List<Rule> generateRulesByApp(long appId) {
        List<AppRule> appRules = ruleDataService.getAppRulesByAppId(appId);
        List<Rule> rules = new ArrayList<>(appRules.size());
        for (AppRule appRule : appRules) {
            rules.add(generateRule(appRule.getRule()));
        }

        //System.out.println("-> Generating app rules... (count: " + rules.size() + ")");
        return rules;
    }

    public List<Rule> generateRulesByService(long appId, String serviceName) {
        List<ServiceRule> serviceRules = ruleDataService.getServiceRulesByServiceName(serviceName);
        List<Rule> rules = generateRulesByApp(appId);
        for (ServiceRule serviceRule : serviceRules) {
            rules.add(generateRule(serviceRule.getRule()));
        }

        System.out.println("-> Generating service rules... (count: " + rules.size() + ")");
        return rules;
    }

    private Rule generateRule(andre.replicationmigration.model.rules.Rule dbRule) {
        Decision decision = Decision.fromValue(dbRule.getDecision().getDecisionName());
        int priority = dbRule.getPriority();
        List<andre.replicationmigration.model.rules.Condition> dbConditions = ruleDataService
                .getConditionsByRuleId(dbRule.getId());

        Rule rule = new Rule(dbRule.getId());
        rule.setDecision(decision);
        rule.setPriority(priority);
        List<Condition> conditions = new ArrayList<>(dbConditions.size());
        for (andre.replicationmigration.model.rules.Condition dbCondition : dbConditions) {
            double value = dbCondition.getConditionValue();
            String fieldName = dbCondition.getField().getFieldName();
            String valueModeName = dbCondition.getValueMode().getValueModeName();
            Operator operator = Operator.fromValue(dbCondition.getOperator().getOperatorName());

            Condition condition = new Condition();
            condition.setFieldName(fieldName + "-" + valueModeName);
            condition.setOperator(operator);
            condition.setValue(value);
            conditions.add(condition);
        }
        rule.setConditions(conditions);
        return rule;
    }

    @Cacheable(cacheNames = "ruleTemplateCache", key = "#isContainer")
    public String getRuleTemplate(boolean isContainer) {
        System.out.println("-> Getting rule template...");
        String templateResource = isContainer ? "container-rule-template.drl" : "host-rule-template.drl";
        InputStream ruleTemplate = Thread.currentThread().getContextClassLoader().getResourceAsStream(templateResource);

        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        try {
            while ((length = ruleTemplate.read(buffer)) != -1) {
                result.write(buffer, 0, length);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            return result.toString("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return "";
    }
}