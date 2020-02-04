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

package pt.unl.fct.microservicemanagement.mastermanager.docker.container;

public final class DockerContainer {

  private DockerContainer() {
  }

  public static final class Environment {
    public static final String SERVICE_CONTINENT = "SERVICE_CONTINENT";
    public static final String SERVICE_REGION = "SERVICE_REGION";
    public static final String SERVICE_COUNTRY = "SERVICE_COUNTRY";
    public static final String SERVICE_CITY = "SERVICE_CITY";
  }

  public static final class Label {
    public static final String SERVICE_NAME = "serviceName";
    public static final String SERVICE_TYPE = "serviceType";
    public static final String SERVICE_ADDRESS = "serviceAddr";
    public static final String SERVICE_HOSTNAME = "serviceHostname";
    public static final String SERVICE_CONTINENT = "serviceContinent";
    public static final String SERVICE_REGION = "serviceRegion";
    public static final String SERVICE_COUNTRY = "serviceCountry";
    public static final String SERVICE_CITY = "serviceCity";
    public static final String FOR_SERVICE = "forService";
  }

}
