package andre.replicationmigration.services.metrics;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.metrics.ContainerSimulatedMetrics;
import andre.replicationmigration.model.metrics.DefaultHostSimulatedMetrics;
import andre.replicationmigration.model.metrics.ServiceSimulatedMetrics;
import andre.replicationmigration.model.metrics.SpecificHostSimulatedMetrics;
import andre.replicationmigration.repositories.metrics.ContainerSimulatedMetricsRepository;
import andre.replicationmigration.repositories.metrics.DefaultHostSimulatedMetricsRepository;
import andre.replicationmigration.repositories.metrics.ServiceSimulatedMetricsRepository;
import andre.replicationmigration.repositories.metrics.SpecificHostSimulatedMetricsRepository;

@Service
public class SimulatedMetricsDataService {

    @Autowired
    private ServiceSimulatedMetricsRepository serviceSimulatedMetricsRepo;

    @Autowired
    private ContainerSimulatedMetricsRepository containerSimulatedMetricsRepo;

    @Autowired
    private DefaultHostSimulatedMetricsRepository defaultHostSimulatedMetricsRepo;

    @Autowired
    private SpecificHostSimulatedMetricsRepository specificHostSimulatedMetricsRepo;

    public Iterable<ServiceSimulatedMetrics> getAllServiceSimulatedMetrics() {
        return serviceSimulatedMetricsRepo.findAll();
    }

    public ServiceSimulatedMetrics getServiceSimulatedMetricsById(long id) {
        return serviceSimulatedMetricsRepo.findOne(id);
    }

    public List<ServiceSimulatedMetrics> getServiceSimulatedMetricsByServiceName(String serviceName) {
        return serviceSimulatedMetricsRepo.findByServiceName(serviceName);
    }

    public List<ServiceSimulatedMetrics> getServiceSimulatedMetricsByServiceNameAndField(String serviceName,
            String field) {
        return serviceSimulatedMetricsRepo.findByServiceNameAndField(serviceName, field);
    }

    public long saveServiceSimulatedMetrics(long id, ServiceSimulatedMetrics serviceSimulatedMetrics) {
        if (id > 0)
            serviceSimulatedMetrics.setId(id);

        return serviceSimulatedMetricsRepo.save(serviceSimulatedMetrics).getId();
    }

    public long deleteServiceSimulatedMetrics(long id) {
        serviceSimulatedMetricsRepo.delete(id);

        return id;
    }

    public Iterable<ContainerSimulatedMetrics> getAllContainerSimulatedMetrics() {
        return containerSimulatedMetricsRepo.findAll();
    }

    public ContainerSimulatedMetrics getContainerSimulatedMetricsById(long id) {
        return containerSimulatedMetricsRepo.findOne(id);
    }

    public List<ContainerSimulatedMetrics> getContainerSimulatedMetricsByContainerId(String containerId) {
        return containerSimulatedMetricsRepo.findByContainerId(containerId);
    }

    public List<ContainerSimulatedMetrics> getContainerSimulatedMetricsByContainerIdAndField(String containerId,
            String field) {
        return containerSimulatedMetricsRepo.findByContainerIdAndField(containerId, field);
    }

    public long saveContainerSimulatedMetrics(long id, ContainerSimulatedMetrics containerSimulatedMetrics) {
        if (id > 0)
            containerSimulatedMetrics.setId(id);

        return containerSimulatedMetricsRepo.save(containerSimulatedMetrics).getId();
    }

    public long deleteContainerSimulatedMetrics(long id) {
        containerSimulatedMetricsRepo.delete(id);

        return id;
    }

    public Iterable<DefaultHostSimulatedMetrics> getAllDefaultHostSimulatedMetrics() {
        return defaultHostSimulatedMetricsRepo.findAll();
    }

    public DefaultHostSimulatedMetrics getDefaultHostSimulatedMetricsById(long id) {
        return defaultHostSimulatedMetricsRepo.findOne(id);
    }

    public List<DefaultHostSimulatedMetrics> getDefaultHostSimulatedMetricsByField(String field) {
        return defaultHostSimulatedMetricsRepo.findByField(field);
    }

    public long saveDefaultHostSimulatedMetrics(long id, DefaultHostSimulatedMetrics defaultHostSimulatedMetrics) {
        if (id > 0)
            defaultHostSimulatedMetrics.setId(id);

        return defaultHostSimulatedMetricsRepo.save(defaultHostSimulatedMetrics).getId();
    }

    public long deleteDefaultHostSimulatedMetrics(long id) {
        defaultHostSimulatedMetricsRepo.delete(id);

        return id;
    }

    public Iterable<SpecificHostSimulatedMetrics> getAllSpecificHostSimulatedMetrics() {
        return specificHostSimulatedMetricsRepo.findAll();
    }

    public SpecificHostSimulatedMetrics getSpecificHostSimulatedMetricsById(long id) {
        return specificHostSimulatedMetricsRepo.findOne(id);
    }

    public List<SpecificHostSimulatedMetrics> getSpecificHostSimulatedMetricsByHostname(String hostname) {
        return specificHostSimulatedMetricsRepo.findByHostname(hostname);
    }

    public List<SpecificHostSimulatedMetrics> getSpecificHostSimulatedMetricsByHostnameAndField(String hostname,
            String field) {
        return specificHostSimulatedMetricsRepo.findByHostnameAndField(hostname, field);
    }

    public long saveSpecificHostSimulatedMetrics(long id, SpecificHostSimulatedMetrics specificHostSimulatedMetrics) {
        if (id > 0)
            specificHostSimulatedMetrics.setId(id);

        return specificHostSimulatedMetricsRepo.save(specificHostSimulatedMetrics).getId();
    }

    public long deleteSpecificHostSimulatedMetrics(long id) {
        specificHostSimulatedMetricsRepo.delete(id);

        return id;
    }

    public Pair<Double, Boolean> getHostFieldValue(String hostname, String field) {
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
    }

    public Pair<Double, Boolean> getContainerFieldValue(String serviceName, String containerId, String field) {
        List<ServiceSimulatedMetrics> defaultMetrics = getServiceSimulatedMetricsByServiceNameAndField(serviceName,
                field);
        List<ContainerSimulatedMetrics> specificMetrics = getContainerSimulatedMetricsByContainerIdAndField(containerId,
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
    }

}