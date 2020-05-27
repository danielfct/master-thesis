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

import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.prediction.ServiceEventPredictionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.services.ServiceRuleEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends CrudRepository<ServiceEntity, Long> {

  Optional<ServiceEntity> findByServiceNameIgnoreCase(@Param("serviceName") String serviceName);

  List<ServiceEntity> findByDockerRepository(@Param("dockerRepository") String dockerRepository);

  @Query("select a.app "
      + "from ServiceEntity s join s.appServices a "
      + "where s.serviceName = :serviceName and a.app.name = :appName")
  Optional<AppEntity> getApp(@Param("serviceName") String serviceName, String appName);

  @Query("select d.dependency "
      + "from ServiceEntity s join s.dependencies d "
      + "where s.serviceName = :serviceName")
  List<ServiceEntity> getDependencies(@Param("serviceName") String serviceName);

  @Query("select d.service "
      + "from ServiceEntity s join s.depends d "
      + "where s.serviceName = :serviceName")
  List<ServiceEntity> getDependents(@Param("serviceName") String serviceName);

  @Query("select r "
      + "from ServiceEntity s join s.rules r "
      + "where r.generic = false and s.serviceName = :serviceName")
  List<ServiceRuleEntity> getRules(@Param("serviceName") String serviceName);

  @Query("select r "
      + "from ServiceEntity s join s.rules r "
      + "where r.generic = false and s.serviceName = :serviceName and r.name = :ruleName")
  Optional<ServiceRuleEntity> getRule(@Param("serviceName") String serviceName, @Param("ruleName") String ruleName);

  @Query("select case when count(s) > 0 then true else false end "
      + "from ServiceEntity s "
      + "where s.id = :serviceId")
  boolean hasService(@Param("serviceId") long serviceId);

  @Query("select case when count(s) > 0 then true else false end "
      + "from ServiceEntity s "
      + "where lower(s.serviceName) = lower(:serviceName)")
  boolean hasService(@Param("serviceName") String serviceName);

  @Query("select apps.app "
      + "from ServiceEntity s join s.appServices apps "
      + "where s.serviceName = :serviceName")
  List<AppEntity> getAppsByServiceName(@Param("serviceName") String serviceName);

  @Query("select d.dependency "
      + "from ServiceEntity s join s.dependencies d "
      + "where s.serviceName = :serviceName and d.dependency.serviceName = :dependencyName")
  Optional<ServiceEntity> getDependency(@Param("serviceName") String serviceName,
                                        @Param("dependencyName") String dependencyName);

  @Query("select case when count(d) > 0 then true else false end "
      + "from ServiceEntity s join s.dependencies d "
      + "where s.serviceName = :serviceName and d.dependency.serviceName = :otherServiceName")
  boolean serviceDependsOnOtherService(@Param("serviceName") String serviceName,
                                       @Param("otherServiceName") String otherServiceName);

  @Query("select d.dependency "
      + "from ServiceEntity s join s.dependencies d "
      + "where s.serviceName = :serviceName and d.dependency.serviceType = :serviceType")
  List<ServiceEntity> getDependenciesByType(@Param("serviceName") String serviceName,
                                            @Param("serviceType") ServiceType serviceType);

  @Query("select p "
      + "from ServiceEntity s join s.eventPredictions p "
      + "where s.serviceName = :serviceName")
  List<ServiceEventPredictionEntity> getPredictions(@Param("serviceName") String serviceName);

  @Query("select p "
      + "from ServiceEntity s join s.eventPredictions p "
      + "where s.id = :serviceId and p.id = :serviceEventPredictions")
  Optional<ServiceEventPredictionEntity> getPrediction(@Param("serviceId") long serviceId,
                                                       @Param("serviceEventPredictions")
                                                    long serviceEventPredictions);

  @Query("select s.maxReplicas "
      + "from ServiceEntity s "
      + "where s.serviceName = :serviceName")
  int getMaxReplicasByServiceName(@Param("serviceName") String serviceName);

  @Query("select s.minReplicas "
      + "from ServiceEntity s "
      + "where s.serviceName = :serviceName")
  int getMinReplicasByServiceName(@Param("serviceName") String serviceName);

}
