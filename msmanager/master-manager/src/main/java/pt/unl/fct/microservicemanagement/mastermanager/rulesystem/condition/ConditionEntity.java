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

package pt.unl.fct.microservicemanagement.mastermanager.rulesystem.condition;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.Field;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.OperatorEntity;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.ValueMode;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleConditionEntity;

@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "condition")
public class ConditionEntity {

  @Id
  @GeneratedValue
  private long id;

  @ManyToOne
  @JoinColumn(name = "value_mode_id")
  private ValueMode valueMode;

  @ManyToOne
  @JoinColumn(name = "field_id")
  private Field field;

  @ManyToOne
  @JoinColumn(name = "operator_id")
  private OperatorEntity operator;

  @Column(name = "condition_value")
  private double conditionValue;

  @JsonIgnore
  @OneToMany(mappedBy = "condition", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<RuleConditionEntity> ruleConditions = new HashSet<>();

  public ConditionEntity(ValueMode valueMode, Field field, OperatorEntity operator, double conditionValue) {
    this.valueMode = valueMode;
    this.field = field;
    this.operator = operator;
    this.conditionValue = conditionValue;
  }

}
