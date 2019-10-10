package andre.replicationmigration.model.rules;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "host_rule")
public class HostRule {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "hostname")
    private String hostname;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private Rule rule;

    public HostRule() {
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
     * @return the rule
     */
    public Rule getRule() {
        return rule;
    }

    /**
     * @param rule the rule to set
     */
    public void setRule(Rule rule) {
        this.rule = rule;
    }

}