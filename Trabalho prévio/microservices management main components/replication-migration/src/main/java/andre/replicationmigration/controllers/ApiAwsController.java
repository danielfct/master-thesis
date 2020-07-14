package andre.replicationmigration.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.ec2.model.Instance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import andre.replicationmigration.entities.AwsSimpleInstance;
import andre.replicationmigration.reqres.AwsLaunchServiceReq;
import andre.replicationmigration.reqres.GenericResponse;
import andre.replicationmigration.services.AwsService;
import andre.replicationmigration.services.DockerServiceApi;

@Controller
@RequestMapping(value = "/api/aws")
public class ApiAwsController {

    @Autowired
    private AwsService aws;

    @Autowired
    private DockerServiceApi docker;

    @RequestMapping(value = "/s2/instances")
    public @ResponseBody List<AwsSimpleInstance> awsS2GetInstances() {
        return aws.getInstances();
    }

    @RequestMapping(value = "/s2/instances", method = RequestMethod.POST)
    public @ResponseBody GenericResponse awsS2Create() {
        return aws.createS2();
    }

    @RequestMapping(value = "/s2/instances/{instanceId}")
    public @ResponseBody Instance awsS2getInstanceById(@PathVariable String instanceId) {
        return aws.getInstance(instanceId);
    }

    @RequestMapping(value = "/s2/instances/{instanceId}/simple")
    public @ResponseBody AwsSimpleInstance awsS2getSimpleInstanceById(@PathVariable String instanceId) {
        return aws.getSimpleInstance(instanceId);
    }

    @RequestMapping(value = "/s2/launchservice", method = RequestMethod.POST)
    public @ResponseBody List<GenericResponse> awsS2LaunchService(@RequestBody AwsLaunchServiceReq launchServiceReq) {
        boolean isStarted = aws.startInstance(launchServiceReq.getInstanceId());
        if (isStarted) {
            String ec2PublicIp = aws.getInstance(launchServiceReq.getInstanceId()).getPublicIpAddress();

            String databaseParamKey = "${" + launchServiceReq.getService() + "DatabaseHost}";
            Map<String, String> params = new HashMap<>(2);
            params.put("${eurekaHost}", launchServiceReq.getEurekaHost());
            params.put(databaseParamKey, launchServiceReq.getDatabase());

            return docker.launchContainer(ec2PublicIp, launchServiceReq.getInternalPort(),
                    launchServiceReq.getExternalPort(), launchServiceReq.getService(), params);
        }
        return null;
    }
}
