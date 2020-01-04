package andre.replicationmigration.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import andre.replicationmigration.model.Region;
import andre.replicationmigration.repositories.RegionRepository;

@Service
public class RegionService {

    @Autowired
    private RegionRepository regionRepo;

    public Iterable<Region> getRegions() {
        return regionRepo.findAll();
    }

    public Region getRegionById(long id) {
        return regionRepo.findOne(id);
    }

    public long saveRegion(long id, Region region) {
        if (id > 0)
            region.setId(id);

        return regionRepo.save(region).getId();
    }

    public long deleteRegion(long id) {
        regionRepo.delete(id);
        return id;
    }

}