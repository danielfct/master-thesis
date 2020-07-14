package andre.replicationmigration.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.entities.ServiceConfigOrder;
import andre.replicationmigration.repositories.AppPackageRepository;
import andre.replicationmigration.reqres.GenericResponse;
import andre.replicationmigration.reqres.SaveAppReq;

@Service
public class AppPackageService {

	@Autowired
	private AppPackageRepository apps;

	@Autowired
	private DockerServiceApi docker;

	@Autowired
	private ServicesConfigsService servicesConfigsService;

	@Autowired
	private HostService hostService;

	public Iterable<AppPackage> getApps() {
		return apps.findAll();
	}

	public AppPackage getAppById(long appId) {
		return apps.findOne(appId);
	}

	public List<ServiceConfigOrder> getServiceConfigByAppId(long appId) {
		if (apps.exists(appId)) {
			return apps.getServiceConfigOrderByApp(appId);
		}
		return null;
	}

	public long saveApp(long id, SaveAppReq saveAppReq) {
		AppPackage app = null;

		if (id > 0)
			app = apps.findOne(id);
		else
			app = new AppPackage();

		app.setAppName(saveAppReq.getAppName());

		return apps.save(app).getId();
	}

	public long deleteApp(long id) {
		apps.delete(id);
		return id;
	}

	// TODO : review lauchApp
	public Map<String, List<GenericResponse>> launchApp(long appId, String region, String country, String city) {
		Map<String, List<GenericResponse>> launchResponses = new HashMap<>();
		List<ServiceConfigOrder> servicesConfigOrders = this.getServiceConfigByAppId(appId);
		Map<String, String> globalParams = new HashMap<>();

		for (ServiceConfigOrder serviceConfigOrder : servicesConfigOrders) {
			ServiceConfig service = serviceConfigOrder.getServiceConfig();
			if (!service.getServiceType().equals("database")) {
				List<GenericResponse> response = launchService(service, globalParams, region, country, city);
				launchResponses.put(service.getServiceName(), response);
				
				for (GenericResponse res : response) {
					if (res.getKey().equals("output")) {
						globalParams.put(service.getOutputLabel(), res.getValue());
					}
				}
				sleep(5000);
			}
		}
		return launchResponses;
	}

	private List<GenericResponse> launchService(ServiceConfig service, Map<String, String> globalParams, String region, String country, String city) {
		List<GenericResponse> response = new ArrayList<>();		
		int minReplics = servicesConfigsService.getMinReplicsByServiceName(service.getServiceName());
		for (int i = 0; i < minReplics; i++) {
			String hostname = hostService.getAvailableNode(region, country, city, service.getAvgMem());			 
			response.addAll(docker.launchContainer(hostname, service, globalParams));
		}
		
		return response;
	}

	private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}