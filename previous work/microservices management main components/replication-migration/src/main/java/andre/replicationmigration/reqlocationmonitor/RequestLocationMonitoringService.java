package andre.replicationmigration.reqlocationmonitor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import andre.replicationmigration.entities.DockerSimpleNode;
import andre.replicationmigration.entities.HostDetails;
import andre.replicationmigration.model.Region;
import andre.replicationmigration.services.DockerCore;
import andre.replicationmigration.services.HostService;
import andre.replicationmigration.services.RegionService;
import andre.replicationmigration.util.rules.ContainerDecisionResult;

@Service
public class RequestLocationMonitoringService {

    @Autowired
    private RegionService regionService;

    @Autowired
    private RequestLocationMonitorApi requestLocationMonitorApi;

    @Autowired
    private DockerCore dockerCore;

    @Autowired
    private HostService hostService;

    private double minReqCountPercentage;

    @Autowired
    public RequestLocationMonitoringService(
            @Value("${replic.prop.min-req-count-percentage}") double minReqCountPercentage) {
        this.minReqCountPercentage = minReqCountPercentage;
    }

    public Map<String, HostDetails> getBestLocationToStartServices(
            Map<String, List<ContainerDecisionResult>> allDecisions, int seconds) {
        Pair<Map<String, Map<String, Integer>>, Map<String, Integer>> servicesLocationMonitoring = getLocationMonitoring(
                seconds);
        Map<String, HostDetails> finalLocations = new HashMap<>();
        for (Entry<String, List<ContainerDecisionResult>> services : allDecisions.entrySet()) {
            String serviceName = services.getKey();
            List<ContainerDecisionResult> serviceAllDecisions = services.getValue();
            if (servicesLocationMonitoring.getSecond().containsKey(serviceName)) {
                if (!serviceAllDecisions.isEmpty()) {
                    HostDetails location = getBestLocationByService(serviceName,
                            servicesLocationMonitoring.getFirst().get(serviceName),
                            servicesLocationMonitoring.getSecond().get(serviceName),
                            getLocationsbyRunningContainers(serviceAllDecisions));
                    if (location != null) {
                        finalLocations.put(serviceName, location);
                    }
                }
            }
        }
        return finalLocations;
    }

    private Pair<Map<String, Map<String, Integer>>, Map<String, Integer>> getLocationMonitoring(int seconds) {
        List<DockerSimpleNode> nodes = dockerCore.getAvailableNodes();
        Map<String, Map<String, Integer>> serviceCountLocations = new HashMap<>();
        Map<String, Integer> serviceTotalRequestCount = new HashMap<>();
        List<LocationMonitoringResp> allLocationMonitoringData = new ArrayList<>();

        for (DockerSimpleNode node : nodes) {
            String hostname = node.getHostname();
            allLocationMonitoringData.addAll(requestLocationMonitorApi.getAllMonitoringDataTop(hostname, seconds));
        }
        for (LocationMonitoringResp locationMonitoringResp : allLocationMonitoringData) {
            int count = locationMonitoringResp.getLocationData().getCount();
            String serviceName = locationMonitoringResp.getToService();
            String fromContinent = locationMonitoringResp.getLocationData().getFromContinent();
            String fromRegion = locationMonitoringResp.getLocationData().getFromRegion();
            String fromCountry = locationMonitoringResp.getLocationData().getFromCountry();
            String fromCity = locationMonitoringResp.getLocationData().getFromCity();

            List<String> locationKeys = getLocationsKeys(fromContinent, fromRegion, fromCountry, fromCity);

            if (serviceCountLocations.containsKey(serviceName)) {
                int newTotalReqCount = serviceTotalRequestCount.get(serviceName) + count;
                serviceTotalRequestCount.put(serviceName, newTotalReqCount);
                Map<String, Integer> countLocations = serviceCountLocations.get(serviceName);
                for (String locationKey : locationKeys) {
                    if (countLocations.containsKey(locationKey)) {
                        int newCount = countLocations.get(locationKey) + count;
                        countLocations.put(locationKey, newCount);
                    } else {
                        countLocations.put(locationKey, count);
                    }
                }
                serviceCountLocations.put(serviceName, countLocations);
            } else {
                serviceTotalRequestCount.put(serviceName, count);
                Map<String, Integer> countLocations = new HashMap<>();
                for (String locationKey : locationKeys) {
                    countLocations.put(locationKey, count);
                }
                serviceCountLocations.put(serviceName, countLocations);
            }
        }

        return Pair.of(serviceCountLocations, serviceTotalRequestCount);
    }

    private Map<String, Integer> getLocationsbyRunningContainers(List<ContainerDecisionResult> allDecisions) {
        Map<String, Integer> availableLocations = new HashMap<>();
        Map<String, HostDetails> hostnamesFound = new HashMap<>();

        for (ContainerDecisionResult containerDecisionResult : allDecisions) {
            String serviceHostname = containerDecisionResult.getServiceHostname();
            if (!hostnamesFound.containsKey(serviceHostname)) {
                HostDetails hostDetails = hostService.getHostDetails(serviceHostname);
                hostnamesFound.put(serviceHostname, hostDetails);
            }
            HostDetails hostDetails = hostnamesFound.get(serviceHostname);
            List<String> locationKeys = getLocationsKeys(hostDetails.getContinent(), hostDetails.getRegion(),
                    hostDetails.getCountry(), hostDetails.getCity());
            for (String locationKey : locationKeys) {
                if (availableLocations.containsKey(locationKey)) {
                    int newLocationCount = availableLocations.get(locationKey) + 1;
                    availableLocations.put(locationKey, newLocationCount);
                } else {
                    availableLocations.put(locationKey, 1);
                }
            }
        }
        return availableLocations;
    }

    private HostDetails getBestLocationByService(String serviceName, Map<String, Integer> locationMonitoring,
            int totalCount, Map<String, Integer> locationsbyRunningContainers) {
        List<LocationCount> locationsWithMinReqPerc = new ArrayList<>();
        for (Entry<String, Integer> locationReqCount : locationMonitoring.entrySet()) {
            double currPerc = ((locationReqCount.getValue() * 1.0) / (totalCount * 1.0)) * 100.0;
            if (currPerc >= minReqCountPercentage) {
                HostDetails locationDetails = getHostDetailsByLocationKey(locationReqCount.getKey());
                String region = locationDetails.getRegion();
                String country = locationDetails.getCountry();
                String city = locationDetails.getCity();
                int runningContainerOnRegion = locationsbyRunningContainers.getOrDefault(region, 0);
                int runningContainerOnCountry = locationsbyRunningContainers.getOrDefault(region + "_" + country, 0);
                int runingContainersOnLocal = locationsbyRunningContainers.getOrDefault(locationReqCount.getKey(), 0);
                LocationCount locCount = new LocationCount(locationReqCount.getKey(), region, country, city, currPerc,
                        runingContainersOnLocal, runningContainerOnCountry, runningContainerOnRegion);
                locationsWithMinReqPerc.add(locCount);
            }
        }
        Collections.sort(locationsWithMinReqPerc);

        if (!locationsWithMinReqPerc.isEmpty()) {
            System.out.println("-> Best location for '" + serviceName + "' : " + locationsWithMinReqPerc.get(0).toString());
            return getHostDetailsByLocationKey(locationsWithMinReqPerc.get(0).getLocationKey());
        }

        return null;
    }

    private HostDetails getHostDetailsByLocationKey(String locationKey) {
        String[] serviceLocationSplit = locationKey.split("_");
        String region = "";
        String country = "";
        String city = "";
        for (int i = 0; i < serviceLocationSplit.length; i++) {
            if (i == 0)
                region = serviceLocationSplit[i];
            else if (i == 1)
                country = serviceLocationSplit[i];
            else if (i == 2)
                city = serviceLocationSplit[i];
        }
        return new HostDetails("", region, country, city);
    }

    public String getRegionByLocationKey(String locationKey) {
        return getHostDetailsByLocationKey(locationKey).getRegion();
    }

    private List<String> getLocationsKeys(String continent, String region, String country, String city) {
        String finalRegion = region;
        List<String> locationKeys = new ArrayList<>(3);
        if (region.equals("none")) {
            finalRegion = getBestRegionByLocationInfo(continent, country, city);
        }

        if (!country.equals("") || !city.equals("")) {
            if (!country.equals("")) {
                if (!city.equals("")) {
                    locationKeys.add(finalRegion + "_" + country + "_" + city);
                }
                locationKeys.add(finalRegion + "_" + country);
            }
        }
        locationKeys.add(finalRegion);
        return locationKeys;
    }

    private String getLocationKey(String region, String country, String city) {
        if (!country.equals("") || !city.equals("")) {
            if (!country.equals("")) {
                if (!city.equals("")) {
                    return region + "_" + country + "_" + city;
                }
                return region + "_" + country;
            }
        }
        return region;
    }

    // TODO: improve region choise, using country and city
    private String getBestRegionByLocationInfo(String continent, String country, String city) {
        if (country.equals("pt"))
            return "eu-central-1";
        else if (country.equals("gb"))
            return "eu-west-2";
        else if (country.equals("us"))
            return "us-east-1";

        Iterable<Region> regions = regionService.getRegions();
        List<String> foundRegion = new ArrayList<>();
        String regionNameBegin = "";
        if (continent.equals("na"))
            regionNameBegin = "us-";
        else if (continent.equals("sa"))
            regionNameBegin = "sa-";
        else if (continent.equals("eu") || continent.equals("af"))
            regionNameBegin = "eu-";
        else if (continent.equals("as") || continent.equals("oc"))
            regionNameBegin = "ap-";

        for (Region region : regions) {
            String regionName = region.getRegionName();
            if (regionName.contains(regionNameBegin)) {
                foundRegion.add(regionName);
            }
        }
        if (!foundRegion.isEmpty()) {
            Random rand = new Random();
            int index = rand.nextInt(foundRegion.size());
            return foundRegion.get(index);
        }
        return "";
    }
}