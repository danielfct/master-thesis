package andre.replicationmigration.services.metrics;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import andre.replicationmigration.services.PrometheusService;

@Service
public class HostMetricsService {

    @Autowired
    private PrometheusService prometheusService;

    @Autowired
    private SimulatedMetricsDataService simulatedMetricsDataService;

    private double maxRamPerc;
    private double maxCpuPerc;

    @Autowired
    public HostMetricsService(@Value("${replic.prop.host-max-ram-perc}") double maxRamPerc,
            @Value("${replic.prop.host-max-cpu-perc}") double maxCpuPerc) {
        this.maxRamPerc = maxRamPerc;
        this.maxCpuPerc = maxCpuPerc;
    }

    public boolean hasHostAvailableResources(String hostname, double avgContainerMem) {
        double totalRam = prometheusService.getTotalMemory(hostname, PrometheusService.DEFAULT_PORT);
        double availableRam = prometheusService.getAvailableMemory(hostname, PrometheusService.DEFAULT_PORT);
        double cpuUsagePerc = prometheusService.getCpuUsagePercent(hostname, PrometheusService.DEFAULT_PORT);

        double predRamUsage = (1.0 - ((availableRam - avgContainerMem) / totalRam)) * 100.0;
        boolean isAvailable = predRamUsage < maxRamPerc; //Ignoring CPU: cpuUsagePerc < maxCpuPerc 
        return  isAvailable;
    }

    public Map<String, Double> getHostStats(String hostname) {
        Map<String, Double> fields = new HashMap<>();

        double cpuPerc = prometheusService.getCpuUsagePercent(hostname, PrometheusService.DEFAULT_PORT);
        double ramPerc = prometheusService.getMemoryUsagePercent(hostname, PrometheusService.DEFAULT_PORT);
        if (cpuPerc != -1)
            fields.put("cpu-%", cpuPerc);
        if (ramPerc != -1)
            fields.put("ram-%", ramPerc);

        for (Entry<String, Double> simulatedField : getSimulatedMetrics(hostname).entrySet()) {
            fields.put(simulatedField.getKey(), simulatedField.getValue());
        }

        return fields;
    }

    private Map<String, Double> getSimulatedMetrics(String hostname) {
        Map<String, Double> fields = new HashMap<>();

        Pair<Double, Boolean> cpu = simulatedMetricsDataService.getHostFieldValue(hostname, "cpu");
        Pair<Double, Boolean> ram = simulatedMetricsDataService.getHostFieldValue(hostname, "ram");
        Pair<Double, Boolean> cpuPerc = simulatedMetricsDataService.getHostFieldValue(hostname, "cpu-%");
        Pair<Double, Boolean> ramPerc = simulatedMetricsDataService.getHostFieldValue(hostname, "ram-%");
        Pair<Double, Boolean> bandwidthPerc = simulatedMetricsDataService.getHostFieldValue(hostname, "bandwidth-%");

        if (cpu.getFirst() != -1.0)
            fields.put("cpu", cpu.getFirst());

        if (ram.getFirst() != -1.0)
            fields.put("ram", ram.getFirst());

        if (cpuPerc.getFirst() != -1.0 && cpuPerc.getSecond())
            fields.put("cpu-%", cpuPerc.getFirst());

        if (ramPerc.getFirst() != -1.0 && ramPerc.getSecond())
            fields.put("ram-%", ramPerc.getFirst());

        if (bandwidthPerc.getFirst() != -1.0)
            fields.put("bandwidth-%", bandwidthPerc.getFirst());

        return fields;
    }

    public static double getDeviationPercent(double avg, double value) {
        double deviation = value - avg;
        return (deviation / avg) * 100.0;
    }

}