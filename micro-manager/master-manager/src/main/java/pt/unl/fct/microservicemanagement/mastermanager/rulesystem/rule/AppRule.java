/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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

package pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import pt.unl.fct.microservicemanagement.mastermanager.microservices.AppPackage;

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
    private RuleEntity rule;

    public AppRule() { }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public AppPackage getAppPackage() {
        return appPackage;
    }

    public void setAppPackage(AppPackage appPackage) {
        this.appPackage = appPackage;
    }

    public RuleEntity getRule() {
        return rule;
    }

    public void setRule(RuleEntity rule) {
        this.rule = rule;
    }

}