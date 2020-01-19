import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import GenericHostsRulesList from "./components/rules/GenericHostsRulesList";
import ConditionPage from "./components/rules/ConditionPage";
import ServiceRulesPage from "./components/rules/ServiceRulesPage";
import Containers from "./components/containers/Containers";
import EurekaPage from "./components/eureka/Eureka";
import SpecificHostSimulatedMetrics from "./components/metrics/SpecificHostSimulatedMetrics";
import ServiceEventPredictions from "./components/eventPrediction/ServiceEventPrediction";
import Conditions from "./components/rules/Conditions";
import SpecificHostSimulatedMetricsDetail from "./components/metrics/SpecificHostSimulatedMetricsDetail";
import HostRulesPage from "./components/rules/HostRulesPage";
import RulePage from "./components/rules/RulePage";
import AppsRulesList from "./components/rules/AppsRulesList";
import GenericHostRulesPage from "./components/rules/GenericHostRulesPage";
import ServicesRulesList from "./components/rules/ServicesRulesList";
import ServiceSimulatedMetrics from "./components/metrics/ServiceSimulatedMetrics";
import AddNode from "./components/nodes/AddNode";
import EdgeHosts from "./components/hosts/EdgeHost";
import ServiceSimulatedMetricsDetail from "./components/metrics/SimulatedMetrics";
import DefaultHostSimulatedMetrics from "./components/metrics/DefaultHostSimulatedMetrics";
import DefaultHostSimulatedMetricsDetail from "./components/metrics/DefaultHostSimulatedMetricsDetail";
import Regions from "./components/region/Region";
import Landing from "./components/landing/Landing";
import Rules from "./components/rules/Rules";
import HostsRulesList from "./components/rules/HostsRulesList";
import Nodes from "./components/nodes/Node";
import LaunchContainer from "./components/containers/LaunchContainer";
import Services from "./components/microservices/Service";
import AppPackage from "./components/microservices/AppPackage";
import AppRulesPage from "./components/rules/AppRulesPage";
import ServicePage from "./components/microservices/ServicePage";
import SimulatedMetricsLandingPage from "./components/metrics/SimulatedMetricsLandingPage";
import RulesLandingPage from "./components/rules/RulesLandingPage";
import ServiceEventPredictionDetail from "./components/eventPrediction/ServiceEventPredictionDetail";
import ContainerSimulatedMetricsDetail from "./components/metrics/ContainerSimulatedMetricsDetail";
import LoadBalancerPage from "./components/loadBalancer/LoadBalancer";
import ContainerSimulatedMetrics from "./components/metrics/ContainerSimulatedMetrics";
import Navbar from "./components/shared/Navbar";
import Sidenav from "./components/shared/Sidenav";
import Footer from "./components/shared/Footer";
import store from "./redux/store";
import {Provider} from "react-redux";
import Demo from "./demo";
import LoadingBar from "react-redux-loading-bar";

interface AppProps {
}

export default class App extends React.Component<AppProps,any> {

    //TODO center content of main components, push footer to the bottom, get value from filter

    constructor(props: AppProps) {
        super(props);
        this.state = {sidenavHidden: window.innerWidth <= 992};
    }

    hideSidenav = (state: boolean) => {
        this.setState({sidenavHidden: state});
    };

    handleResize = (event: any) => {
        this.setState({sidenavHidden: event.target.innerWidth <= 992 || this.state.sidenavHidden });
    };

    componentDidMount = () => {
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.handleResize);
    };

    render() {
        return (
            <Provider store={store}>
                <LoadingBar className="loading-bar"/>
                <div className="content" style={this.state.sidenavHidden ? {paddingLeft: 0} : undefined}>
                    <BrowserRouter>
                        <Navbar sidenavHidden={this.state.sidenavHidden} hideSidenav={this.hideSidenav}/>
                        <Sidenav sidenavHidden={this.state.sidenavHidden} hideSidenav={this.hideSidenav}/>
                        <main>
                            <Route exact path="/" component={Landing}/>
                            <Route exact path="/services" component={Services}/>
                            <Route exact path="/services/detail/:id?" component={ServicePage}/>
                            <Route exact path="/apps" component={AppPackage}/>
                            <Route exact path="/hosts/edge" component={EdgeHosts}/>
                            <Route exact path="/containers" component={Containers}/>
                            <Route exact path="/containers/launch/:containerId?" component={LaunchContainer}/>
                            <Route exact path="/rules/management" component={RulesLandingPage}/>
                            <Route exact path="/rules" component={Rules}/>
                            <Route exact path="/rules/detail/:ruleId?" component={RulePage}/>
                            <Route exact path="/rules/conditions" component={Conditions}/>
                            <Route exact path="/rules/conditions/detail/:conditionId?" component={ConditionPage}/>
                            <Route exact path="/rules/apps" component={AppsRulesList}/>
                            <Route exact path="/rules/apps/detail/:appId" component={AppRulesPage}/>
                            <Route exact path="/rules/services" component={ServicesRulesList}/>
                            <Route exact path="/rules/services/detail/:serviceId" component={ServiceRulesPage}/>
                            <Route exact path="/rules/hosts" component={HostsRulesList}/>
                            <Route exact path="/rules/hosts/detail/:hostname" component={HostRulesPage}/>
                            <Route exact path="/rules/generic/hosts" component={GenericHostsRulesList}/>
                            <Route exact path="/rules/generic/hosts/detail" component={GenericHostRulesPage}/>
                            <Route exact path="/rules/serviceEventPredictions" component={ServiceEventPredictions}/>
                            <Route exact path="/rules/serviceEventPredictions/detail/:id?" component={ServiceEventPredictionDetail}/>
                            <Route exact path="/nodes" component={Nodes}/>
                            <Route exact path="/nodes/add" component={AddNode}/>
                            <Route exact path="/eureka" component={EurekaPage}/>
                            <Route exact path="/loadbalancer" component={LoadBalancerPage}/>
                            <Route exact path="/metrics/simulated" component={SimulatedMetricsLandingPage}/>
                            <Route exact path="/metrics/simulated/services" component={ServiceSimulatedMetrics}/>
                            <Route exact path="/metrics/simulated/services/detail/:id?" component={ServiceSimulatedMetricsDetail}/>
                            <Route exact path="/metrics/simulated/containers" component={ContainerSimulatedMetrics}/>
                            <Route exact path="/metrics/simulated/containers/detail/:id?" component={ContainerSimulatedMetricsDetail}/>
                            <Route exact path="/metrics/simulated/hosts/default" component={DefaultHostSimulatedMetrics}/>
                            <Route exact path="/metrics/simulated/hosts/detail/:id?" component={DefaultHostSimulatedMetricsDetail}/>
                            <Route exact path="/metrics/simulated/hosts/specific" component={SpecificHostSimulatedMetrics}/>
                            <Route exact path="/metrics/simulated/hosts/specific/detail/:id?" component={SpecificHostSimulatedMetricsDetail}/>
                            <Route exact path="/regions" component={Regions}/>
                            <Route exact path="/demo" component={Demo}/>
                        </main>
                        <Footer sidenavHidden={this.state.sidenavHidden}/>
                    </BrowserRouter>
                </div>
            </Provider>
        );
    }
}