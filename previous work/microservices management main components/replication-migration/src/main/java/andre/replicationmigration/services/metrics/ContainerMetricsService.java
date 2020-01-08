package andre.replicationmigration.services.metrics;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.spotify.docker.client.messages.ContainerStats;
import com.spotify.docker.client.messages.CpuStats;
import com.spotify.docker.client.messages.MemoryStats;
import com.spotify.docker.client.messages.NetworkStats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.DockerContainerSimpleStats;
import andre.replicationmigration.entities.DockerSimpleContainer;
import andre.replicationmigration.services.DockerCore;

@Service
public class ContainerMetricsService {

    @Autowired
    private DockerCore dockerCore;

    @Autowired
    private SimulatedMetricsDataService simulatedMetricsDataService;

    public Map<String, Double> getContainerStats(DockerSimpleContainer container) {
        ContainerStats stats = dockerCore.getContainerStats(container.getHostname(), container.getId());
        if (stats == null) {
            Map<String, Double> fields = new HashMap<>();
            return fields;
        } else {
            DockerContainerSimpleStats simpleStats = new DockerContainerSimpleStats(container, stats.read(),
                    stats.network(), stats.networks(), stats.memoryStats(), stats.blockIoStats(), stats.cpuStats(),
                    stats.precpuStats());
            return getFieldsFromStats(simpleStats);
        }
    }

    private Map<String, Double> getFieldsFromStats(DockerContainerSimpleStats simpleStats) {
        Map<String, Double> fields = new HashMap<>();
        try {
            String containerId = simpleStats.getContainer().getId();
            String containerName = simpleStats.getContainer().getNames().isEmpty() ? "" : simpleStats.getContainer().getNames().get(0);
            String serviceName = simpleStats.getContainer().getLabels().getOrDefault("serviceName", containerName);
            boolean hasServiceName = simpleStats.getContainer().getLabels().containsKey("serviceName");
            double cpu = simpleStats.getCpuStats().cpuUsage().totalUsage().doubleValue();
            double ram = simpleStats.getMemoryStats().usage().doubleValue();
            double cpuPerc = getContainerCpuPercent(simpleStats.getPreCpuStats(), simpleStats.getCpuStats());
            double ramPerc = getContainerRamPercent(simpleStats.getMemoryStats());
            Pair<Double, Double> rxTxStats = getRxTxStats(simpleStats.getNetworksStats());

            fields.put("cpu", cpu);
            fields.put("ram", ram);
            fields.put("cpu-%", cpuPerc);
            fields.put("ram-%", ramPerc);
            fields.put("rx-bytes", rxTxStats.getFirst());
            fields.put("tx-bytes", rxTxStats.getSecond());
    
            if(hasServiceName) {
                for (Entry<String, Double> simulatedField : getSimulatedMetrics(serviceName, containerId).entrySet()) {
                    fields.put(simulatedField.getKey(), simulatedField.getValue());
                }
            }
            
        } catch(Exception e) {
            System.out.println("-> Failed to get container stats.");
            Map<String, Double> emptyFields = new HashMap<>();
            return emptyFields;
        }        
        return fields;
    }

    private Pair<Double, Double> getRxTxStats(Map<String, NetworkStats> networksStats) {
        double rxBytes = 0;
        double txBytes = 0;
        for(NetworkStats stats : networksStats.values()) {
            rxBytes += stats.rxBytes().doubleValue();
            txBytes += stats.txBytes().doubleValue();
        }
        return Pair.of(rxBytes, txBytes);
    }

    private Map<String, Double> getSimulatedMetrics(String serviceName, String containerId) {
        Map<String, Double> fields = new HashMap<>();

        Pair<Double, Boolean> cpu = simulatedMetricsDataService.getContainerFieldValue(serviceName, containerId, "cpu");
        Pair<Double, Boolean> ram = simulatedMetricsDataService.getContainerFieldValue(serviceName, containerId, "ram");
        Pair<Double, Boolean> cpuPerc = simulatedMetricsDataService.getContainerFieldValue(serviceName, containerId,
                "cpu-%");
        Pair<Double, Boolean> ramPerc = simulatedMetricsDataService.getContainerFieldValue(serviceName, containerId,
                "ram-%");       
        Pair<Double, Boolean> rxBytes = simulatedMetricsDataService.getContainerFieldValue(serviceName,
                containerId, "rx-bytes");
        Pair<Double, Boolean> txBytes = simulatedMetricsDataService.getContainerFieldValue(serviceName,
                containerId, "tx-bytes");
        Pair<Double, Boolean> rxBytesPerSec = simulatedMetricsDataService.getContainerFieldValue(serviceName,
                containerId, "rx-bytes-per-sec");
        Pair<Double, Boolean> txBytesPerSec = simulatedMetricsDataService.getContainerFieldValue(serviceName,
                containerId, "tx-bytes-per-sec");
        Pair<Double, Boolean> latency = simulatedMetricsDataService.getContainerFieldValue(serviceName, containerId,
                "latency");
        Pair<Double, Boolean> bandwidthPerc = simulatedMetricsDataService.getContainerFieldValue(serviceName,
                containerId, "bandwidth-%");

        if (cpu.getFirst() != -1.0 && cpu.getSecond())
            fields.put("cpu", cpu.getFirst());

        if (ram.getFirst() != -1.0 && ram.getSecond())
            fields.put("ram", ram.getFirst());

        if (cpuPerc.getFirst() != -1.0 && cpuPerc.getSecond())
            fields.put("cpu-%", cpuPerc.getFirst());

        if (ramPerc.getFirst() != -1.0 && ramPerc.getSecond())
            fields.put("ram-%", ramPerc.getFirst());

        if (rxBytes.getFirst() != -1.0 && rxBytes.getSecond())
            fields.put("rx-bytes", rxBytes.getFirst());

        if (txBytes.getFirst() != -1.0 && txBytes.getSecond())
            fields.put("tx-bytes", txBytes.getFirst());

        if (rxBytesPerSec.getFirst() != -1.0 && rxBytesPerSec.getSecond())
            fields.put("rx-bytes-per-sec", rxBytesPerSec.getFirst());

        if (txBytesPerSec.getFirst() != -1.0 && txBytesPerSec.getSecond())
            fields.put("tx-bytes-per-sec", txBytesPerSec.getFirst());

        if (latency.getFirst() != -1.0)
            fields.put("latency", latency.getFirst());

        if (bandwidthPerc.getFirst() != -1.0)
            fields.put("bandwidth-%", bandwidthPerc.getFirst());

        return fields;
    }

    private double getContainerCpuPercent(CpuStats preCpuStats, CpuStats cpuStats) {
        double cpuPercent = 0.0;

        double cpuDelta = cpuStats.cpuUsage().totalUsage().doubleValue()
                - preCpuStats.cpuUsage().totalUsage().doubleValue();

        double systemDelta = cpuStats.systemCpuUsage().doubleValue() - preCpuStats.systemCpuUsage().doubleValue();
        double onlineCPUs = getOnlineCpus(cpuStats.cpuUsage().percpuUsage());

        if (systemDelta > 0.0 && cpuDelta > 0.0)
            cpuPercent = (cpuDelta / systemDelta) * onlineCPUs * 100.0;

        return cpuPercent;
    }

    private int getOnlineCpus(List<Long> perCpuUsage) {
        int count = 0;
        for (Long cpuUsage : perCpuUsage) {
            if (cpuUsage > 0)
                count++;
            else
                break;
        }
        return count;
    }

    private double getContainerRamPercent(MemoryStats memStats) {
        double ramPercent = 0.0;
        if (memStats.limit() > 0)
            ramPercent = (memStats.usage().doubleValue() / memStats.limit().doubleValue()) * 100.0;

        return ramPercent;
    }

    public static double getDeviationPercent(double avg, double value) {
        double deviation = value - avg;
        return (deviation / avg) * 100.0;
    }

}