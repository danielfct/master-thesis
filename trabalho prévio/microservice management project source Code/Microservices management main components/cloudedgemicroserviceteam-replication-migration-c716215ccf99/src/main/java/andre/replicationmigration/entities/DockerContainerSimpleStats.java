package andre.replicationmigration.entities;

import java.util.Date;
import java.util.Map;

import com.spotify.docker.client.messages.BlockIoStats;
import com.spotify.docker.client.messages.CpuStats;
import com.spotify.docker.client.messages.MemoryStats;
import com.spotify.docker.client.messages.NetworkStats;

public class DockerContainerSimpleStats {

    private DockerSimpleContainer container;
    private Date read;
    private NetworkStats networkStats;
    private Map<String, NetworkStats> networksStats;
    private MemoryStats memoryStats;
    private BlockIoStats blockIoStats;
    private CpuStats cpuStats;
    private CpuStats preCpuStats;

    public DockerContainerSimpleStats(DockerSimpleContainer container, Date read, NetworkStats networkStats,
            Map<String, NetworkStats> networksStats, MemoryStats memoryStats, BlockIoStats blockIoStats,
            CpuStats cpuStats, CpuStats preCpuStats) {
        this.container = container;
        this.read = read;
        this.networkStats = networkStats;
        this.networksStats = networksStats;
        this.memoryStats = memoryStats;
        this.blockIoStats = blockIoStats;
        this.cpuStats = cpuStats;
        this.preCpuStats = preCpuStats;
    }

    /**
     * @return the container
     */
    public DockerSimpleContainer getContainer() {
        return container;
    }

    /**
     * @param container the container to set
     */
    public void setContainer(DockerSimpleContainer container) {
        this.container = container;
    }

    /**
     * @return the read
     */
    public Date getRead() {
        return read;
    }

    /**
     * @param read the read to set
     */
    public void setRead(Date read) {
        this.read = read;
    }

    /**
     * @return the networkStats
     */
    public NetworkStats getNetworkStats() {
        return networkStats;
    }

    /**
     * @param networkStats the networkStats to set
     */
    public void setNetworkStats(NetworkStats networkStats) {
        this.networkStats = networkStats;
    }

    /**
     * @return the networksStats
     */
    public Map<String, NetworkStats> getNetworksStats() {
        return networksStats;
    }

    /**
     * @param networksStats the networksStats to set
     */
    public void setNetworksStats(Map<String, NetworkStats> networksStats) {
        this.networksStats = networksStats;
    }

    /**
     * @return the memoryStats
     */
    public MemoryStats getMemoryStats() {
        return memoryStats;
    }

    /**
     * @param memoryStats the memoryStats to set
     */
    public void setMemoryStats(MemoryStats memoryStats) {
        this.memoryStats = memoryStats;
    }

    /**
     * @return the blockIoStats
     */
    public BlockIoStats getBlockIoStats() {
        return blockIoStats;
    }

    /**
     * @param blockIoStats the blockIoStats to set
     */
    public void setBlockIoStats(BlockIoStats blockIoStats) {
        this.blockIoStats = blockIoStats;
    }

    /**
     * @return the cpuStats
     */
    public CpuStats getCpuStats() {
        return cpuStats;
    }

    /**
     * @param cpuStats the cpuStats to set
     */
    public void setCpuStats(CpuStats cpuStats) {
        this.cpuStats = cpuStats;
    }

    /**
     * @return the preCpuStats
     */
    public CpuStats getPreCpuStats() {
        return preCpuStats;
    }

    /**
     * @param preCpuStats the preCpuStats to set
     */
    public void setPreCpuStats(CpuStats preCpuStats) {
        this.preCpuStats = preCpuStats;
    }

}