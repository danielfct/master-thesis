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

package pt.unl.fct.microservicemanagement.mastermanager.manager.host.cloud.aws;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.util.Timing;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.ec2.AmazonEC2;
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder;
import com.amazonaws.services.ec2.model.CreateTagsRequest;
import com.amazonaws.services.ec2.model.DescribeInstancesRequest;
import com.amazonaws.services.ec2.model.DescribeInstancesResult;
import com.amazonaws.services.ec2.model.DryRunResult;
import com.amazonaws.services.ec2.model.DryRunSupportedRequest;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.ec2.model.RunInstancesRequest;
import com.amazonaws.services.ec2.model.RunInstancesResult;
import com.amazonaws.services.ec2.model.StartInstancesRequest;
import com.amazonaws.services.ec2.model.StopInstancesRequest;
import com.amazonaws.services.ec2.model.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AwsService {


  //private static final String DEFAULT_INSTANCE_AMI = "ami-0e02218c08bb8ffd5";
  private static final String DEFAULT_INSTANCE_AMI = "ami-0e02218c08bb8ffd5";
  private static final String DEFAULT_INSTANCE_SECURITY_GROUP = "launch-wizard-2";
  private static final String DEFAULT_INSTANCE_KEY_PAIR = "ec2";
  private static final int INSTANCE_START_MAX_RETRIES = 10;
  private static final long DELAY_BETWEEN_START_INSTANCE_TRIES = TimeUnit.SECONDS.toMillis(5);
  private static final long START_INSTANCE_TIMEOUT = TimeUnit.SECONDS.toMillis(30);
  private static final long STOP_INSTANCE_TIMEOUT = TimeUnit.SECONDS.toMillis(60);
  private static final String MASTER_MANAGER = "master-manager";

  private final AmazonEC2 ec2;
  private final String awsInstanceType;

  public AwsService(AwsProperties awsProperties) {
    String awsAccessKey = awsProperties.getAccess().getKey();
    String awsSecretAccessKey = awsProperties.getAccess().getSecretKey();
    var awsCredentials = new BasicAWSCredentials(awsAccessKey, awsSecretAccessKey);
    var awsCredentialsProvider = new AWSStaticCredentialsProvider(awsCredentials);
    this.ec2 = AmazonEC2ClientBuilder.standard().withRegion(Regions.US_EAST_2).withCredentials(awsCredentialsProvider)
        .build();
    this.awsInstanceType = awsProperties.getInstance().getType();
  }

  private List<Instance> getInstances() {
    var instances = new ArrayList<Instance>();
    var request = new DescribeInstancesRequest();
    DescribeInstancesResult result;
    do {
      result = ec2.describeInstances(request);
      result.getReservations().stream().map(Reservation::getInstances).flatMap(List::stream)
          .filter(this::isMasterManagerInstance).forEach(instances::add);
      request.setNextToken(result.getNextToken());
    } while (result.getNextToken() != null);
    return instances;
  }

  public List<AwsSimpleInstance> getSimpleInstances() {
    return getInstances().stream().map(AwsSimpleInstance::new).collect(Collectors.toList());
  }

  public Instance getInstance(String id) {
    final DescribeInstancesRequest request = new DescribeInstancesRequest().withInstanceIds(id);
    DescribeInstancesResult result;
    do {
      result = ec2.describeInstances(request);
      Optional<Instance> instance = result.getReservations().stream().map(Reservation::getInstances)
          .flatMap(List::stream).filter(this::isMasterManagerInstance).findFirst();
      if (instance.isPresent()) {
        return instance.get();
      }
      request.setNextToken(result.getNextToken());
    } while (result.getNextToken() != null);
    throw new NotFoundException();
  }

  public AwsSimpleInstance getSimpleInstance(String instanceId) {
    Instance instance = getInstance(instanceId);
    return new AwsSimpleInstance(instance);
  }

  public Instance getInstanceByPublicIpAddr(String publicIpAddress) {
    return getInstances().stream()
        .filter(instance -> Objects.equals(instance.getPublicIpAddress(), publicIpAddress))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Instance with ip %s not found", publicIpAddress));
  }

  public Instance startInstanceById(String instanceId) {
    for (var tries = 0; tries < INSTANCE_START_MAX_RETRIES; tries++) {
      Instance instance = getInstance(instanceId);
      int instanceState = instance.getState().getCode();
      if (instanceState == AwsInstanceState.RUNNING.getCode()) {
        return instance;
      }
      if (instanceState == AwsInstanceState.STOPPED.getCode()) {
        startInstance(instanceId);
        return instance;
      }
      Timing.sleep(DELAY_BETWEEN_START_INSTANCE_TRIES, TimeUnit.MILLISECONDS);
    }
    throw new StartInstanceException("Unable to start instance within %d tries", INSTANCE_START_MAX_RETRIES);
  }

  private void startInstance(String instanceId) {
    DryRunSupportedRequest<StartInstancesRequest> dryRequest = () ->
        new StartInstancesRequest().withInstanceIds(instanceId).getDryRunRequest();
    DryRunResult<StartInstancesRequest> dryResponse = ec2.dryRun(dryRequest);
    if (!dryResponse.isSuccessful()) {
      String errorMessage = dryResponse.getDryRunResponse().getErrorMessage();
      log.info("Failed to start instance {}: {}", instanceId, errorMessage);
      throw new StartInstanceException(errorMessage);
    }
    StartInstancesRequest request = new StartInstancesRequest().withInstanceIds(instanceId);
    ec2.startInstances(request);
    try {
      Timing.wait(() -> getInstance(instanceId).getState().getCode() == AwsInstanceState.RUNNING.getCode(),
          START_INSTANCE_TIMEOUT);
    } catch (TimeoutException e) {
      throw new StartInstanceException(e.getMessage());
    }
    log.info("Successfully started instance {}", instanceId);
  }

  public void stopInstance(String publicIpAddr) {
    Instance instance = getInstanceByPublicIpAddr(publicIpAddr);
    String instanceId = instance.getInstanceId();
    DryRunSupportedRequest<StopInstancesRequest> dryRequest = () ->
        new StopInstancesRequest().withInstanceIds(instanceId).getDryRunRequest();
    DryRunResult<StopInstancesRequest> dryResponse = ec2.dryRun(dryRequest);
    if (!dryResponse.isSuccessful()) {
      String errorMessage = dryResponse.getDryRunResponse().getErrorMessage();
      log.info("Failed to stop instance {}: {}", instanceId, errorMessage);
      throw new StopInstanceException(errorMessage);
    }
    var request = new StopInstancesRequest().withInstanceIds(instanceId);
    ec2.stopInstances(request);
    try {
      Timing.wait(() -> getInstance(instanceId).getState().getCode() == AwsInstanceState.STOPPED.getCode(),
          STOP_INSTANCE_TIMEOUT);
    } catch (TimeoutException e) {
      throw new StopInstanceException(e.getMessage());
    }
    log.info("Stopped instance {} successfully", instanceId);
  }

  public String createEC2() {
    var runInstancesRequest = new RunInstancesRequest();
    runInstancesRequest.withImageId(DEFAULT_INSTANCE_AMI).withInstanceType(awsInstanceType).withMinCount(1)
        .withMaxCount(1).withSecurityGroups(DEFAULT_INSTANCE_SECURITY_GROUP).withKeyName(DEFAULT_INSTANCE_KEY_PAIR);
    RunInstancesResult result = ec2.runInstances(runInstancesRequest);
    Instance instance = result.getReservation().getInstances().get(0);
    String instanceId = instance.getInstanceId();
    var instanceName = String.format("ubuntu-%d", System.currentTimeMillis());
    var createTagsRequest = new CreateTagsRequest().withResources(instanceId)
        .withTags(new Tag("Name", instanceName), new Tag(MASTER_MANAGER, "true"));
    ec2.createTags(createTagsRequest);
    return instance.getInstanceId();
  }

  public String createNewAwsInstance() {
    log.info("Creating new AWS instance...");
    String instanceId = createEC2();
    try {
      Timing.wait(() -> getInstance(instanceId).getState().getCode() == AwsInstanceState.RUNNING.getCode(),
          START_INSTANCE_TIMEOUT);
    } catch (TimeoutException e) {
      e.printStackTrace();
      throw new StartInstanceException(e.getMessage());
    }
    //TODO try to avoid extra getInstance
    String hostname = getInstance(instanceId).getPublicIpAddress();
    log.info("New AWS instance created: {}", hostname);
    return hostname;
  }

  private boolean isMasterManagerInstance(Instance instance) {
    return instance.getTags().stream().anyMatch(tag ->
        Objects.equals(tag.getKey(), MASTER_MANAGER) && Objects.equals(tag.getValue(), "true"));
  }
}
