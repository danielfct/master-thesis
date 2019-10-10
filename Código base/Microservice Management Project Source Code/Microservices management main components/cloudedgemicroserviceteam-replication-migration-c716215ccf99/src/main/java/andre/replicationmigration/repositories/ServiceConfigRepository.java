package andre.replicationmigration.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.model.ServiceConfig;

@Repository
public interface ServiceConfigRepository extends CrudRepository<ServiceConfig, Long> {

	List<ServiceConfig> findByServiceNameIgnoreCase(@Param("serviceName") String serviceName);

	List<ServiceConfig> findByDockerRepo(@Param("dockerRepo") String dockerRepo);

	@Query("select d.serviceConfigDependecy"
			+ " from ServiceConfig s inner join s.dependencies d where s.id = :serviceId")
	List<ServiceConfig> getServiceDependencies(@Param("serviceId") long serviceId);

	@Query("select count (*)"
			+ " from ServiceConfig s inner join s.dependencies d where s.id = :serviceId and d.serviceConfigDependecy.serviceName = :otherServiceName")
	int serviceDependsOnOtherService(@Param("serviceId") long serviceId, @Param("otherServiceName") String otherServiceName);

	@Query("select d.serviceConfigDependecy"
			+ " from ServiceConfig s inner join s.dependencies d where s.id = :serviceId and d.serviceConfigDependecy.serviceType = :serviceType")
	List<ServiceConfig> getDependenciesByType(@Param("serviceId") long serviceId, @Param("serviceType") String serviceType);

	@Query("select apps.appPackage from ServiceConfig s inner join s.appServices apps where s.serviceName = :serviceName")
	List<AppPackage> getAppsByServiceName(@Param("serviceName") String serviceName);

	@Query("select s.maxReplics from ServiceConfig s where s.serviceName = :serviceName")
	int getMaxReplicsByServiceName(@Param("serviceName") String serviceName);

	@Query("select s.minReplics from ServiceConfig s where s.serviceName = :serviceName")
	int getMinReplicsByServiceName(@Param("serviceName") String serviceName);

}
