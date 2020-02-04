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
import DevTools from "./DevTools";
import Footer from "../components/shared/Footer";
import {connect, Provider} from "react-redux";
import {ReduxState} from "../reducers";
import PageNotFound from "../components/shared/PageNotFound";

interface StateToProps {
    sidenavVisible: boolean;
}

interface RootContainerProps {
    store: any;
}

type Props = StateToProps & RootContainerProps;

export const routes: {[path: string]: { title?: string, component: any, search?: boolean }} = {
    ["/"]: { title: 'Microservices dynamic system management', component: Landing },
    ["/services"]: { title: "Services", component: Services, search: true },
    ["/services/:name"]: { title: "", component: Service },
    ["/apps"]: { title: "", component: AppPackage, search: true },
    ["/hosts/edge"]: { title: "", component: EdgeHosts, search: true },
    ["/containers"]: { title: "", component: Containers, search: true },
    ["/containers/launch/:containerId?"]: { title: "", component: LaunchContainer },
    ["/rules"]: { title: "", component: Rules, search: true },
    ["/rules/management"]: { title: "", component: RulesLandingPage, search: true },
    ["/rules/rules/:ruleId?"]: { title: "",component: RulePage },
    ["/rules/conditions"]: { title: "",  component: Conditions, search: true },
    ["/rules/conditions/condition/:conditionId?"]: { title: "",  component: ConditionPage },
    ["/rules/apps"]: { title: "",  component: AppsRulesList, search: true },
    ["/rules/apps/app/:appId"]: { title: "", component: AppRulesPage },
    ["/rules/services"]: { title: "", component: ServicesRulesList, search: true },
    ["/rules/services/service/:serviceId"]: { title: "", component: ServiceRulesPage },
    ["/rules/hosts"]: { title: "", component: HostsRulesList, search: true },
    ["/rules/hosts/host/:hostname"]: { title: "", component: HostRulesPage },
    ["/rules/generic/hosts"]: { title: "", component: GenericHostsRulesList, search: true },
    ["/rules/generic/hosts/rule"]: { title: "", component: GenericHostRulesPage },
    ["/rules/serviceEventPredictions"]: { title: "", component: ServiceEventPredictions, search: true },
    ["/rules/serviceEventPredictions/serviceEventPrediction/:id?"]: { title: "", component: ServiceEventPredictionDetail },
    ["/nodes"]: { title: "", component: Nodes, search: true },
    ["/nodes/add"]: { title: "", component: AddNode },
    ["/eureka"]: { title: "", component: EurekaPage, search: true },
    ["/loadbalancer"]: { title: "", component: LoadBalancerPage, search: true },
    ["/metrics/simulated"]: { title: "", component: SimulatedMetricsLandingPage, search: true },
    ["/metrics/simulated/services"]: { title: "", component: ServiceSimulatedMetrics, search: true },
    ["/metrics/simulated/services/service/:id?"]: { title: "", component: ServiceSimulatedMetricsDetail },
    ["/metrics/simulated/containers"]: { title: "", component: ContainerSimulatedMetrics, search: true },
    ["/metrics/simulated/containers/metric/:id?"]: { title: "", component: ContainerSimulatedMetricsDetail },
    ["/metrics/simulated/hosts/default"]: { title: "", component: DefaultHostSimulatedMetrics, search: true },
    ["/metrics/simulated/hosts/metric/:id?"]: { title: "", component: DefaultHostSimulatedMetricsDetail },
    ["/metrics/simulated/hosts/specific"]: { title: "", component: SpecificHostSimulatedMetrics, search: true },
    ["/metrics/simulated/hosts/specific/metric/:id?"]: { title: "", component: SpecificHostSimulatedMetricsDetail },
    ["/regions"]: { title: "", component: Regions, search: true },
    ["/*"]: { title: "404 - Not found", component: PageNotFound },
};

class Root extends React.Component<Props, {}> {

    public componentDidMount = () =>
        M.AutoInit();

    public render = () =>
        <Provider store={this.props.store}>
            <LoadingBar showFastActions className="loading-bar"/>
            <div className="content" style={this.props.sidenavVisible ? undefined : {paddingLeft: 0}}>
                <Navbar/>
                <Sidenav/>
                <main>
                    <Switch>
                    {Object.entries(routes).map(([path, {title, component: Component}], index) =>
                        <Route key={index}
                               exact path={path}
                               render={props => <Component {...props} title={title}/>}
                        />
                    )}
                    </Switch>
                   {/* <DevTools/>*/}
                </main>
            </div>
        </Provider>

}

const mapStateToProps = (state: ReduxState): StateToProps => (
{
    sidenavVisible: state.ui.sidenav.user,
}
);

export default connect(mapStateToProps)(Root);

{/*<div className="content">
            <h1>Sticky Footer with Flexbox</h1>
            <p>
                <button>Add Content</button>
            </p>
        </div>*/}