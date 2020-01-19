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

package pt.unl.fct.microservicemanagement.mastermanager.microservices;

import pt.unl.fct.microservicemanagement.mastermanager.microservices.dependancy.ServiceDependency;
import pt.unl.fct.microservicemanagement.mastermanager.prediction.ServiceEventPrediction;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.ServiceRule;

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
import org.apache.logging.log4j.util.Strings;

@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "service")
public class Service {

  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "service_name", unique = true)
  private String serviceName;

  @Column(name = "docker_repository")
  private String dockerRepository;

  @Column(name = "default_external_port")
  private String defaultExternalPort;

  @Column(name = "default_internal_port")
  private String defaultInternalPort;

  @Column(name = "default_db")
  private String defaultDb;

  @Column(name = "launch_command")
  private String launchCommand;

  @Column(name = "min_replics")
  private int minReplics;

  @Column(name = "max_replics")
  private int maxReplics;

  @Column(name = "output_label")
  private String outputLabel;

  //TODO use enum https://vladmihalcea.com/the-best-way-to-map-an-enum-type-with-jpa-and-hibernate/
  // VALUES: frontend, backend, database
  @Column(name = "service_type")
  private String serviceType;

  // Average memory consumption in bytes
  @Column(name = "expected_memory_consumption")
  private double expectedMemoryConsumption;

  @JsonIgnore
  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<AppService> appServices;

  @JsonIgnore
  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceDependency> dependencies;

  @JsonIgnore
  @OneToMany(mappedBy = "serviceDependency", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceDependency> dependsOn;

  @JsonIgnore
  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceEventPrediction> serviceEventPredictions;

  @JsonIgnore
  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceRule> serviceRules;

  public boolean hasLaunchCommand() {
    return !Strings.isEmpty(launchCommand);
  }

}
