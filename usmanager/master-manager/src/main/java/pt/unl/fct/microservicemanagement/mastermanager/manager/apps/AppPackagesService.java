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

package pt.unl.fct.microservicemanagement.mastermanager.manager.apps;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceOrder;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AppPackagesService {

  private final AppPackageRepository apps;

  public AppPackagesService(AppPackageRepository apps) {
    this.apps = apps;
  }

  public Iterable<AppPackage> getApps() {
    return apps.findAll();
  }

  public AppPackage getApp(long id) {
    return apps.findById(id)
        .orElseThrow(() -> new NotFoundException("App package not found"));
  }

  public List<ServiceOrder> getServiceByAppId(long appId) {
    return apps.getServiceOrderByService(appId);
  }

  public long saveApp(long id, SaveAppReq saveAppReq) {
    AppPackage app = id > 0 ? getApp(id) : new AppPackage();
    app.setName(saveAppReq.getAppName());
    return apps.save(app).getId();
  }

  /*public long addApp(String appName) {
    final var app = new AppPackage(appName);
    return apps.save(app).getId();
  }

  public void updateApp(long id, String appName) {
    final var app = getApp(id);
    app.setAppName(appName);
    apps.save(app);
  }*/

  public void deleteApp(long id) {
    final var appPackage = getApp(id);
    apps.delete(appPackage);
  }

}
