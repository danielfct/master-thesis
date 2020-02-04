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

package pt.unl.fct.microservicemanagement.mastermanager.apps;

import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.AppRule;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pt.unl.fct.microservicemanagement.mastermanager.services.ServiceOrder;

@Repository
public interface AppPackageRepository extends CrudRepository<AppPackage, Long> {

  //TODO fix path
  @Query("select new pt.unl.fct.microservicemanagement.mastermanager.services"
      + ".ServiceOrder(s.service, s.launchOrder) "
      + "from AppPackage a inner join a.appServices s "
      + "where a.id = :appId order by s.launchOrder")
  List<ServiceOrder> getServiceOrderByService(@Param("appId") long appId);

  @Query("select r "
      + "from AppPackage a join a.appRules r "
      + "where a.id = :appId")
  List<AppRule> getRules(@Param("appId") long appId);

}
