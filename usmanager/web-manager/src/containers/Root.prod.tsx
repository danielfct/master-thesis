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

import React from "react";
import M from "materialize-css";
import {Route, Switch} from "react-router-dom";
import LoadingBar from "react-redux-loading-bar";
import Navbar from "../views/navbar/Navbar";
import Sidenav from "../views/sidenav/Sidenav";
import Landing from "../routes/landing/Landing";
import Services from "../routes/services/Services";
import Service from "../routes/services/Service";
import AppPackage from "../routes/apps/AppPackage";
import EdgeHosts from "../routes/hosts/EdgeHost";
import Containers from "../routes/containers/Containers";
import LaunchContainer from "../routes/containers/LaunchContainer";
import RulesLandingPage from "../routes/rules/RulesLandingPage";
import Rules from "../routes/rules/Rules";
import RulePage from "../routes/rules/RulePage";
import Conditions from "../routes/rules/Conditions";
import ConditionPage from "../routes/rules/ConditionPage";
import AppsRulesList from "../routes/rules/AppsRulesList";
import AppRulesPage from "../routes/rules/AppRulesPage";
import ServicesRulesList from "../routes/rules/ServicesRulesList";
import ServiceRulesPage from "../routes/rules/ServiceRulesPage";
import HostsRulesList from "../routes/rules/HostsRulesList";
import HostRulesPage from "../routes/rules/HostRulesPage";
import GenericHostsRulesList from "../routes/rules/GenericHostsRulesList";
import GenericHostRulesPage from "../routes/rules/GenericHostRulesPage";
import ServiceEventPredictions from "../routes/eventPrediction/ServiceEventPrediction";
import ServiceEventPredictionDetail from "../routes/eventPrediction/ServiceEventPredictionDetail";
import Nodes from "../routes/nodes/Node";
import AddNode from "../routes/nodes/AddNode";
import EurekaPage from "../routes/eureka/Eureka";
import LoadBalancerPage from "../routes/loadBalancer/LoadBalancer";
import SimulatedMetricsLandingPage from "../routes/metrics/SimulatedMetricsLandingPage";
import ServiceSimulatedMetrics from "../routes/metrics/ServiceSimulatedMetrics";
import ServiceSimulatedMetricsDetail from "../routes/metrics/SimulatedMetrics";
import ContainerSimulatedMetrics from "../routes/metrics/ContainerSimulatedMetrics";
import ContainerSimulatedMetricsDetail from "../routes/metrics/ContainerSimulatedMetricsDetail";
import DefaultHostSimulatedMetrics from "../routes/metrics/DefaultHostSimulatedMetrics";
import DefaultHostSimulatedMetricsDetail from "../routes/metrics/DefaultHostSimulatedMetricsDetail";
import SpecificHostSimulatedMetrics from "../routes/metrics/SpecificHostSimulatedMetrics";
import SpecificHostSimulatedMetricsDetail from "../routes/metrics/SpecificHostSimulatedMetricsDetail";
import {Provider} from "react-redux";
import PageNotFound from "../components/PageNotFound";
import Login from "../views/login/Login";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import Footer from "../views/footer/Footer";
import Regions from "../routes/region/Regions";


interface RootContainerProps {
    store: any;
}

type Props = RootContainerProps;

export const authenticatedRoutes: {[path: string]: { title?: string, component: any, search?: boolean }} = {
    "/home": { title: 'Microservices dynamic system management', component: Landing },
    "/services": { title: "Services", component: Services, search: true },
    "/services/:name": { title: "", component: Service },
    "/apps": { title: "", component: AppPackage, search: true },
    "/hosts/edge": { title: "", component: EdgeHosts, search: true },
    "/containers": { title: "", component: Containers, search: true },
    "/containers/launch/:containerId?": { title: "", component: LaunchContainer },
    "/rules": { title: "", component: Rules, search: true },
    "/rules/management": { title: "", component: RulesLandingPage, search: true },
    "/rules/rules/:ruleId?": { title: "",component: RulePage },
    "/rules/conditions": { title: "",  component: Conditions, search: true },
    "/rules/conditions/condition/:conditionId?": { title: "",  component: ConditionPage },
    "/rules/apps": { title: "",  component: AppsRulesList, search: true },
    "/rules/apps/app/:appId": { title: "", component: AppRulesPage },
    "/rules/services": { title: "", component: ServicesRulesList, search: true },
    "/rules/services/service/:serviceId": { title: "", component: ServiceRulesPage },
    "/rules/hosts": { title: "", component: HostsRulesList, search: true },
    "/rules/hosts/host/:hostname": { title: "", component: HostRulesPage },
    "/rules/generic/hosts": { title: "", component: GenericHostsRulesList, search: true },
    "/rules/generic/hosts/rule": { title: "", component: GenericHostRulesPage },
    "/rules/serviceEventPredictions": { title: "", component: ServiceEventPredictions, search: true },
    "/rules/serviceEventPredictions/serviceEventPrediction/:id?": { title: "", component: ServiceEventPredictionDetail },
    "/nodes": { title: "", component: Nodes, search: true },
    "/nodes/add": { title: "", component: AddNode },
    "/eureka": { title: "", component: EurekaPage, search: true },
    "/loadbalancer": { title: "", component: LoadBalancerPage, search: true },
    "/metrics/simulated": { title: "", component: SimulatedMetricsLandingPage, search: true },
    "/metrics/simulated/services": { title: "", component: ServiceSimulatedMetrics, search: true },
    "/metrics/simulated/services/service/:id?": { title: "", component: ServiceSimulatedMetricsDetail },
    "/metrics/simulated/containers": { title: "", component: ContainerSimulatedMetrics, search: true },
    "/metrics/simulated/containers/metric/:id?": { title: "", component: ContainerSimulatedMetricsDetail },
    "/metrics/simulated/hosts/default": { title: "", component: DefaultHostSimulatedMetrics, search: true },
    "/metrics/simulated/hosts/metric/:id?": { title: "", component: DefaultHostSimulatedMetricsDetail },
    "/metrics/simulated/hosts/specific": { title: "", component: SpecificHostSimulatedMetrics, search: true },
    "/metrics/simulated/hosts/specific/metric/:id?": { title: "", component: SpecificHostSimulatedMetricsDetail },
    "/regions": { title: "", component: Regions, search: true },
    "/*": { title: "404 - Not found", component: PageNotFound },
};

export default class Root extends React.Component<Props, {}> {

    componentDidMount(): void {
        M.AutoInit();
    }

    render = () =>
        <>
            <main>
                <Provider store={this.props.store}>
                    <LoadingBar showFastActions className="loading-bar"/>
                    <Navbar/>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/login" exact component={Login} />
                        {Object.entries(authenticatedRoutes).map(([path, {title, component}], index) =>
                            <AuthenticatedRoute key={index} exact path={path} title={title} component={component}/>)}
                    </Switch>
                </Provider>
            </main>
            <Footer/>
        </>

}
