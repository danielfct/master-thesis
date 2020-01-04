
const React = require('react');
const Component = React.Component;
const ReactDOM = require('react-dom');
const BrowserRouter = require('react-router-dom').BrowserRouter;
const Route = require('react-router-dom').Route;
const Redirect = require('react-router-dom').Redirect;

import {MainLayout} from './react/globalComponents';
import {EdgeHosts} from './react/edgeHost';
import {AppPackages} from './react/appPackage';
import {ServiceConfigs, ServiceConfigPage} from './react/serviceConfig';
import {Containers, LaunchContainer} from './react/containers';
import {
    Conditions, ConditionPage, 
    RulesLandingPage, Rules, RulePage,
    AppsRulesList, AppRulesPage, 
    HostsRulesList, HostRulesPage, 
    GenericHostsRulesList, GenericHostRulesPage,
    ServicesRulesList, ServiceRulesPage
} from './react/rule';
import {ServiceEventPredictions, ServiceEventPredictionDetail} from './react/serviceEventPrediction';
import {Nodes, AddNode} from './react/node';
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
} from './react/simulatedMetrics';
import {Regions} from './react/region';
import {EurekaPage} from './react/eureka';
import {LoadBalancerPage} from './react/loadBalancer'

/* Home Component */
class Home extends Component {
    constructor(props) {
        super(props);       
    } 
    render() {
        var style = {maxWidth: "100%"};
        return (
            <MainLayout title='Microservices management'>
                <img src="/images/Arquitetura2.png" alt="Arquitetura do componente" style={style}/>
            </MainLayout>            
        );
    }
}

/* Routes */
ReactDOM.render((
    <BrowserRouter>
        <div>            
            <Route exact path="/" render={() => ( <Redirect to='/ui/home' /> ) }/>            
            <Route path="/ui/home" component={Home} />            
            <Route exact path="/ui/services" component={ServiceConfigs} />
            <Route exact path="/ui/services/detail/:id?" component={ServiceConfigPage} />
            <Route exact path="/ui/apps" component={AppPackages} />
            <Route exact path="/ui/edgehosts" component={EdgeHosts} />
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
            <Route exact path="/ui/rules/serviceeventpredictions" component={ServiceEventPredictions} />
            <Route exact path="/ui/rules/serviceeventpredictions/detail/:id?" component={ServiceEventPredictionDetail} />
            <Route exact path="/ui/nodes" component={Nodes} />
            <Route exact path="/ui/nodes/add" component={AddNode} />
            <Route exact path="/ui/eureka" component={EurekaPage} />
            <Route exact path="/ui/loadbalancer" component={LoadBalancerPage} />

            <Route exact path="/ui/simulatedmetrics/management" component={SimulatedMetricsLandingPage} />
            <Route exact path="/ui/simulatedmetrics/services" component={ServiceSimulatedMetrics} />
            <Route exact path="/ui/simulatedmetrics/services/detail/:id?" component={ServiceSimulatedMetricsDetail} />
            <Route exact path="/ui/simulatedmetrics/containers" component={ContainerSimulatedMetrics} />
            <Route exact path="/ui/simulatedmetrics/containers/detail/:id?" component={ContainerSimulatedMetricsDetail} />
            <Route exact path="/ui/simulatedmetrics/defaulthosts" component={DefaultHostSimulatedMetrics} />
            <Route exact path="/ui/simulatedmetrics/defaulthosts/detail/:id?" component={DefaultHostSimulatedMetricsDetail} />
            <Route exact path="/ui/simulatedmetrics/specifichosts" component={SpecificHostSimulatedMetrics} />
            <Route exact path="/ui/simulatedmetrics/specifichosts/detail/:id?" component={SpecificHostSimulatedMetricsDetail} />

            <Route exact path="/ui/regions" component={Regions} />
        </div>
    </BrowserRouter>
  ), document.getElementById('react-content'));