package andre.replicationmigration.model.rules;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import andre.replicationmigration.model.AppPackage;

@Entity
@Table(name = "app_rule")
public class AppRule {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "app_package_id")
    private AppPackage appPackage;

    @ManyToOne
    @JoinColumn(name = "rule_id")
    private Rule rule;

    public AppRule() {
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
     * @return the appPackage
     */
    public AppPackage getAppPackage() {
        return appPackage;
    }

    /**
     * @param appPackage the appPackage to set
     */
    public void setAppPackage(AppPackage appPackage) {
        this.appPackage = appPackage;
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