package andre.replicationmigration.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import andre.replicationmigration.model.rules.AppRule;

@Entity
@Table(name = "app_package")
public class AppPackage {

	@Id
	@GeneratedValue
	private Long id;

	@Column(name = "app_name")
	private String appName;

	@JsonIgnore
	@OneToMany(mappedBy = "appPackage", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<AppService> appServices = new HashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "appPackage", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<AppRule> appRules = new HashSet<>();

	public AppPackage() {
	}

	public AppPackage(String appName) {
		this.appName = appName;
	}

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the appName
	 */
	public String getAppName() {
		return appName;
	}

	/**
	 * @param appName the appName to set
	 */
	public void setAppName(String appName) {
		this.appName = appName;
	}

	/**
	 * @return the appServices
	 */
	public Set<AppService> getAppServices() {
		return appServices;
	}

	/**
	 * @param appServices the appServices to set
	 */
	public void setAppServices(Set<AppService> appServices) {
		this.appServices = appServices;
	}

	/**
	 * @return the appRules
	 */
	public Set<AppRule> getAppRules() {
		return appRules;
	}

	/**
	 * @param appRules the appRules to set
	 */
	public void setAppRules(Set<AppRule> appRules) {
		this.appRules = appRules;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((appName == null) ? 0 : appName.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		AppPackage other = (AppPackage) obj;
		if (appName == null) {
			if (other.appName != null)
				return false;
		} else if (!appName.equals(other.appName))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
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
		return "AppPackage [id=" + id + ", appName=" + appName + ", appServices=" + appServices + ", appRules="
				+ appRules + "]";
	}

}