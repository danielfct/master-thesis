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

package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules;

import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RuleRepository extends CrudRepository<RuleEntity, Long> {

  Optional<RuleEntity> findByNameIgnoreCase(@Param("name") String name);

  @Query("select case when count(r) > 0 then true else false end "
      + "from RuleEntity r "
      + "where r.id = :ruleId")
  boolean hasRule(@Param("ruleId") long ruleId);

  @Query("select case when count(r) > 0 then true else false end "
      + "from RuleEntity r "
      + "where r.name = :ruleName")
  boolean hasRule(@Param("ruleName") String ruleName);

  @Query("select rc.condition "
      + "from RuleEntity r join r.ruleConditions rc "
      + "where r.name = :ruleName")
  List<ConditionEntity> getConditions(@Param("ruleName") String ruleName);

  @Query("select rc.condition "
      + "from RuleEntity r join r.ruleConditions rc "
      + "where r.name = :ruleName and rc.condition.name = :conditionName")
  Optional<ConditionEntity> getCondition(@Param("ruleName") String ruleName,
                                         @Param("conditionName") String conditionName);

  @Query("select r "
      + "from RuleEntity r "
      + "where r.applyToAllServices = true")
  List<RuleEntity> getGenericServiceRules();

  @Query("select r "
      + "from RuleEntity r "
      + "where r.applyToAllHosts = true")
  List<RuleEntity> getGenericHostRules();

  @Query("select ar.rule "
      + "from RuleEntity r join r.appRules ar")
  List<RuleEntity> getAppsRules();

  @Query("select sr.rule "
      + "from RuleEntity r join r.serviceRules sr")
  List<RuleEntity> getServiceRules();

  @Query("select hr.rule "
      + "from RuleEntity r join r.hostRules hr")
  List<RuleEntity> getHostRules();

}
