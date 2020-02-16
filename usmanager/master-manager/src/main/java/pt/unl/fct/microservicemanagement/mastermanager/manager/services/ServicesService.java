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

package pt.unl.fct.microservicemanagement.mastermanager.manager.services;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.EntityNotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppPackage;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.EventPredictionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.SaveServiceEventPredictionReq;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.ServiceEventPredictionRepository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import pt.unl.fct.microservicemanagement.mastermanager.util.ObjectUtils;

@Service
public class ServicesService {

  private final ServiceRepository services;
  private final ServiceEventPredictionRepository serviceEventPredictions;

  public ServicesService(ServiceRepository services, ServiceEventPredictionRepository serviceEventPredictions) {
    this.services = services;
    this.serviceEventPredictions = serviceEventPredictions;
  }

  public Iterable<ServiceEntity> getServices() {
    return services.findAll();
  }

  public ServiceEntity getService(Long id) {
    return services.findById(id).orElseThrow(() ->
        new EntityNotFoundException(ServiceEntity.class, "id", id.toString()));
  }

  public ServiceEntity getService(String serviceName) {
    return services.findByServiceNameIgnoreCase(serviceName).orElseThrow(() ->
        new EntityNotFoundException(ServiceEntity.class, "serviceName", serviceName));
  }

  public List<ServiceEntity> getServicesByDockerRepository(String dockerRepository) {
    return services.findByDockerRepository(dockerRepository);
  }

  public Long addService(ServiceEntity service) {
    return services.save(service).getId();
  }

  public Long updateService(String serviceName, ServiceEntity newService) {
    final var service = getService(serviceName);
    ObjectUtils.copyValidProperties(newService, service);
    return services.save(service).getId();
  }

  /*  public Long saveService(String serviceName, SaveServiceReq saveServiceConfigReq) {
    var service = id > 0 ? getService(id) : new ServiceEntity();
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
  }*/

  public void deleteService(Long id) {
    var service = getService(id);
    services.delete(service);
  }

  public List<ServiceEntity> getDependencies(Long id) {
    assertServiceExists(id);
    return services.getDependencies(id);
  }

  public List<ServiceEntity> getDependenciesByType(Long serviceId, String serviceType) {
    assertServiceExists(serviceId);
    return services.getDependenciesByType(serviceId, serviceType);
  }

  public boolean serviceDependsOnOtherService(Long serviceId, String otherServiceName) {
    assertServiceExists(serviceId);
    assertServiceExists(otherServiceName);
    return services.serviceDependsOnOtherService(serviceId, otherServiceName);
  }

  public void removeDependency(Long serviceId, Long dependencyId) {
    removeDependencies(serviceId, List.of(dependencyId));
  }

  public void removeDependencies(Long serviceId, List<Long> dependenciesId) {
    var service = getService(serviceId);
    System.out.println(service.getDependencies());
    service.getDependencies().removeIf(dependency -> dependenciesId.contains(dependency.getId()));
    service = services.save(service);
    System.out.println(service.getDependencies());
  }

  public Iterable<EventPredictionEntity> getServiceEventPredictions(Long id) {
    assertServiceExists(id);
    return services.getServiceEventPredictions(id);
  }

  public EventPredictionEntity getEventPrediction(Long serviceId, Long eventPredictionId) {
    assertServiceExists(serviceId);
    return services.getServiceEventPrediction(serviceId, eventPredictionId).orElseThrow(() ->
        new EntityNotFoundException(EventPredictionEntity.class, "eventPredictionId", eventPredictionId.toString())
    );
  }

  /*public Long addServiceEventPrediction(Long serviceId, ServiceEventPrediction serviceEventPrediction) {
        services.findById(serviceId).orElseThrow(NotFoundException::new);
        //TODO add serviceEventPrediction to service and then save it
        return serviceEventPredictions.save(serviceEventPrediction).getId();
    }

    public void updateServiceEventPrediction(Long serviceId,
                                             final Long serviceEventPredictionId,
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

  public Long saveServiceEventPrediction(Long id, SaveServiceEventPredictionReq serviceEventPredictionReq) {
    var service = getService(serviceEventPredictionReq.getServiceId());
    var description = serviceEventPredictionReq.getDescription();
    var startDate = serviceEventPredictionReq.getStartDateTimeStamp();
    var endDate = serviceEventPredictionReq.getEndDateTimeStamp();
    var minReplicas = serviceEventPredictionReq.getMinReplics();
    var updateTime = Timestamp.from(Instant.now());

    /*EventPredictionEntity serviceEventPredition =
        (id > 0 ? getEventPrediction(service.getId(), id).toBuilder() : EventPredictionEntity.builder())
            .service(service).description(description).startDate(startDate).endDate(endDate).minReplics(minReplicas)
            .lastUpdate(updateTime).build();
    service.addEventPrediction(serviceEventPredition);
    services.save(service);*/

    EventPredictionEntity serviceEventPredition =
        (id > 0 ? serviceEventPredictions.findById(id).get().toBuilder() : EventPredictionEntity.builder())
            .service(service).description(description).startDate(startDate).endDate(endDate).minReplics(minReplicas)
            .lastUpdate(updateTime).build();
    return serviceEventPredictions.save(serviceEventPredition).getId();
  }

  public void deleteServiceEventPrediction(Long serviceId, Long serviceEventPredictionId) {
    var serviceEventPrediction = getEventPrediction(serviceId, serviceEventPredictionId);
    serviceEventPredictions.delete(serviceEventPrediction);
  }

  public AppPackage getApp(String serviceName) {
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

  private void assertServiceExists(Long serviceId) {
    if (!services.hasService(serviceId)) {
      throw new EntityNotFoundException(ServiceEntity.class, "id", serviceId.toString());
    }
  }

  private void assertServiceExists(String serviceName) {
    if (!services.hasService(serviceName)) {
      throw new EntityNotFoundException(ServiceEntity.class, "serviceName", serviceName.toString());
    }
  }

}