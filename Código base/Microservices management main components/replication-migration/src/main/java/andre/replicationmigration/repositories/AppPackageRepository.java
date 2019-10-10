package andre.replicationmigration.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import andre.replicationmigration.model.AppPackage;
import andre.replicationmigration.entities.ServiceConfigOrder;


@Repository
public interface AppPackageRepository extends CrudRepository<AppPackage, Long> {

	List<AppPackage> findByAppName(@Param("appName") String appName);

	@Query("select new andre.replicationmigration.entities.ServiceConfigOrder(s.serviceConfig, s.launchOrder)"
			+ " from AppPackage a inner join a.appServices s where a.id = :appId"
			+ " order by s.launchOrder")
	List<ServiceConfigOrder> getServiceConfigOrderByApp(@Param("appId") long appId);
	
}
