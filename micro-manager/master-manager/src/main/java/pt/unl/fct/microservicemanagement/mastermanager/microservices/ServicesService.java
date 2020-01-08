/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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

package pt.unl.fct.microservicemanagement.mastermanager.microservices;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.prediction.SaveServiceEventPredictionReq;
import pt.unl.fct.microservicemanagement.mastermanager.prediction.ServiceEventPrediction;
import pt.unl.fct.microservicemanagement.mastermanager.prediction.ServiceEventPredictionRepository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@org.springframework.stereotype.Service
public class ServicesService {

  private final ServiceRepository services;
  private final ServiceEventPredictionRepository serviceEventPredictions;

  public ServicesService(ServiceRepository services, ServiceEventPredictionRepository serviceEventPredictions) {
    this.services = services;
    this.serviceEventPredictions = serviceEventPredictions;
  }

  public Service getServiceLaunchConfig(String serviceName) {
    return services.findByServiceNameIgnoreCase(serviceName).orElseThrow(NotFoundException::new);
  }

  public Iterable<Service> getServices() {
    return services.findAll();
  }

  public Service getService(long id) {
    return services.findById(id).orElseThrow(NotFoundException::new);
  }

  public List<Service> getServiceDependencies(long serviceId) {
    return services.getServiceDependencies(serviceId);
  }

  public List<Service> getServicesByDockerRepo(String dockerRepository) {
    return services.findByDockerRepository(dockerRepository);
  }

  /*public long addService(Service service) {
        return services.save(service).getId();
    }

    public long updateService(long id, Service newService) {
        final var service = services.findById(id).orElseThrow(NotFoundException::new);
        Utils.copyValidProperties(newService, service);
        return services.save(service).getId();
    }*/

  public long saveService(long id, SaveServiceReq saveServiceConfigReq) {
    var service = id > 0 ? getService(id) : new Service();
    service.setServiceName(saveServiceConfigReq.getServiceName());
    service.setDockerRepository(saveServiceConfigReq.getDockerRepo());
    service.setDefaultExternalPort(saveServiceConfigReq.getDefaultExternalPort());
    service.setDefaultInternalPort(saveServiceConfigReq.getDefaultInternalPort());
    service.setDefaultDb(saveServiceConfigReq.getDefaultDb());
    service.setLaunchCommand(saveServiceConfigReq.getLaunchCommand());
    service.setMinReplics(saveServiceConfigReq.getMinReplics());
    service.setMaxReplics(saveServiceConfigReq.getMaxReplics());
    service.setOutputLabel(saveServiceConfigReq.getOutputLabel());
    service.setServiceType(saveServiceConfigReq.getServiceType());
    return services.save(service).getId();
  }

  public void deleteService(long id) {
    services.deleteById(id);
  }

  public Iterable<ServiceEventPrediction> getServiceEventPredictions(long serviceId) {
    var service = services.findById(serviceId).orElseThrow(NotFoundException::new);
    return service.getServiceEventPredictions();
  }

  public ServiceEventPrediction getServiceEventPrediction(long serviceId, long serviceEventPredictionId) {
    return services.getServiceEventPrediction(serviceId, serviceEventPredictionId)
        .orElseThrow(() -> new NotFoundException("Service event prediction with id '%d' not found", serviceId));
  }

  /*public long addServiceEventPrediction(long serviceId,
                                          final ServiceEventPrediction serviceEventPrediction) {
        services.findById(serviceId).orElseThrow(NotFoundException::new);
        return serviceEventPredictions.save(serviceEventPrediction).getId();
    }

    public void updateServiceEventPrediction(long serviceId,
                                             final long serviceEventPredictionId,
                                             final ServiceEventPrediction newServiceEventPrediction) {
        final var service = services.findById(serviceId)
                .orElseThrow(NotFoundException::new);
        final var serviceEventPrediction = services.getServiceEventPrediction(serviceId, serviceEventPredictionId)
                .orElseThrow(NotFoundException::new);
        Utils.copyValidProperties(newServiceEventPrediction, serviceEventPrediction);
        serviceEventPrediction.setService(service);
        serviceEventPrediction.setLastUpdate(Timestamp.from(Instant.now()));
        serviceEventPredictions.save(serviceEventPrediction);
    }*/

  public long saveServiceEventPrediction(long id, SaveServiceEventPredictionReq serviceEventPredictionReq) {
    ServiceEventPrediction serviceEventPredition = id > 0
        ? serviceEventPredictions.findById(id).get()
        : new ServiceEventPrediction();
    Service serviceConfig = services.findById(serviceEventPredictionReq.getServiceId()).get();
    serviceEventPredition.setService(serviceConfig);
    serviceEventPredition.setDescription(serviceEventPredictionReq.getDescription());
    serviceEventPredition.setStartDate(serviceEventPredictionReq.getStartDateTimeStamp());
    serviceEventPredition.setEndDate(serviceEventPredictionReq.getEndDateTimeStamp());
    serviceEventPredition.setMinReplics(serviceEventPredictionReq.getMinReplics());
    serviceEventPredition.setLastUpdate(Timestamp.from(Instant.now()));

    return serviceEventPredictions.save(serviceEventPredition).getId();
  }

  public void deleteServiceEventPrediction(long serviceId, long serviceEventPredictionId) {
    final var serviceEventPrediction = services.getServiceEventPrediction(serviceId, serviceEventPredictionId)
        .orElseThrow(NotFoundException::new);
    serviceEventPredictions.delete(serviceEventPrediction);
  }

  public boolean serviceDependsOnOtherService(long serviceId, String otherServiceName) {
    return services.serviceDependsOnOtherService(serviceId, otherServiceName) > 0;
  }

  public List<Service> getDependenciesByType(long serviceId, String serviceType) {
    return services.getDependenciesByType(serviceId, serviceType);
  }

  public AppPackage getAppByServiceName(String serviceName) {
    return services.getAppsByServiceName(serviceName);
  }

  public int getMinReplicsByServiceName(String serviceName) {
    final var date = new Date(System.currentTimeMillis());
    Integer customMinReplics = serviceEventPredictions.getMinReplicsByServiceName(serviceName, date);
    return customMinReplics == null ? services.getMinReplicsByServiceName(serviceName) : customMinReplics;
  }

  public int getMaxReplicsByServiceName(String serviceName) {
    return services.getMaxReplicsByServiceName(serviceName);
  }

}
