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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.condition.ConditionEntity;

@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "operator")
public class OperatorEntity {

  @Id
  @GeneratedValue
  private long id;

  // Possible values:
  // - NOT_EQUAL_TO; - EQUAL_TO; - GREATER_THAN; - LESS_THAN;
  // - GREATER_THAN_OR_EQUAL_TO; - LESS_THAN_OR_EQUAL_TO
  //TODO enum
  @Column(name = "operator_name", unique = true)
  private String operatorName;

  @Column(name = "operator_symbol", unique = true)
  private String operatorSymbol;

  @JsonIgnore
  @OneToMany(mappedBy = "operator", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ConditionEntity> conditions = new HashSet<>();

  public OperatorEntity(String operatorName, String operatorSymbol) {
    this.operatorName = operatorName;
    this.operatorSymbol = operatorSymbol;
  }

}
