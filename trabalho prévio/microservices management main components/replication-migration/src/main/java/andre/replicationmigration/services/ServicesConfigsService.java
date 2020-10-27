package andre.replicationmigration.services;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.model.ServiceConfig;
import andre.replicationmigration.model.ServiceEventPrediction;
import andre.replicationmigration.repositories.ServiceConfigRepository;
import andre.replicationmigration.repositories.ServiceEventPredictionRepository;
import andre.replicationmigration.reqres.SaveServiceConfigReq;
import andre.replicationmigration.reqres.SaveServiceEventPredictionReq;

@Service
public class ServicesConfigsService {

    @Autowired
    private ServiceConfigRepository servicesConfigs;

    @Autowired
    private ServiceEventPredictionRepository serviceEventPredictionRepo;

    public boolean hasServiceLaunchConfig(String serviceName) {
        return !servicesConfigs.findByServiceNameIgnoreCase(serviceName).isEmpty();
    }

    public ServiceConfig getServiceLaunchConfig(String serviceName) {
        if (hasServiceLaunchConfig(serviceName))
            return servicesConfigs.findByServiceNameIgnoreCase(serviceName).get(0);

        return null;
    }

    public Iterable<ServiceConfig> getServicesConfigs() {
        return servicesConfigs.findAll();
    }

    public ServiceConfig getServicesConfigsById(long id) {
        return servicesConfigs.findOne(id);
    }

    public List<ServiceConfig> getServiceDependenciesByServiceId(long serviceId) {
        return servicesConfigs.getServiceDependencies(serviceId);
    }

    public List<ServiceConfig> getServicesByDockerRepo(String dockerRepo) {
        return servicesConfigs.findByDockerRepo(dockerRepo);
    }

    public boolean serviceDependsOnOtherService(long serviceId, String otherServiceName) {
        return servicesConfigs.serviceDependsOnOtherService(serviceId, otherServiceName) > 0;
    }

    public List<ServiceConfig> getDependenciesByType(long serviceId, String serviceType) {
        return servicesConfigs.getDependenciesByType(serviceId, serviceType);
    }

    public List<AppPackage> getAppsByServiceName(String serviceName) {
        return servicesConfigs.getAppsByServiceName(serviceName);
    }

    public long saveServiceConfig(long id, SaveServiceConfigReq saveServiceConfigReq) {
        ServiceConfig service = null;
        if (id > 0)
            service = servicesConfigs.findOne(id);
        else
            service = new ServiceConfig();

        service.setServiceName(saveServiceConfigReq.getServiceName());
        service.setDockerRepo(saveServiceConfigReq.getDockerRepo());
        service.setDefaultExternalPort(saveServiceConfigReq.getDefaultExternalPort());
        service.setDefaultInternalPort(saveServiceConfigReq.getDefaultInternalPort());
        service.setDefaultDb(saveServiceConfigReq.getDefaultDb());
        service.setLaunchCommand(saveServiceConfigReq.getLaunchCommand());
        service.setMinReplics(saveServiceConfigReq.getMinReplics());
        service.setMaxReplics(saveServiceConfigReq.getMaxReplics());
        service.setOutputLabel(saveServiceConfigReq.getOutputLabel());
        service.setServiceType(saveServiceConfigReq.getServiceType());

        return servicesConfigs.save(service).getId();
    }

    public long deleteServiceConfig(long id) {
        servicesConfigs.delete(id);
        return id;
    }

    public Iterable<ServiceEventPrediction> getServiceEventPredictions() {
        return serviceEventPredictionRepo.findAll();
    }

    public ServiceEventPrediction getServiceEventPredictionById(long id) {
        return serviceEventPredictionRepo.findOne(id);
    }

    public long saveServiceEventPrediction(long id, SaveServiceEventPredictionReq serviceEventPredictionReq) {
        ServiceEventPrediction serviceEventPredition = null;
        if (id > 0)
            serviceEventPredition = serviceEventPredictionRepo.findOne(id);
        else
            serviceEventPredition = new ServiceEventPrediction();

        ServiceConfig serviceConfig = servicesConfigs.findOne(serviceEventPredictionReq.getServiceId());
        serviceEventPredition.setServiceConfig(serviceConfig);
        serviceEventPredition.setDescription(serviceEventPredictionReq.getDescription());
        serviceEventPredition.setStartDate(serviceEventPredictionReq.getStartDateTimeStamp());
        serviceEventPredition.setEndDate(serviceEventPredictionReq.getEndDateTimeStamp());
        serviceEventPredition.setMinReplics(serviceEventPredictionReq.getMinReplics());
        serviceEventPredition.setLastUpdate(Timestamp.from(Instant.now()));

        return serviceEventPredictionRepo.save(serviceEventPredition).getId();
    }

    public long deleteServiceEventPrediction(long id) {
        serviceEventPredictionRepo.delete(id);
        return id;
    }

    public int getMinReplicsByServiceName(String serviceName) {
        Date date = new Date(System.currentTimeMillis());
        Integer customMinReplics = serviceEventPredictionRepo.getMinReplicsByServiceName(serviceName, date);
        return customMinReplics == null ? servicesConfigs.getMinReplicsByServiceName(serviceName) : customMinReplics;
    }

    public int getMaxReplicsByServiceName(String serviceName) {
        return servicesConfigs.getMaxReplicsByServiceName(serviceName);
    }

}