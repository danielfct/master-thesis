/*
 * MIT License
 *
 * Copyright (c) 2020 msmanager
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

import React from "react";
import M from "materialize-css";
import {BrowserRouter, Route} from "react-router-dom";
import LoadingBar from "react-redux-loading-bar";
import Navbar from "../components/shared/Navbar";
import Sidenav from "../components/shared/Sidenav";
import Landing from "../components/landing/Landing";
import Services from "../components/services/Services";
import Service from "../components/services/Service";
import AppPackage from "../components/apps/AppPackage";
import EdgeHosts from "../components/hosts/EdgeHost";
import Containers from "../components/containers/Containers";
import LaunchContainer from "../components/containers/LaunchContainer";
import RulesLandingPage from "../components/rules/RulesLandingPage";
import Rules from "../components/rules/Rules";
import RulePage from "../components/rules/RulePage";
import Conditions from "../components/rules/Conditions";
import ConditionPage from "../components/rules/ConditionPage";
import AppsRulesList from "../components/rules/AppsRulesList";
import AppRulesPage from "../components/rules/AppRulesPage";
import ServicesRulesList from "../components/rules/ServicesRulesList";
import ServiceRulesPage from "../components/rules/ServiceRulesPage";
import HostsRulesList from "../components/rules/HostsRulesList";
import HostRulesPage from "../components/rules/HostRulesPage";
import GenericHostsRulesList from "../components/rules/GenericHostsRulesList";
import GenericHostRulesPage from "../components/rules/GenericHostRulesPage";
import ServiceEventPredictions from "../components/eventPrediction/ServiceEventPrediction";
import ServiceEventPredictionDetail from "../components/eventPrediction/ServiceEventPredictionDetail";
import Nodes from "../components/nodes/Node";
import AddNode from "../components/nodes/AddNode";
import EurekaPage from "../components/eureka/Eureka";
import LoadBalancerPage from "../components/loadBalancer/LoadBalancer";
import SimulatedMetricsLandingPage from "../components/metrics/SimulatedMetricsLandingPage";
import ServiceSimulatedMetrics from "../components/metrics/ServiceSimulatedMetrics";
import ServiceSimulatedMetricsDetail from "../components/metrics/SimulatedMetrics";
import ContainerSimulatedMetrics from "../components/metrics/ContainerSimulatedMetrics";
import ContainerSimulatedMetricsDetail from "../components/metrics/ContainerSimulatedMetricsDetail";
import DefaultHostSimulatedMetrics from "../components/metrics/DefaultHostSimulatedMetrics";
import DefaultHostSimulatedMetricsDetail from "../components/metrics/DefaultHostSimulatedMetricsDetail";
import SpecificHostSimulatedMetrics from "../components/metrics/SpecificHostSimulatedMetrics";
import SpecificHostSimulatedMetricsDetail from "../components/metrics/SpecificHostSimulatedMetricsDetail";
import Regions from "../components/region/Region";
import Footer from "../components/shared/Footer";
import {connect} from "react-redux";

interface RootContainerProps {
    sidenavHidden: boolean
}

class Root extends React.Component<RootContainerProps,{}> {

    componentDidMount = () =>
        M.AutoInit();

    render = () =>
        <BrowserRouter>
            <LoadingBar showFastActions className="loading-bar"/>
            <div className="content" style={this.props.sidenavHidden ? {paddingLeft: 0} : undefined}>
                <Navbar/>
                <Sidenav/>
                <main>
                    <Route exact path="/" component={Landing}/>
                    <Route exact path="/services" component={Services}/>
                    <Route exact path="/services/service/:id?" component={Service}/>
                    <Route exact path="/apps" component={AppPackage}/>
                    <Route exact path="/hosts/edge" component={EdgeHosts}/>
                    <Route exact path="/containers" component={Containers}/>
                    <Route exact path="/containers/launch/:containerId?" component={LaunchContainer}/>
                    <Route exact path="/rules/management" component={RulesLandingPage}/>
                    <Route exact path="/rules" component={Rules}/>
                    <Route exact path="/rules/rules/:ruleId?" component={RulePage}/>
                    <Route exact path="/rules/conditions" component={Conditions}/>
                    <Route exact path="/rules/conditions/condition/:conditionId?" component={ConditionPage}/>
                    <Route exact path="/rules/apps" component={AppsRulesList}/>
                    <Route exact path="/rules/apps/app/:appId" component={AppRulesPage}/>
                    <Route exact path="/rules/services" component={ServicesRulesList}/>
                    <Route exact path="/rules/services/service/:serviceId" component={ServiceRulesPage}/>
                    <Route exact path="/rules/hosts" component={HostsRulesList}/>
                    <Route exact path="/rules/hosts/host/:hostname" component={HostRulesPage}/>
                    <Route exact path="/rules/generic/hosts" component={GenericHostsRulesList}/>
                    <Route exact path="/rules/generic/hosts/rule" component={GenericHostRulesPage}/>
                    <Route exact path="/rules/serviceEventPredictions" component={ServiceEventPredictions}/>
                    <Route exact path="/rules/serviceEventPredictions/serviceEventPrediction/:id?" component={ServiceEventPredictionDetail}/>
                    <Route exact path="/nodes" component={Nodes}/>
                    <Route exact path="/nodes/add" component={AddNode}/>
                    <Route exact path="/eureka" component={EurekaPage}/>
                    <Route exact path="/loadbalancer" component={LoadBalancerPage}/>
                    <Route exact path="/metrics/simulated" component={SimulatedMetricsLandingPage}/>
                    <Route exact path="/metrics/simulated/services" component={ServiceSimulatedMetrics}/>
                    <Route exact path="/metrics/simulated/services/service/:id?" component={ServiceSimulatedMetricsDetail}/>
                    <Route exact path="/metrics/simulated/containers" component={ContainerSimulatedMetrics}/>
                    <Route exact path="/metrics/simulated/containers/metric/:id?" component={ContainerSimulatedMetricsDetail}/>
                    <Route exact path="/metrics/simulated/hosts/default" component={DefaultHostSimulatedMetrics}/>
                    <Route exact path="/metrics/simulated/hosts/metric/:id?" component={DefaultHostSimulatedMetricsDetail}/>
                    <Route exact path="/metrics/simulated/hosts/specific" component={SpecificHostSimulatedMetrics}/>
                    <Route exact path="/metrics/simulated/hosts/specific/metric/:id?" component={SpecificHostSimulatedMetricsDetail}/>
                    <Route exact path="/regions" component={Regions}/>
                </main>
                <Footer/>
            </div>
        </BrowserRouter>
}

const mapStateToProps = (state: any) => (
    {
        sidenavHidden: state.sidenav.hidden,
    }
);

export default connect(mapStateToProps)(Root);