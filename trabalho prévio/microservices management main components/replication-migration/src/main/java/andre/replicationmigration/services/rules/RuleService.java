package andre.replicationmigration.services.rules;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.drools.template.ObjectDataCompiler;
import org.kie.api.KieServices;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.event.rule.AgendaEventListener;
import org.kie.api.io.Resource;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.StatelessKieSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.util.rules.ContainerDecision;
import andre.replicationmigration.util.rules.ContainerDecisionResult;
import andre.replicationmigration.util.rules.ContainerEvent;
import andre.replicationmigration.util.rules.Event;
import andre.replicationmigration.util.rules.HostDecision;
import andre.replicationmigration.util.rules.HostDecisionResult;
import andre.replicationmigration.util.rules.HostEvent;
import andre.replicationmigration.util.rules.Rule;
import andre.replicationmigration.util.rules.RuleDecision.Decision;
import andre.replicationmigration.util.rules.TrackingAgendaEventListener;

@Service
public class RuleService {

    private static Logger log = LoggerFactory.getLogger(RuleService.class);

    @Autowired
    private RuleGenerationService ruleGenerationService;

    private Map<String, StatelessKieSession> hostRuleSessions;
    private Map<String, StatelessKieSession> serviceRuleSessions;

    private Map<String, Long> lastUpdateHostRulesMap;
    private Map<String, Long> lastUpdateServiceRulesMap;

    public RuleService() {
        this.hostRuleSessions = new HashMap<>();
        this.serviceRuleSessions = new HashMap<>();
        this.lastUpdateHostRulesMap = new HashMap<>();
        this.lastUpdateServiceRulesMap = new HashMap<>();
    }

    public ContainerDecisionResult executeContainerEvent(long appId, String serviceHostname, ContainerEvent containerEvent) {
        String serviceName = containerEvent.getServiceName();
        if (getIsCreateNewServiceRuleSession(serviceName)) {
            List<Rule> rules = ruleGenerationService.generateRulesByService(appId, serviceName);
            Map<Long, String> drls = new HashMap<>();
            try {
                for (Rule rule : rules) {
                    String drl = applyRuleTemplate(containerEvent, rule, true);
                    drls.put(rule.getDbRuleId(), drl);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            createNewServiceRuleSession(serviceName, drls);
        }

        return evaluate(serviceHostname, containerEvent);
    }

    public HostDecisionResult executeHostEvent(String hostname, HostEvent hostEvent) {
        if (getIsCreateNewHostRuleSession(hostname)) {
            List<Rule> rules = ruleGenerationService.generateHostRulesByHostname(hostname);
            Map<Long, String> drls = new HashMap<>();
            try {
                for (Rule rule : rules) {
                    String drl = applyRuleTemplate(hostEvent, rule, false);
                    drls.put(rule.getDbRuleId(), drl);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            createNewHostRuleSession(hostname, drls);
        }

        return evaluate(hostEvent);
    }

    public boolean getIsCreateNewHostRuleSession(String hostname) {
        long lastUpdateHostRules = ruleGenerationService.getLastUpdateHostRules();
        long currVal = lastUpdateHostRulesMap.getOrDefault(hostname, -1L);
        if (currVal < lastUpdateHostRules) {
            lastUpdateHostRulesMap.put(hostname, lastUpdateHostRules);
            return true;
        }
        return false;
    }

    public boolean getIsCreateNewServiceRuleSession(String serviceName) {
        long lastUpdateAppRules = ruleGenerationService.getLastUpdateAppRules();
        long currVal = lastUpdateServiceRulesMap.getOrDefault(serviceName, -1L);
        if (currVal < lastUpdateAppRules) {
            lastUpdateServiceRulesMap.put(serviceName, lastUpdateAppRules);
            return true;
        }
        return false;
    }

    private void createNewServiceRuleSession(String serviceName, Map<Long, String> drls) {
        KieServices kieServices = KieServices.Factory.get();
        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        for (Entry<Long, String> drl : drls.entrySet()) {
            Resource resource = kieServices.getResources().newByteArrayResource(drl.getValue().getBytes());
            resource.setTargetPath("rules/rule_container_" + drl.getKey() + ".drl");
            kieFileSystem.write(resource);
        }
        kieServices.newKieBuilder(kieFileSystem).buildAll();

        KieContainer kieContainer = kieServices.newKieContainer(kieServices.getRepository().getDefaultReleaseId());
        StatelessKieSession serviceRuleSession = kieContainer.getKieBase().newStatelessKieSession();
        TrackingAgendaEventListener agendaEventListener = new TrackingAgendaEventListener();
        serviceRuleSession.addEventListener(agendaEventListener);

        serviceRuleSessions.put(serviceName, serviceRuleSession);
    }

    private ContainerDecisionResult evaluate(String serviceHostname, ContainerEvent event) {
        ContainerDecision containerDecision = new ContainerDecision();
        long ruleId = 0;

        StatelessKieSession serviceRuleSession = serviceRuleSessions.get(event.getServiceName());
        serviceRuleSession.getGlobals().set("containerDecision", containerDecision);
        serviceRuleSession.execute(event);

        ruleId = getRuleFired(new ArrayList<>(serviceRuleSession.getAgendaEventListeners()));

        ContainerDecisionResult containerDecisionRes = new ContainerDecisionResult(serviceHostname, event.getContainerId(),
                event.getServiceName(), containerDecision.getDecision(), ruleId,  event.getFields(), containerDecision.getPriority());

        return containerDecisionRes;
    }

    private void createNewHostRuleSession(String hostname, Map<Long, String> drls) {
        KieServices kieServices = KieServices.Factory.get();
        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        for (Entry<Long, String> drl : drls.entrySet()) {
            Resource resource = kieServices.getResources().newByteArrayResource(drl.getValue().getBytes());
            resource.setTargetPath("rules/rule_host_" + drl.getKey() + ".drl");
            kieFileSystem.write(resource);
        }
        kieServices.newKieBuilder(kieFileSystem).buildAll();

        KieContainer kieContainer = kieServices.newKieContainer(kieServices.getRepository().getDefaultReleaseId());
        StatelessKieSession hostRuleSession = kieContainer.getKieBase().newStatelessKieSession();
        TrackingAgendaEventListener agendaEventListener = new TrackingAgendaEventListener();
        hostRuleSession.addEventListener(agendaEventListener);

        hostRuleSessions.put(hostname, hostRuleSession);
    }

    private HostDecisionResult evaluate(HostEvent event) {
        HostDecision hostDecision = new HostDecision();
        String hostname = event.getHostname();
        long ruleId = 0;

        StatelessKieSession hostRuleSession = hostRuleSessions.get(hostname);
        hostRuleSession.getGlobals().set("hostDecision", hostDecision);
        hostRuleSession.execute(event);

        ruleId = getRuleFired(new ArrayList<>(hostRuleSession.getAgendaEventListeners()));

        HostDecisionResult hostDecisionRes = new HostDecisionResult(hostname, hostDecision.getDecision(),
                ruleId, event.getFields(), hostDecision.getPriority());

        return hostDecisionRes;
    }

    private long getRuleFired(List<AgendaEventListener> agendaEvents) {
        if (!agendaEvents.isEmpty()) {
            TrackingAgendaEventListener agendaEvent = (TrackingAgendaEventListener) agendaEvents.get(0);            
            if (!agendaEvent.getMatchList().isEmpty()) {               
                String[] ruleNameSplit = agendaEvent.getMatchList().get(0).getRule().getName().split("_");
                agendaEvent.reset();
                return Long.valueOf(ruleNameSplit[2]);                
            }           
        }
        return 0;
    }

    private String applyRuleTemplate(Event event, Rule rule, boolean isContainer) throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        ObjectDataCompiler objectDataCompiler = new ObjectDataCompiler();
        String decisionString = Decision.class.getSimpleName() + "." + rule.getDecision().toString();

        data.put("ruleId", rule.getDbRuleId());
        data.put("rule", rule);
        data.put("eventType", event.getClass().getName());
        data.put("decision", decisionString);
        data.put("priority", rule.getPriority());

        InputStream ruleTemplate = new ByteArrayInputStream(
                ruleGenerationService.getRuleTemplate(isContainer).getBytes(StandardCharsets.UTF_8));

        return objectDataCompiler.compile(Arrays.asList(data), ruleTemplate);
    }

    public void test() {
        ContainerEvent containerEvent = new ContainerEvent("containerId", "serviceName");
        containerEvent.getFields().put("cpu", 1.0);

        executeContainerEvent(1, "", containerEvent);
    }

}