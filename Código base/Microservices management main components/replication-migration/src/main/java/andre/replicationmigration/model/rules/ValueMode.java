package andre.replicationmigration.model.rules;

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

@Entity
@Table(name = "value_mode")
public class ValueMode {

    @Id
    @GeneratedValue
    private long id;
   
    @Column(name = "value_mode_name")
    private String valueModeName;

    @JsonIgnore
    @OneToMany(mappedBy = "valueMode", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Condition> conditions = new HashSet<>();

    public ValueMode() {
    }

    public ValueMode(String valueModeName) {
        this.valueModeName = valueModeName;       
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
     * @return the valueModeName
     */
    public String getValueModeName() {
        return valueModeName;
    }

    /**
     * @param valueModeName the valueModeName to set
     */
    public void setValueModeName(String valueModeName) {
        this.valueModeName = valueModeName;
    }

    /**
     * @return the conditions
     */
    public Set<Condition> getConditions() {
        return conditions;
    }

    /**
     * @param conditions the conditions to set
     */
    public void setConditions(Set<Condition> conditions) {
        this.conditions = conditions;
    }    

}