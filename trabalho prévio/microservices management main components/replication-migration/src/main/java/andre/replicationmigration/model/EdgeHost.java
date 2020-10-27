package andre.replicationmigration.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "edge_host")
public class EdgeHost {

	@Id
	@GeneratedValue
	private Long id;

	@Column(name = "hostname", unique = true)
	private String hostname;

	@Column(name = "ssh_username")
	private String sshUsername;

	// Base64 format
	@Column(name = "ssh_password")
	private String sshPassword;

	// AWS region
	@Column(name = "region")
	private String region;

	@Column(name = "country")
	private String country;

	@Column(name = "city")
	private String city;

	@Column(name = "is_local")
	private boolean isLocal;

	public EdgeHost() {
	}

	public EdgeHost(String hostname, String sshUsername, String sshPassword, String region,
			String country, String city, boolean isLocal) {
		this.hostname = hostname;
		this.sshUsername = sshUsername;
		this.sshPassword = sshPassword;
		this.region = region;
		this.country = country;
		this.city = city;
		this.isLocal = isLocal;
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
	 * @return the hostname
	 */
	public String getHostname() {
		return hostname;
	}

	/**
	 * @param hostname the hostname to set
	 */
	public void setHostname(String hostname) {
		this.hostname = hostname;
	}

	/**
	 * @return the sshUsername
	 */
	public String getSshUsername() {
		return sshUsername;
	}

	/**
	 * @param sshUsername the sshUsername to set
	 */
	public void setSshUsername(String sshUsername) {
		this.sshUsername = sshUsername;
	}

	/**
	 * @return the sshPassword
	 */
	public String getSshPassword() {
		return sshPassword;
	}

	/**
	 * @param sshPassword the sshPassword to set
	 */
	public void setSshPassword(String sshPassword) {
		this.sshPassword = sshPassword;
	}

	/**
	 * @return the region
	 */
	public String getRegion() {
		return region;
	}

	/**
	 * @param region the region to set
	 */
	public void setRegion(String region) {
		this.region = region;
	}

	/**
	 * @return the country
	 */
	public String getCountry() {
		return country;
	}

	/**
	 * @param country the country to set
	 */
	public void setCountry(String country) {
		this.country = country;
	}

	/**
	 * @return the city
	 */
	public String getCity() {
		return city;
	}

	/**
	 * @param city the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}

	/**
	 * @return the isLocal
	 */
	public boolean isLocal() {
		return isLocal;
	}

	/**
	 * @param isLocal the isLocal to set
	 */
	public void setLocal(boolean isLocal) {
		this.isLocal = isLocal;
	}

}