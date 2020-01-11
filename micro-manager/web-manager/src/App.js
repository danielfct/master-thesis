/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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

import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import M from 'materialize-css';

import { Landing } from './Landing';
import { EdgeHosts } from './hosts/edgeHost';
import { AppPackages } from './microservices/appPackage';
import { Services, ServicePage } from './microservices/service';
import { Containers, LaunchContainer } from './containers/containers';
import {
  Conditions, ConditionPage,
  RulesLandingPage, Rules, RulePage,
  AppsRulesList, AppRulesPage,
  HostsRulesList, HostRulesPage,
  GenericHostsRulesList, GenericHostRulesPage,
  ServicesRulesList, ServiceRulesPage
} from './rules/rule';
import { ServiceEventPredictions, ServiceEventPredictionDetail } from './eventPrediction/serviceEventPrediction';
import { Nodes, AddNode } from './nodes/node';
import {
  SimulatedMetricsLandingPage,
  ServiceSimulatedMetrics,
  ServiceSimulatedMetricsDetail,
  ContainerSimulatedMetrics,
  ContainerSimulatedMetricsDetail,
  DefaultHostSimulatedMetrics,
  DefaultHostSimulatedMetricsDetail,
  SpecificHostSimulatedMetrics,
  SpecificHostSimulatedMetricsDetail
} from './metrics/simulatedMetrics';
import { Regions } from './region/region';
import { EurekaPage } from './eureka/eureka';
import { LoadBalancerPage } from './loadBalancer/loadBalancer';

class App extends React.Component {
  componentDidMount () {
    M.AutoInit();
  }

  render () {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route exact path="/" render={() => (<Redirect to='/ui/home' />) }/>
            <Route path="/ui/home" component={Landing} />
            <Route exact path="/ui/services" component={Services} />
            <Route exact path="/ui/services/detail/:id?" component={ServicePage} />
            <Route exact path="/ui/apps" component={AppPackages} />
            <Route exact path="/ui/edgeHosts" component={EdgeHosts} />
            <Route exact path="/ui/containers" component={Containers} />
            <Route exact path="/ui/containers/launch/:containerId?" component={LaunchContainer} />
            <Route exact path="/ui/rules/management" component={RulesLandingPage} />
            <Route exact path="/ui/rules" component={Rules} />
            <Route exact path="/ui/rules/detail/:ruleId?" component={RulePage} />
            <Route exact path="/ui/rules/conditions" component={Conditions} />
            <Route exact path="/ui/rules/conditions/detail/:conditionId?" component={ConditionPage} />
            <Route exact path="/ui/rules/apps" component={AppsRulesList} />
            <Route exact path="/ui/rules/apps/detail/:appId" component={AppRulesPage} />
            <Route exact path="/ui/rules/services" component={ServicesRulesList} />
            <Route exact path="/ui/rules/services/detail/:serviceId" component={ServiceRulesPage} />
            <Route exact path="/ui/rules/hosts" component={HostsRulesList} />
            <Route exact path="/ui/rules/hosts/detail/:hostname" component={HostRulesPage} />
            <Route exact path="/ui/rules/generic/hosts" component={GenericHostsRulesList} />
            <Route exact path="/ui/rules/generic/hosts/detail" component={GenericHostRulesPage} />
            <Route exact path="/ui/rules/serviceEventPredictions" component={ServiceEventPredictions} />
            <Route exact path="/ui/rules/serviceEventPredictions/detail/:id?" component={ServiceEventPredictionDetail} />
            <Route exact path="/ui/nodes" component={Nodes} />
            <Route exact path="/ui/nodes/add" component={AddNode} />
            <Route exact path="/ui/eureka" component={EurekaPage} />
            <Route exact path="/ui/loadbalancer" component={LoadBalancerPage} />
            <Route exact path="/ui/simulatedMetrics/management" component={SimulatedMetricsLandingPage} />
            <Route exact path="/ui/simulatedMetrics/services" component={ServiceSimulatedMetrics} />
            <Route exact path="/ui/simulatedMetrics/services/detail/:id?" component={ServiceSimulatedMetricsDetail} />
            <Route exact path="/ui/simulatedMetrics/containers" component={ContainerSimulatedMetrics} />
            <Route exact path="/ui/simulatedMetrics/containers/detail/:id?" component={ContainerSimulatedMetricsDetail} />
            <Route exact path="/ui/simulatedMetrics/defaultHosts" component={DefaultHostSimulatedMetrics} />
            <Route exact path="/ui/simulatedMetrics/defaultHosts/detail/:id?" component={DefaultHostSimulatedMetricsDetail} />
            <Route exact path="/ui/simulatedMetrics/specificHosts" component={SpecificHostSimulatedMetrics} />
            <Route exact path="/ui/simulatedMetrics/specificHosts/detail/:id?" component={SpecificHostSimulatedMetricsDetail} />
            <Route exact path="/ui/regions" component={Regions} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
