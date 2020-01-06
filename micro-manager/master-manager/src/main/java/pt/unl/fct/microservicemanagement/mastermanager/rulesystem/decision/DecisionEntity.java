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

package pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision;

import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.ComponentTypeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.event.HostEventEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.event.ServiceEvent;

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

@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "decision")
public class DecisionEntity {

  @Id
  @GeneratedValue
  private long id;

  @ManyToOne
  @JoinColumn(name = "component_type_id")
  private ComponentTypeEntity componentType;

  //TODO use enum
  // Possible values:
  // - NONE; - REPLICATE; - MIGRATE; - STOP;
  // - NONE; - START; - STOP
  @Column(name = "decision_name")
  private String decisionName;

  @JsonIgnore
  @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<RuleEntity> rules = new HashSet<>();

  @JsonIgnore
  @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ComponentDecisionLog> componentDecisionLogs = new HashSet<>();

  @JsonIgnore
  @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<HostEventEntity> hostEventEntities = new HashSet<>();

  @JsonIgnore
  @OneToMany(mappedBy = "decision", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceEvent> serviceEvents = new HashSet<>();

  public DecisionEntity(ComponentTypeEntity componentType, String decisionName) {
    this.componentType = componentType;
    this.decisionName = decisionName;
  }

}
