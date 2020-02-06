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

package pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring;

import pt.unl.fct.microservicemanagement.mastermanager.manager.monitoring.event.HostEventRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionsService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.event.HostEventEntity;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class HostsEventsService {

  private final HostEventRepository hostEvents;
  private final DecisionsService decisionsService;

  public HostsEventsService(HostEventRepository hostEvents, DecisionsService decisionsService) {
    this.hostEvents = hostEvents;
    this.decisionsService = decisionsService;
  }

  public List<HostEventEntity> getHostEventsByHostname(String hostname) {
    return hostEvents.findByHostname(hostname);
  }

  HostEventEntity saveHostEvent(String hostname, String decisionName) {
    DecisionEntity decision =
        decisionsService.getDecisionByComponentTypeAndByDecisionName("HOST", decisionName);
    HostEventEntity hostEventEntity = this.hostEvents.findByHostname(hostname).stream().findFirst()
        .orElse(HostEventEntity.builder().hostname(hostname).decision(decision).count(0).build());
    if (hostEventEntity.getDecision().getId() != decision.getId()) {
      hostEventEntity.setDecision(decision);
      hostEventEntity.setCount(1);
    } else {
      hostEventEntity.setCount(hostEventEntity.getCount() + 1);
    }
    return this.hostEvents.save(hostEventEntity);
  }

}
