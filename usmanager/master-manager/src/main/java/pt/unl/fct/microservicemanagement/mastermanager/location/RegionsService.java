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

package pt.unl.fct.microservicemanagement.mastermanager.location;

import pt.unl.fct.microservicemanagement.mastermanager.exceptions.NotFoundException;

import org.springframework.stereotype.Service;

@Service
public class RegionsService {

  private final RegionRepository regions;

  public RegionsService(RegionRepository regions) {
    this.regions = regions;
  }

  public Iterable<RegionEntity> getRegions() {
    return regions.findAll();
  }

  public RegionEntity getRegion(long id) {
    return regions.findById(id).orElseThrow(() -> new NotFoundException("Region not found"));
  }

  /*public long addRegion(Region region) {
    return regions.save(region).getId();
  }

  public long updateRegion(long id, Region newRegion) {
    final var region = getRegion(id);
    Utils.copyValidProperties(newRegion, region);
    return regions.save(region).getId();
  }*/

  public long saveRegion(long id, RegionEntity region) {
    if (id > 0) {
      region.setId(id);
    }
    return regions.save(region).getId();
  }

  public void deleteRegion(long id) {
    regions.deleteById(id);
  }

}