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

package pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

@Service
public class SimulatedMetricsService {

  private final ServiceSimulatedMetricsRepository serviceSimulatedMetrics;
  private final ContainerSimulatedMetricsRepository containerSimulatedMetrics;
  private final DefaultHostSimulatedMetricsRepository defaultHostSimulatedMetrics;
  private final SpecificHostSimulatedMetricsRepository specificHostSimulatedMetrics;

  public SimulatedMetricsService(ServiceSimulatedMetricsRepository serviceSimulatedMetrics,
                                 ContainerSimulatedMetricsRepository containerSimulatedMetrics,
                                 DefaultHostSimulatedMetricsRepository defaultHostSimulatedMetrics,
                                 SpecificHostSimulatedMetricsRepository specificHostSimulatedMetrics) {
    this.serviceSimulatedMetrics = serviceSimulatedMetrics;
    this.containerSimulatedMetrics = containerSimulatedMetrics;
    this.defaultHostSimulatedMetrics = defaultHostSimulatedMetrics;
    this.specificHostSimulatedMetrics = specificHostSimulatedMetrics;
  }

  public Iterable<ServiceSimulatedMetricsEntity> getServiceSimulatedMetrics() {
    return serviceSimulatedMetrics.findAll();
  }

  public ServiceSimulatedMetricsEntity getServiceSimulatedMetric(long id) {
    return serviceSimulatedMetrics.findById(id).orElseThrow(NotFoundException::new);
  }

  public long saveServiceSimulatedMetrics(long id, ServiceSimulatedMetricsEntity serviceSimulatedMetric) {
    if (id > 0) {
      serviceSimulatedMetric.setId(id);
    }
    return serviceSimulatedMetrics.save(serviceSimulatedMetric).getId();
  }

  public void deleteServiceSimulatedMetrics(long id) {
    final var serviceSimulatedMetric = serviceSimulatedMetrics.findById(id)
        .orElseThrow(NotFoundException::new);
    serviceSimulatedMetrics.delete(serviceSimulatedMetric);
  }


  public Iterable<ContainerSimulatedMetricsEntity> getAllContainerSimulatedMetrics() {
    return containerSimulatedMetrics.findAll();
  }

  public ContainerSimulatedMetricsEntity getContainerSimulatedMetric(long id) {
    return containerSimulatedMetrics.findById(id)
        .orElseThrow(NotFoundException::new);
  }

  public long saveContainerSimulatedMetrics(long id,
                                            final ContainerSimulatedMetricsEntity containerSimulatedMetric) {
    if (id > 0) {
      containerSimulatedMetric.setId(id);
    }
    return containerSimulatedMetrics.save(containerSimulatedMetric).getId();
  }

  public void deleteContainerSimulatedMetric(long id) {
    final var containerSimulatedMetric = containerSimulatedMetrics.findById(id)
        .orElseThrow(NotFoundException::new);
    containerSimulatedMetrics.delete(containerSimulatedMetric);
  }


  public Iterable<DefaultHostSimulatedMetricsEntity> getAllDefaultHostSimulatedMetrics() {
    return defaultHostSimulatedMetrics.findAll();
  }

  public DefaultHostSimulatedMetricsEntity getDefaultHostSimulatedMetric(long id) {
    return defaultHostSimulatedMetrics.findById(id)
        .orElseThrow(NotFoundException::new);
  }

  public long saveDefaultHostSimulatedMetrics(long id, DefaultHostSimulatedMetricsEntity defaultHostSimulatedMetric) {
    if (id > 0) {
      defaultHostSimulatedMetric.setId(id);
    }
    return defaultHostSimulatedMetrics.save(defaultHostSimulatedMetric).getId();
  }

  public void deleteDefaultHostSimulatedMetric(long id) {
    final var defaultHostSimulatedMetric = defaultHostSimulatedMetrics.findById(id).orElseThrow(NotFoundException::new);
    defaultHostSimulatedMetrics.delete(defaultHostSimulatedMetric);
  }

  public Iterable<SpecificHostSimulatedMetricsEntity> getAllSpecificHostSimulatedMetrics() {
    return specificHostSimulatedMetrics.findAll();
  }

  public SpecificHostSimulatedMetricsEntity getSpecificHostSimulatedMetric(long id) {
    return specificHostSimulatedMetrics.findById(id)
        .orElseThrow(NotFoundException::new);
  }

  public long saveSpecificHostSimulatedMetrics(long id,
                                               SpecificHostSimulatedMetricsEntity specificHostSimulatedMetric) {
    if (id > 0) {
      specificHostSimulatedMetric.setId(id);
    }
    return specificHostSimulatedMetrics.save(specificHostSimulatedMetric).getId();
  }

  public void deleteSpecificHostSimulatedMetric(long id) {
    final var specificHostSimulatedMetric = specificHostSimulatedMetrics.findById(id)
        .orElseThrow(NotFoundException::new);
    specificHostSimulatedMetrics.delete(specificHostSimulatedMetric);
  }

  /*public Pair<Double, Boolean> getHostFieldValue(String hostname, String field) {
    List<DefaultHostSimulatedMetrics> defaultMetrics = getDefaultHostSimulatedMetricsByField(field);
    List<SpecificHostSimulatedMetrics> specificMetrics = getSpecificHostSimulatedMetricsByHostnameAndField(hostname,
        field);

    if (defaultMetrics.isEmpty() && specificMetrics.isEmpty())
      return Pair.of(-1.0, false);

    boolean defaultMetricIsOverride = false;
    boolean specificMetricIsOverride = false;
    Double defaultMetricsValue = null;
    Double specificMetricsValue = null;
    double minValue = 0;
    double maxValue = 0;
    Random r = new Random();

    if (!defaultMetrics.isEmpty()) {
      minValue = defaultMetrics.get(0).getMinValue();
      maxValue = defaultMetrics.get(0).getMaxValue();
      defaultMetricIsOverride = defaultMetrics.get(0).getOverride();
      defaultMetricsValue = minValue + (maxValue - minValue) * r.nextDouble();
    }
    if (!specificMetrics.isEmpty()) {
      minValue = specificMetrics.get(0).getMinValue();
      maxValue = specificMetrics.get(0).getMaxValue();
      specificMetricIsOverride = specificMetrics.get(0).getOverride();
      specificMetricsValue = minValue + (maxValue - minValue) * r.nextDouble();
    }

    boolean overrideReal = defaultMetricIsOverride || specificMetricIsOverride;

    if (specificMetricsValue != null
        && (specificMetricIsOverride || (!defaultMetricIsOverride && !specificMetricIsOverride))) {
      return Pair.of(specificMetricsValue, overrideReal);
    } else if (defaultMetricsValue != null)
      return Pair.of(defaultMetricsValue, overrideReal);
    else
      return Pair.of(-1.0, false);
  }*/

  public Optional<Double> getHostFieldValue(String hostname, String field) {
    var random = new Random();
    Optional<Optional<Double>> randomSpecificMetric =
        specificHostSimulatedMetrics.findByHostnameAndField(hostname, field).stream()
        .findFirst()
        .map(metric -> {
          double minValue = metric.getMinValue();
          double maxValue = metric.getMaxValue();
          boolean override = metric.isOverride();
          double value = minValue + (maxValue - minValue) * random.nextDouble();
          return override ? Optional.of(value) : Optional.empty();
        });
    if (randomSpecificMetric.isPresent()) {
      return randomSpecificMetric.get();
    }
    Optional<Optional<Double>> randomDefaultMetric = defaultHostSimulatedMetrics.findByField(field).stream()
        .findFirst()
        .map(metric -> {
          double minValue = metric.getMinValue();
          double maxValue = metric.getMaxValue();
          boolean override = metric.isOverride();
          double value = minValue + (maxValue - minValue) * random.nextDouble();
          return override ? Optional.of(value) : Optional.empty();
        });
    return randomDefaultMetric.orElseGet(Optional::empty);
  }

  public Map<String, Double> getContainerFieldsValue(String serviceName, String containerId) {
    final var fields = new HashMap<String, Double>();
    //TODO valores devem vir da base de dados
    final var fieldNames = List.of("cpu", "ram", "cpu-%", "ram-%", "rx-bytes", "tx-bytes",
        "rx-bytes-per-sec", "tx-bytes-per-sec", "latency", "bandwidth-%");
    for (String fieldName : fieldNames) {
      final Pair<Double, Boolean> field = getContainerFieldValue(serviceName, containerId, fieldName);
      if (field.getFirst() != -1.0 && field.getSecond()) {
        fields.put(fieldName, field.getFirst());
      }
    }
    return fields;
  }

  Pair<Double, Boolean> getContainerFieldValue(String serviceName, String containerId, String field) {
    List<ServiceSimulatedMetricsEntity> defaultMetrics =
        serviceSimulatedMetrics.findByServiceNameAndField(serviceName, field);
    final List<ContainerSimulatedMetricsEntity> specificMetrics =
        containerSimulatedMetrics.findByContainerIdAndField(containerId, field);
    var random = new Random();
    boolean defaultMetricIsOverride = false;
    Double defaultMetricsValue = null;
    if (!defaultMetrics.isEmpty()) {
      final var minValue = defaultMetrics.get(0).getMinValue();
      final var maxValue = defaultMetrics.get(0).getMaxValue();
      defaultMetricIsOverride = defaultMetrics.get(0).isOverride();
      defaultMetricsValue = minValue + (maxValue - minValue) * random.nextDouble();
    }
    boolean specificMetricIsOverride = false;
    Double specificMetricsValue = null;
    if (!specificMetrics.isEmpty()) {
      final var minValue = specificMetrics.get(0).getMinValue();
      final var maxValue = specificMetrics.get(0).getMaxValue();
      specificMetricIsOverride = specificMetrics.get(0).isOverride();
      specificMetricsValue = minValue + (maxValue - minValue) * random.nextDouble();
    }
    boolean override = defaultMetricIsOverride || specificMetricIsOverride;
    if (specificMetricsValue != null && (specificMetricIsOverride || !defaultMetricIsOverride)) {
      return Pair.of(specificMetricsValue, override);
    } else if (defaultMetricsValue != null) {
      return Pair.of(defaultMetricsValue, override);
    } else {
      return Pair.of(-1.0, false);
    }
  }

}
