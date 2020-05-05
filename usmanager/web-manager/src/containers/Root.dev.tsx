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
import Landing from "../routes/landing/Landing";
import Services from "../routes/services/Services";
import Service from "../routes/services/Service";
import EurekaPage from "../routes/eureka/Eureka";
import LoadBalancerPage from "../routes/loadBalancer/OldLoadBalancer";
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
import Logs from "../routes/logs/Logs";
import Region from "../routes/region/Region";
import Regions from "../routes/region/Regions";
import Nodes from "../routes/nodes/Nodes";
import Node from "../routes/nodes/Node";
import CloudHost from "../routes/hosts/cloud/CloudHost";
import EdgeHost from "../routes/hosts/edge/EdgeHost";
import Hosts from "../routes/hosts/Hosts";
import CloudHosts from "../routes/hosts/cloud/CloudHosts";
import EdgeHosts from "../routes/hosts/edge/EdgeHosts";
import Containers from "../routes/containers/Containers";
import Container from "../routes/containers/Container";
import Apps from "../routes/apps/Apps";
import App from "../routes/apps/App";
import HostRules from "../routes/rules/hosts/HostRules";
import HostRule from "../routes/rules/hosts/HostRule";
import ServiceRules from "../routes/rules/services/ServiceRules";
import ServiceRule from "../routes/rules/services/ServiceRule";
import Rules from "../routes/rules/Rules";
import Conditions from "../routes/rules/conditions/Conditions";
import Condition from "../routes/rules/conditions/Condition";

interface RootContainerProps {
    store: any;
}

type Props = RootContainerProps;

export const authenticatedRoutes: {[path: string]: { title?: string, component: any, search?: boolean }} = {
    "/home": { title: 'Microservices dynamic system management', component: Landing },
    "/apps": { component: Apps, search: true },
    "/apps/:name": { component: App },
    "/services": { component: Services, search: true },
    "/services/:name": { component: Service },
    "/services/service": { component: Service },
    "/containers": { component: Containers, search: true },
    "/containers/:id": { component: Container },
    "/hosts": { component: Hosts, search: true },
    "/hosts/cloud": { component: CloudHosts },
    "/hosts/cloud/:instanceId": { component: CloudHost },
    "/hosts/edge": { component: EdgeHosts },
    "/hosts/edge/:hostname": { component: EdgeHost },
    "/nodes": { component: Nodes, search: true },
    "/nodes/:id": { component: Node },
    "/rules": { component: Rules, search: true },
    "/rules/hosts": { component: HostRules, search: true },
    "/rules/hosts/:name": { component: HostRule },
    "/rules/services": { component: ServiceRules, search: true },
    "/rules/services/:name": { component: ServiceRule },
    "/rules/conditions": { component: Conditions, search: true },
    "/rules/conditions/:name": { component: Condition },
    "/metrics/simulated": { component: SimulatedMetricsLandingPage, search: true },
    "/metrics/simulated/services": { component: ServiceSimulatedMetrics, search: true },
    "/metrics/simulated/services/service/:id?": { component: ServiceSimulatedMetricsDetail },
    "/metrics/simulated/containers": { component: ContainerSimulatedMetrics, search: true },
    "/metrics/simulated/containers/metric/:id?": { component: ContainerSimulatedMetricsDetail },
    "/metrics/simulated/hosts/default": { component: DefaultHostSimulatedMetrics, search: true },
    "/metrics/simulated/hosts/metric/:id?": { component: DefaultHostSimulatedMetricsDetail },
    "/metrics/simulated/hosts/specific": { component: SpecificHostSimulatedMetrics, search: true },
    "/metrics/simulated/hosts/specific/metric/:id?": { component: SpecificHostSimulatedMetricsDetail },
    "/regions": { component: Regions, search: true },
    "/regions/:name": { component: Region },
    "/eureka": { component: EurekaPage, search: true },
    "/loadbalancer": { component: LoadBalancerPage, search: true },
    "/logs": { component: Logs, search: true },
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
                    {/*<DevTools/>*/}
                </Provider>
            </main>
            <Footer/>
        </>

}
