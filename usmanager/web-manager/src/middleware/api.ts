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

import {normalize, schema} from 'normalizr';
import {camelizeKeys} from 'humps';
import {IService} from "../routes/services/Service";
import {IServiceDependency} from "../routes/services/ServiceDependencyList";
import axios from "axios";
import {API_URL, REQUEST_TIMEOUT} from "../utils/api";
import {ILogs} from "../routes/logs/Logs";
import {IRegion} from "../routes/region/Region";
import {IDependee} from "../routes/services/ServiceDependeeList";
import {IPrediction} from "../routes/services/ServicePredictionList";
import {INode} from "../routes/nodes/Node";
import {ICloudHost, IState} from "../routes/hosts/cloud/CloudHost";
import {IEdgeHost} from "../routes/hosts/edge/EdgeHost";
import {IContainer} from "../routes/containers/Container";
import {IApp} from "../routes/apps/App";
import {IDecision, IField, IOperator, IValueMode} from "../routes/rules/Rule";
import {IRuleService} from "../routes/rules/services/RuleService";
import {IRuleHost} from "../routes/rules/hosts/RuleHost";
import {ICondition} from "../routes/rules/conditions/RuleCondition";
import {IAppService} from "../routes/apps/AppServicesList";
import {ILoadBalancer} from "../routes/loadBalancer/LoadBalancer";

const callApi = (endpoint: string, schema: any) => {
    const url = endpoint.includes(API_URL) ? endpoint : `${API_URL}/${endpoint}`;
    return axios.get(url, {
        //TODO remove options
        headers: {
            'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json;charset=UTF-8',
        },
        timeout: REQUEST_TIMEOUT
    }).then(response => {
        if (response.status === 200) {
            const camelizedJson = camelizeKeys(response.data);
            return normalize(camelizedJson, schema).entities;
        }
        else {
            return Promise.reject(response);
        }
    }).catch(e => Promise.reject(e))
};

interface ISchemas {
    APP: schema.Entity<IApp>;
    APP_ARRAY: schema.Entity<IApp>[];
    APP_SERVICE: schema.Entity<IAppService>;
    APP_SERVICE_ARRAY: schema.Entity<IAppService>[];
    SERVICE: schema.Entity<IService>;
    SERVICE_ARRAY: schema.Entity<IService>[];
    SERVICE_APP: schema.Entity<IApp>;
    SERVICE_APP_ARRAY: schema.Entity<IApp>[];
    SERVICE_DEPENDENCY: schema.Entity<IServiceDependency>;
    SERVICE_DEPENDENCY_ARRAY: schema.Entity<IServiceDependency>[];
    SERVICE_DEPENDEE: schema.Entity<IDependee>;
    SERVICE_DEPENDEE_ARRAY: schema.Entity<IDependee>[];
    SERVICE_PREDICTION: schema.Entity<IPrediction>;
    SERVICE_PREDICTION_ARRAY: schema.Entity<IPrediction>[];
    SERVICE_RULE: schema.Entity<IRuleService>;
    SERVICE_RULE_ARRAY: schema.Entity<IRuleService>[];
    CONTAINER: schema.Entity<IContainer>;
    CONTAINER_ARRAY: schema.Entity<IContainer>[];
    CLOUD_HOST: schema.Entity<ICloudHost>;
    CLOUD_HOST_ARRAY: schema.Entity<ICloudHost>[];
    CLOUD_HOST_RULE: schema.Entity<IRuleHost>;
    CLOUD_HOST_RULE_ARRAY: schema.Entity<IRuleHost>[];
    EDGE_HOST: schema.Entity<IEdgeHost>;
    EDGE_HOST_ARRAY: schema.Entity<IEdgeHost>[];
    EDGE_HOST_RULE: schema.Entity<IRuleHost>;
    EDGE_HOST_RULE_ARRAY: schema.Entity<IRuleHost>[];
    NODE: schema.Entity<INode>;
    NODE_ARRAY: schema.Entity<INode>[];
    RULE_HOST: schema.Entity<IRuleHost>;
    RULE_HOST_ARRAY: schema.Entity<IRuleHost>[];
    RULE_SERVICE: schema.Entity<IRuleService>;
    RULE_SERVICE_ARRAY: schema.Entity<IRuleService>[];
    RULE_CONDITION: schema.Entity<ICondition>;
    RULE_CONDITION_ARRAY: schema.Entity<ICondition>[];
    VALUE_MODE_ARRAY: schema.Entity<IValueMode>[];
    FIELD_ARRAY: schema.Entity<IField>[];
    OPERATOR_ARRAY: schema.Entity<IOperator>[];
    DECISION: schema.Entity<IDecision>;
    DECISION_ARRAY: schema.Entity<IDecision>[];
    //SIMULATED_METRIC: schema.Entity<ISimulatedMetric>; TODO
    //SIMULATED_METRIC_ARRAY: schema.Entity<ISimulatedMetric>[]; TODO
    REGION: schema.Entity<IRegion>;
    REGION_ARRAY: schema.Entity<IRegion>[];
    LOAD_BALANCER: schema.Entity<ILoadBalancer>;
    LOAD_BALANCER_ARRAY: schema.Entity<ILoadBalancer>[];
    //EUREKA_SERVICE: schema.Entity<IEurekaServer>; TODO
    //EUREKA_SERVICE_ARRAY: schema.Entity<IEurekaServer>[]; TODO
    LOGS_ARRAY: schema.Entity<ILogs>[];
}

const app: schema.Entity<IApp> = new schema.Entity('apps', undefined, {
    idAttribute: (app: IApp) => app.name
});
const apps = new schema.Array(app);

const appService: schema.Entity<IAppService> = new schema.Entity('services', undefined, {
    idAttribute: (service: IAppService) => service.service.serviceName
});
const appServices = new schema.Array(appService);

const service: schema.Entity<IService> = new schema.Entity('services', undefined, {
    idAttribute: (service: IService) => service.serviceName
});
const services = new schema.Array(service);

const dependency: schema.Entity<IServiceDependency> = new schema.Entity('dependencies', undefined, {
    idAttribute: (dependency: IServiceDependency) => dependency.serviceName
});
const dependencies = new schema.Array(dependency);

const dependee: schema.Entity<IDependee> = new schema.Entity('dependees', undefined, {
    idAttribute: (dependee: IDependee) => dependee.serviceName
});
const dependees = new schema.Array(dependee);

const prediction: schema.Entity<IPrediction> = new schema.Entity('predictions', undefined, {
    idAttribute: (prediction: IPrediction) => prediction.name
});

const container: schema.Entity<IContainer> = new schema.Entity('containers', undefined, {
    idAttribute: (container: IContainer) => container.id.toString()
});

const cloudHost: schema.Entity<ICloudHost> = new schema.Entity('cloudHosts', undefined, {
    idAttribute: (host: ICloudHost) => host.instanceId
});
const cloudHosts = new schema.Array(cloudHost);

const state: schema.Entity<IState> = new schema.Entity('state', undefined, {
    idAttribute: (state: IState) => state.name
});

const edgeHost: schema.Entity<IEdgeHost> = new schema.Entity('edgeHosts', undefined, {
    idAttribute: (host: IEdgeHost) => host.hostname
});
const edgeHosts = new schema.Array(edgeHost);

const node: schema.Entity<INode> = new schema.Entity('nodes', undefined, {
    idAttribute: (node: INode) => node.id.toString()
});

const ruleHost: schema.Entity<IRuleHost> = new schema.Entity('hostRules', undefined, {
    idAttribute: (hostRule: IRuleHost) => hostRule.name
});
const hostRules = new schema.Array(ruleHost);

const ruleService: schema.Entity<IRuleService> = new schema.Entity('serviceRules', undefined, {
    idAttribute: (serviceRule: IRuleService) => serviceRule.name
});
const serviceRules = new schema.Array(ruleService);

const valueMode: schema.Entity<IValueMode> = new schema.Entity('valueModes', undefined, {
    idAttribute: (valueMode: IValueMode) => valueMode.name
});
const valueModes = new schema.Array(valueMode);

const field: schema.Entity<IField> = new schema.Entity('fields', undefined, {
    idAttribute: (field: IField) => field.name
});
const fields = new schema.Array(field);

const operator: schema.Entity<IOperator> = new schema.Entity('operators', undefined, {
    idAttribute: (operator: IOperator) => operator.name
});
const operators = new schema.Array(operator);

const condition: schema.Entity<ICondition> = new schema.Entity('conditions', undefined, {
    idAttribute: (condition: ICondition) => condition.name
});
const conditions = new schema.Array(condition);

const decision: schema.Entity<IDecision> = new schema.Entity('decisions', undefined, {
    idAttribute: (decision: IDecision) => decision.name
});

// TODO simulated metrics

const region: schema.Entity<IRegion> = new schema.Entity('regions', undefined, {
    idAttribute: (region: IRegion) => region.name
});

const loadBalancer: schema.Entity<ILoadBalancer> = new schema.Entity('loadBalancers', undefined, {
    idAttribute: (loadBalancer: ILoadBalancer) => '' //TODO
});

//TODO eurekaServers

const logs: schema.Entity<ILogs> = new schema.Entity('logs', undefined, {
    idAttribute: (logs: ILogs) => logs.eventId.toString()
});


app.define({ appServices });
service.define({ apps, dependencies, dependees, serviceRules });
cloudHost.define({ hostRules, state });
edgeHost.define({ hostRules });
ruleHost.define({ conditions, edgeHosts, cloudHosts });
ruleService.define({ conditions, services });
condition.define({ valueModes, fields, operators });

export const Schemas: ISchemas = {
    APP: app,
    APP_ARRAY: [app],
    APP_SERVICE: appService,
    APP_SERVICE_ARRAY: [appService],
    SERVICE: service,
    SERVICE_ARRAY: [service],
    SERVICE_APP: app,
    SERVICE_APP_ARRAY: [app],
    SERVICE_DEPENDENCY: dependency,
    SERVICE_DEPENDENCY_ARRAY: [dependency],
    SERVICE_DEPENDEE: dependee,
    SERVICE_DEPENDEE_ARRAY: [dependee],
    SERVICE_PREDICTION: prediction,
    SERVICE_PREDICTION_ARRAY: [prediction],
    SERVICE_RULE: ruleService,
    SERVICE_RULE_ARRAY: [ruleService],
    CONTAINER: container,
    CONTAINER_ARRAY: [container],
    CLOUD_HOST: cloudHost,
    CLOUD_HOST_ARRAY: [cloudHost],
    CLOUD_HOST_RULE: ruleHost,
    CLOUD_HOST_RULE_ARRAY: [ruleHost],
    EDGE_HOST: edgeHost,
    EDGE_HOST_ARRAY: [edgeHost],
    EDGE_HOST_RULE: ruleHost,
    EDGE_HOST_RULE_ARRAY: [ruleHost],
    NODE: node,
    NODE_ARRAY: [node],
    RULE_HOST: ruleHost,
    RULE_HOST_ARRAY: [ruleHost],
    RULE_SERVICE: ruleService,
    RULE_SERVICE_ARRAY: [ruleService],
    RULE_CONDITION: condition,
    RULE_CONDITION_ARRAY: [condition],
    VALUE_MODE_ARRAY: [valueMode],
    FIELD_ARRAY: [field],
    OPERATOR_ARRAY: [operator],
    DECISION: decision,
    DECISION_ARRAY: [decision],
    //TODO simulatedMetrics
    REGION: region,
    REGION_ARRAY: [region],
    LOAD_BALANCER: loadBalancer,
    LOAD_BALANCER_ARRAY: [loadBalancer],
    //TODO eureka
    LOGS_ARRAY: [logs],
};

export const CALL_API = 'Call API';

export default (store: any) => (next: (action: any) => void) => (action: any) => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action)
    }
    const { endpoint, schema, types, entity } = callAPI;
    const actionWith = (data: any) => {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    };
    const [ requestType, successType, failureType ] = types;
    next(actionWith({ type: requestType }));
    return callApi(endpoint, schema).then(
      response => {
          next(actionWith({ type: successType, entity, data: response }));
      },
      error => {
          next(actionWith({ type: failureType, error: error.message || 'Error fetching data' } ));
      })

}
