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

package pt.unl.fct.microservicemanagement.mastermanager.monitoring;

import pt.unl.fct.microservicemanagement.mastermanager.MasterManagerProperties;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.DockerContainer;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.DockerContainersService;
import pt.unl.fct.microservicemanagement.mastermanager.docker.container.SimpleContainer;
import pt.unl.fct.microservicemanagement.mastermanager.docker.proxy.DockerApiProxyService;
import pt.unl.fct.microservicemanagement.mastermanager.docker.proxy.LaunchDockerApiProxyException;
import pt.unl.fct.microservicemanagement.mastermanager.util.Text;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import com.spotify.docker.client.DockerClient;
import org.springframework.stereotype.Service;

@Service
public class MasterManagerMonitoringService {

  private final DockerContainersService dockerContainersService;
  private final ContainersMonitoringService containersMonitoringService;
  private final DockerApiProxyService dockerApiProxyService;

  private final long monitorPeriod;
  private final boolean isTestLogsEnable;
  private final String masterManagerHostname;
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
    this.masterManagerHostname = masterManagerProperties.getHostname();
    this.isProxyRunning = false;
  }

  public void initMasterManagerMonitorTimer() {
    if (isTestLogsEnable && !Text.isNullOrEmpty(masterManagerHostname)) {
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
    //TODO proxy is not running yet from hostsService.initManager()?
    if (!isProxyRunning) {
      try {
        dockerApiProxyService.launchDockerApiProxy(masterManagerHostname);
        isProxyRunning = true;
      } catch (LaunchDockerApiProxyException e) {
        e.printStackTrace();
        isProxyRunning = false;
      }
    } else {
      List<SimpleContainer> container =
          dockerContainersService.getContainers(DockerClient.ListContainersParam.withLabel(
          DockerContainer.Label.SERVICE_NAME, "master-manager"));
      container.stream().findFirst().ifPresent(c -> saveMasterManagerContainerFields(c, secondsFromLastRun));
    }
  }

  private void saveMasterManagerContainerFields(SimpleContainer container, int secondsFromLastRun) {
    final var newFields = containersMonitoringService.getContainerStats(container, secondsFromLastRun);
    newFields.forEach((field, value) -> {
      final var containerId = container.getId();
      final var serviceName = "master-manager";
      containersMonitoringService.saveMonitoringServiceLog(containerId, serviceName, field, value);
    });
  }

}
