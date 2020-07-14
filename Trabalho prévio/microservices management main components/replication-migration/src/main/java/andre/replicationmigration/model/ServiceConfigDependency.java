package andre.replicationmigration.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "service_config_dependecy")
public class ServiceConfigDependency {

	@Id
	@GeneratedValue
	private long id;

	@JoinColumn(name = "service_config_id")
	@ManyToOne
	private ServiceConfig serviceConfig;

	@JoinColumn(name = "service_config_dependency_id")
	@ManyToOne
	private ServiceConfig serviceConfigDependecy;

	public ServiceConfigDependency() {
	}

	/**
	 * @return the id
	 */
	public long getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(long id) {
		this.id = id;
	}

	/**
	 * @return the serviceConfig
	 */
	public ServiceConfig getServiceConfig() {
		return serviceConfig;
	}

	/**
	 * @param serviceConfig the serviceConfig to set
	 */
	public void setServiceConfig(ServiceConfig serviceConfig) {
		this.serviceConfig = serviceConfig;
	}

	/**
	 * @return the serviceConfigDependecy
	 */
	public ServiceConfig getServiceConfigDependecy() {
		return serviceConfigDependecy;
	}

	/**
	 * @param serviceConfigDependecy the serviceConfigDependecy to set
	 */
	public void setServiceConfigDependecy(ServiceConfig serviceConfigDependecy) {
		this.serviceConfigDependecy = serviceConfigDependecy;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((serviceConfig == null) ? 0 : serviceConfig.hashCode());
		result = prime * result + ((serviceConfigDependecy == null) ? 0 : serviceConfigDependecy.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ServiceConfigDependency other = (ServiceConfigDependency) obj;
		if (serviceConfig == null) {
			if (other.serviceConfig != null)
				return false;
		} else if (!serviceConfig.equals(other.serviceConfig))
			return false;
		if (serviceConfigDependecy == null) {
			if (other.serviceConfigDependecy != null)
				return false;
		} else if (!serviceConfigDependecy.equals(other.serviceConfigDependecy))
			return false;
		return true;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ServiceConfigDependency [id=" + id + ", serviceConfig=" + serviceConfig + ", serviceConfigDependecy="
				+ serviceConfigDependecy + "]";
	}

}