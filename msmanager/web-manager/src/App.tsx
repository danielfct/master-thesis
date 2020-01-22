import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Navbar from "./components/shared/Navbar";
import Sidenav from "./components/shared/Sidenav";
import Footer from "./components/shared/Footer";
import Landing from "./components/landing/Landing";
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
import Rules from "./components/rules/Rules";
import HostsRulesList from "./components/rules/HostsRulesList";
import Nodes from "./components/nodes/Node";
import LaunchContainer from "./components/containers/LaunchContainer";
import Services from "./components/microservices/Services";
import AppPackage from "./components/microservices/AppPackage";
import AppRulesPage from "./components/rules/AppRulesPage";
import Service from "./components/microservices/Service";
import SimulatedMetricsLandingPage from "./components/metrics/SimulatedMetricsLandingPage";
import RulesLandingPage from "./components/rules/RulesLandingPage";
import ServiceEventPredictionDetail from "./components/eventPrediction/ServiceEventPredictionDetail";
import ContainerSimulatedMetricsDetail from "./components/metrics/ContainerSimulatedMetricsDetail";
import LoadBalancerPage from "./components/loadBalancer/LoadBalancer";
import ContainerSimulatedMetrics from "./components/metrics/ContainerSimulatedMetrics";
import store from "./redux/store";
import {connect, Provider} from "react-redux";
import LoadingBar from "react-redux-loading-bar";
import M from "materialize-css";

//TODO center content of main components, push footer to the bottom, apply redux to all components

interface RootContainerProps {
    sidenavHidden: boolean
}

class RootContainer extends React.Component<RootContainerProps,{}> {

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

const ConnectedRoot = connect(mapStateToProps)(RootContainer);

const App = () =>
    <Provider store={store}>
        <ConnectedRoot />
    </Provider>;

export default App;