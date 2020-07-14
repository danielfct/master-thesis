package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.List;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.AwsSimpleInstance;
import andre.replicationmigration.reqres.GenericResponse;

@Service
public class AwsService {

	private BasicAWSCredentials awsCreds;
	private AmazonEC2 ec2;
	private String awsInstanceType;

	private static final String DEFAULT_INSTANCE_AMI = "ami-c77c05b8";
	private static final String DEFAULT_INSTANCE_SECURITY_GROUP = "launch-wizard-2";
	private static final String DEFAULT_INSTANCE_KEY_PAIR = "ec2";

	@Autowired
	public AwsService(@Value("${replic.prop.aws-access-key}") String awsAccessKey,
			@Value("${replic.prop.aws-secret-access-key}") String awsSecretAccessKey,
			@Value("${replic.prop.aws-instance-type}") String awsInstanceType) {
		this.awsCreds = new BasicAWSCredentials(awsAccessKey, awsSecretAccessKey);
		this.ec2 = AmazonEC2ClientBuilder.standard().withRegion(Regions.US_EAST_1)
				.withCredentials(new AWSStaticCredentialsProvider(awsCreds)).build();
		this.awsInstanceType = awsInstanceType;
	}

	public List<AwsSimpleInstance> getInstances() {
		boolean done = false;
		List<AwsSimpleInstance> instances = new ArrayList<>();
		DescribeInstancesRequest request = new DescribeInstancesRequest();
		while (!done) {
			DescribeInstancesResult response = ec2.describeInstances(request);
			for (Reservation reservation : response.getReservations()) {
				for (Instance instance : reservation.getInstances()) {
					if (isRepMigInstance(instance)) {
						instances.add(new AwsSimpleInstance(instance.getInstanceId(), instance.getImageId(),
								instance.getInstanceType(), instance.getState(), instance.getPublicDnsName(),
								instance.getPublicIpAddress()));
					}
				}
			}
			request.setNextToken(response.getNextToken());
			if (response.getNextToken() == null) {
				done = true;
			}
		}
		return instances;
	}

	public List<Instance> getInstancesFull() {
		boolean done = false;
		List<Instance> instances = new ArrayList<>();
		DescribeInstancesRequest request = new DescribeInstancesRequest();
		while (!done) {
			DescribeInstancesResult response = ec2.describeInstances(request);
			for (Reservation reservation : response.getReservations()) {
				for (Instance instance : reservation.getInstances()) {
					if (isRepMigInstance(instance)) {
						instances.add(instance);
					}
				}
			}
			request.setNextToken(response.getNextToken());
			if (response.getNextToken() == null) {
				done = true;
			}
		}
		return instances;
	}

	public Instance getInstance(String instanceId) {
		boolean done = false;
		DescribeInstancesRequest request = new DescribeInstancesRequest().withInstanceIds(instanceId);
		while (!done) {
			DescribeInstancesResult response = ec2.describeInstances(request);
			for (Reservation reservation : response.getReservations()) {
				for (Instance instance : reservation.getInstances()) {
					return instance;
				}
			}
			request.setNextToken(response.getNextToken());
			if (response.getNextToken() == null) {
				done = true;
			}
		}
		return null;
	}

	public Instance getInstanceByPublicIpAddr(String ipAddr) {
		for (Instance instance : getInstancesFull()) {
			if (instance.getPublicIpAddress() != null && instance.getPublicIpAddress().equals(ipAddr)) {
				return instance;
			}
		}
		return null;
	}

	public AwsSimpleInstance getSimpleInstance(String instanceId) {
		Instance instance = this.getInstance(instanceId);
		if (instance != null) {
			return new AwsSimpleInstance(instance.getInstanceId(), instance.getImageId(), instance.getInstanceType(),
					instance.getState(), instance.getPublicDnsName(), instance.getPublicIpAddress());
		}
		return null;
	}

	public boolean startInstance(String instanceId) {
		final int MAX_RETRIES = 10;
		boolean isRunning = false;
		Instance instance = null;
		int instanceState = -1;
		int tries = 0;
		boolean setStart = false;
		while (!isRunning && tries < MAX_RETRIES) {
			instance = getInstance(instanceId);
			instanceState = instance.getState().getCode();

			if (instanceState == 16) { // Is running
				isRunning = true;
				break;
			} else if (instanceState == 80 && !setStart) { // Is stopped
				_startInstance(instanceId);
				setStart = true;
			}
			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			tries++;
		}
		return isRunning;
	}

	private void _startInstance(String instanceId) {
		DryRunSupportedRequest<StartInstancesRequest> dry_request = () -> {
			StartInstancesRequest request = new StartInstancesRequest().withInstanceIds(instanceId);
			return request.getDryRunRequest();
		};
		DryRunResult<StartInstancesRequest> dry_response = ec2.dryRun(dry_request);

		if (!dry_response.isSuccessful()) {
			System.out.println("-> Failed dry run to start instance: " + instanceId);
			throw dry_response.getDryRunResponse();
		}

		StartInstancesRequest request = new StartInstancesRequest().withInstanceIds(instanceId);
		ec2.startInstances(request);
		System.out.println("-> Successfully started instance: " + instanceId);
	}

	/**
	 * @param ipAddr the instance IP address
	 */
	public void stopInstance(String ipAddr) {
		Instance instance = getInstanceByPublicIpAddr(ipAddr);
		_stopInstance(instance.getInstanceId());
	}

	private void _stopInstance(String instanceId) {
		DryRunSupportedRequest<StopInstancesRequest> dry_request = () -> {
			StopInstancesRequest request = new StopInstancesRequest().withInstanceIds(instanceId);
			return request.getDryRunRequest();
		};
		DryRunResult<StopInstancesRequest> dry_response = ec2.dryRun(dry_request);

		if (!dry_response.isSuccessful()) {
			System.out.println("-> Failed dry run to stop instance: " + instanceId);
			throw dry_response.getDryRunResponse();
		}

		StopInstancesRequest request = new StopInstancesRequest().withInstanceIds(instanceId);
		ec2.stopInstances(request);
		System.out.println("-> Successfully stop instance: " + instanceId);
	}

	public GenericResponse createS2() {
		RunInstancesRequest runInstancesRequest = new RunInstancesRequest();
		runInstancesRequest.withImageId(DEFAULT_INSTANCE_AMI).withInstanceType(awsInstanceType).withMinCount(1)
				.withMaxCount(1).withSecurityGroups(DEFAULT_INSTANCE_SECURITY_GROUP)
				.withKeyName(DEFAULT_INSTANCE_KEY_PAIR);

		RunInstancesResult result = ec2.runInstances(runInstancesRequest);
		String instanceId = result.getReservation().getInstances().get(0).getInstanceId();

		String instanceName = "ubuntu-" + System.currentTimeMillis();

		CreateTagsRequest createTagsRequest = new CreateTagsRequest().withResources(instanceId)
				.withTags(new Tag("Name", instanceName), new Tag("rep-mig", "true"));
		ec2.createTags(createTagsRequest);

		return new GenericResponse("instanceId", instanceId);
	}

	public boolean isRepMigInstance(Instance instance) {
		List<Tag> tags = instance.getTags();
		for (Tag tag : tags) {
			if (tag.getKey().equals("rep-mig"))
				return tag.getValue().equals("true");
		}
		return false;
	}
}
