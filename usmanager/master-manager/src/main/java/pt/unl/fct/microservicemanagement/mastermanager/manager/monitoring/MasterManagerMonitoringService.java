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
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.container.SimpleContainer;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.proxy.DockerApiProxyService;
import pt.unl.fct.microservicemanagement.mastermanager.manager.docker.proxy.LaunchDockerApiProxyException;

import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import com.spotify.docker.client.DockerClient;
import org.springframework.stereotype.Service;

@Service
public class MasterManagerMonitoringService {

  private static final String MASTER_MANAGER = "master-manager";

  private final DockerContainersService dockerContainersService;
  private final ContainersMonitoringService containersMonitoringService;
  private final DockerApiProxyService dockerApiProxyService;

  private final long monitorPeriod;
  private final boolean isTestLogsEnable;
  private boolean isProxyRunning;

  public MasterManagerMonitoringService(DockerContainersService dockerContainersService,
                                        ContainersMonitoringService containersMonitoringService,
                                        DockerApiProxyService dockerApiProxyService,
                                        MasterManagerProperties masterManagerProperties) {
    this.dockerContainersService = dockerContainersService;
    this.dockerApiProxyService = dockerApiProxyService;
    this.containersMonitoringService = containersMonitoringService;
    this.monitorPeriod = masterManagerProperties.getMonitorPeriod();
    this.isTestLogsEnable = masterManagerProperties.getTests().isTestLogsEnable();
    this.isProxyRunning = false;
  }

  public void initMasterManagerMonitorTimer() {
    if (isTestLogsEnable) {
      new Timer("masterManagerMonitorTimer", true).schedule(new TimerTask() {
        private long lastRun = System.currentTimeMillis();
        @Override
        public void run() {
          long currRun = System.currentTimeMillis();
          //TODO replace diffSeconds with calculation from previous database save
          int diffSeconds = (int) ((currRun - lastRun) / 1000);
          lastRun = currRun;
          masterManagerMonitorTask(diffSeconds);
        }
      }, monitorPeriod, monitorPeriod);
    }
  }

  private void masterManagerMonitorTask(int secondsFromLastRun) {
    if (!isProxyRunning) {
      try {
        dockerApiProxyService.launchDockerApiProxy("127.0.0.1");
        isProxyRunning = true;
      } catch (LaunchDockerApiProxyException e) {
        e.printStackTrace();
        isProxyRunning = false;
      }
    } else {
      List<SimpleContainer> container = dockerContainersService.getContainers(
          DockerClient.ListContainersParam.withLabel(DockerContainer.Label.SERVICE_NAME, MASTER_MANAGER));
      container.stream().findFirst().ifPresent(c -> saveMasterManagerContainerFields(c, secondsFromLastRun));
    }
  }

  private void saveMasterManagerContainerFields(SimpleContainer container, int secondsFromLastRun) {
    Map<String, Double> newFields = containersMonitoringService.getContainerStats(container, secondsFromLastRun);
    newFields.forEach((field, value) ->
        containersMonitoringService.saveMonitoringServiceLog(container.getId(), MASTER_MANAGER, field, value)
    );
  }

}
