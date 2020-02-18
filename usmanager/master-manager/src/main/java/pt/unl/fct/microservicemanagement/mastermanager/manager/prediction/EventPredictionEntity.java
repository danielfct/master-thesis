/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
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

package pt.unl.fct.microservicemanagement.mastermanager.manager.prediction;

import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;

import java.sql.Timestamp;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder(toBuilder = true)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor
@Setter
@Getter
@Table(name = "service_event_predictions")
public class EventPredictionEntity {

  @Id
  @GeneratedValue
  private Long id;

  @JoinColumn(name = "service_id")
  @ManyToOne
  private ServiceEntity service;

  @Column(name = "description")
  private String description;

  @Basic
  @Column(name = "start_date")
  private Timestamp startDate;

  @Basic
  @Column(name = "start_time")
  private Timestamp startTime;

  @Basic
  @Column(name = "end_date")
  private Timestamp endDate;

  @Basic
  @Column(name = "end_time")
  private Timestamp endTime;

  @Column(name = "min_replics")
  private int minReplics;

  @Basic
  @Column(name = "last_update")
  @JsonIgnore
  private Timestamp lastUpdate;

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof EventPredictionEntity)) {
      return false;
    }
    EventPredictionEntity other = (EventPredictionEntity) o;
    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
