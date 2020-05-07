/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision;

import java.util.Collections;
import java.util.Map;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.RuleDecision;

@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class HostDecisionResult extends DecisionResult {

  public HostDecisionResult(String hostname) {
    this(hostname, RuleDecision.NONE, 0, Collections.emptyMap(), 0);
  }

  public HostDecisionResult(String hostname, RuleDecision decision, long ruleId,
                            Map<String, Double> fields, int priority) {
    super(hostname, decision, ruleId, fields, priority,
        fields.values().stream().mapToDouble(Double::doubleValue).sum());
  }

}

