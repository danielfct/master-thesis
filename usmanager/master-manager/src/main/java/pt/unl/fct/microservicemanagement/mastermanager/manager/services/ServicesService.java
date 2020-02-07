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
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.dependency.ServiceDependency;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

@org.springframework.stereotype.Service
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

  public List<ServiceEntity> getDependencies(Long id) {
    return getService(id).getDependencies().stream()
        .map(ServiceDependency::getServiceDependency).collect(Collectors.toList());
  }

  @Transactional
  public void removeDependency(Long serviceId, Long dependencyId) {
    removeDependencies(serviceId, List.of(dependencyId));
  }

  @Transactional
  public void removeDependencies(Long serviceId, List<Long> dependenciesId) {
    var service = getService(serviceId);
    System.out.println(service.getDependencies());
    service.getDependencies().removeIf(dependency -> dependenciesId.contains(dependency.getId()));
    service = services.save(service);
    System.out.println(service.getDependencies());
  }


  public List<ServiceEntity> getServicesByDockerRepo(String dockerRepository) {
    return services.findByDockerRepository(dockerRepository);
  }

  /*public Long addService(Service service) {
        return services.save(service).getId();
    }

    public Long updateService(Long id, Service newService) {
        final var service = getService(id);
        Utils.copyValidProperties(newService, service);
        return services.save(service).getId();
    }*/

  public Long saveService(Long id, SaveServiceReq saveServiceConfigReq) {
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
  }

  public void deleteService(Long id) {
    var service = getService(id);
    services.delete(service);
  }

  public Iterable<EventPredictionEntity> getServiceEventPredictions(Long id) {
    return getService(id).getEventPredictions();
  }

  public EventPredictionEntity getEventPrediction(Long serviceId, Long eventPredictionId) {
    return getService(serviceId).getEventPredictions().stream().filter(
        prediction -> Objects.equals(prediction.getId(), eventPredictionId)
    ).findFirst().orElseThrow(() ->
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
    var service = services.findById(serviceEventPredictionReq.getServiceId()).get();
    var description = serviceEventPredictionReq.getDescription();
    var startDate = serviceEventPredictionReq.getStartDateTimeStamp();
    var endDate = serviceEventPredictionReq.getEndDateTimeStamp();
    var minReplicas = serviceEventPredictionReq.getMinReplics();
    var updateTime = Timestamp.from(Instant.now());
    EventPredictionEntity serviceEventPredition =
        (id > 0 ? serviceEventPredictions.findById(id).get().toBuilder() : EventPredictionEntity.builder())
        .service(service).description(description).startDate(startDate).endDate(endDate).minReplics(minReplicas)
        .lastUpdate(updateTime).build();
    return serviceEventPredictions.save(serviceEventPredition).getId();
  }

  public void deleteServiceEventPrediction(Long serviceId, Long serviceEventPredictionId) {
    // just to trigger the possible 404 not found
    getService(serviceId);
    var serviceEventPrediction = getEventPrediction(serviceId, serviceEventPredictionId);
    serviceEventPredictions.delete(serviceEventPrediction);
  }

  public boolean serviceDependsOnOtherService(Long serviceId, String otherServiceName) {
    return services.serviceDependsOnOtherService(serviceId, otherServiceName) > 0;
  }

  public List<ServiceEntity> getDependenciesByType(Long serviceId, String serviceType) {
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
