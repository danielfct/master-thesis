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

import pt.unl.fct.microservicemanagement.mastermanager.MasterManagerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.ContainerConstants;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.ContainerEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.ContainersService;

import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

@Service
public class MasterManagerMonitoringService {

  private static final String MASTER_MANAGER = "master-manager";

  private final ContainersService containersService;
  private final ContainersMonitoringService containersMonitoringService;

  private final long monitorPeriod;
  private final boolean isTestLogsEnable;

  public MasterManagerMonitoringService(ContainersService containersService,
                                        ContainersMonitoringService containersMonitoringService,
                                        MasterManagerProperties masterManagerProperties) {
    this.containersService = containersService;
    this.containersMonitoringService = containersMonitoringService;
    this.monitorPeriod = masterManagerProperties.getMonitorPeriod();
    this.isTestLogsEnable = masterManagerProperties.getTests().isTestLogsEnable();
  }

  public void initMasterManagerMonitorTimer() {
    if (isTestLogsEnable) {
      new Timer("MasterManagerMonitorTimer", true).schedule(new TimerTask() {
        private long lastTime = System.currentTimeMillis();
        @Override
        public void run() {
          long currentTime = System.currentTimeMillis();
          //TODO replace diffSeconds with calculation from previous database save
          int secondsFromLastRun = (int) ((currentTime - lastTime) / 1000);
          lastTime = currentTime;
          masterManagerMonitorTask(secondsFromLastRun);
        }
      }, monitorPeriod, monitorPeriod);
    }
  }

  private void masterManagerMonitorTask(int secondsFromLastRun) {
    containersService
        .getContainersWithLabels(Set.of(Pair.of(ContainerConstants.Label.SERVICE_NAME, MASTER_MANAGER)))
        .stream()
        .findFirst()
        .ifPresent(c -> saveMasterManagerContainerFields(c, secondsFromLastRun));
  }

  private void saveMasterManagerContainerFields(ContainerEntity container, int secondsFromLastRun) {
    Map<String, Double> newFields = containersMonitoringService.getContainerStats(container, secondsFromLastRun);
    newFields.forEach((field, value) ->
        containersMonitoringService.saveMonitoringServiceLog(container.getContainerId(), MASTER_MANAGER, field, value)
    );
  }

}
