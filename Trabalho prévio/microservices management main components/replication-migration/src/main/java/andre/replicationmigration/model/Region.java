package andre.replicationmigration.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "region")
public class Region {

	@Id
	@GeneratedValue
	private Long id;

	@Column(name = "region_name", unique = true)
	private String regionName;

	@Column(name = "region_description")
	private String regionDescription;

	@Column(name = "active")
	private boolean active;

	public Region() {
	}

	public Region(String regionName, String regionDescription, boolean active) {
		this.regionName = regionName;
		this.regionDescription = regionDescription;
		this.active = active;
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
	 * @return the regionName
	 */
	public String getRegionName() {
		return regionName;
	}

	/**
	 * @param regionName the regionName to set
	 */
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	/**
	 * @return the regionDescription
	 */
	public String getRegionDescription() {
		return regionDescription;
	}

	/**
	 * @param regionDescription the regionDescription to set
	 */
	public void setRegionDescription(String regionDescription) {
		this.regionDescription = regionDescription;
	}

	/**
	 * @return the active
	 */
	public boolean getActive() {
		return active;
	}

	/**
	 * @param active the active to set
	 */
	public void setActive(boolean active) {
		this.active = active;
	}

}