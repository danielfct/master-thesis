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
import {API_URL} from "../utils/api";
import {ILogs} from "../routes/logs/Logs";
import {IRegion} from "../routes/region/Region";
import {IDependee} from "../routes/services/ServiceDependeeList";
import {IPrediction} from "../routes/services/ServicePredictionList";
import {INode} from "../routes/nodes/Node";
import {ICloudHost} from "../routes/hosts/cloud/CloudHost";
import {IEdgeHost} from "../routes/hosts/edge/EdgeHost";
import {IContainer} from "../routes/containers/Container";
import {IApp} from "../routes/apps/App";
import {IDecision, IField, IOperator, IRule, IValueMode} from "../routes/rules/Rule";
import {IServiceRule} from "../routes/rules/services/ServiceRule";
import {IHostRule} from "../routes/rules/hosts/HostRule";
import {ICondition} from "../routes/rules/conditions/Condition";
import {IAppService} from "../routes/apps/AppServicesList";

const callApi = (endpoint: string, schema: any) => {
    const url = endpoint.includes(API_URL) ? endpoint : `${API_URL}/${endpoint}`;
    return axios.get(url, {
        //TODO remove headers
        headers: {
            'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json;charset=UTF-8',
        },
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
    SERVICE_RULE: schema.Entity<IServiceRule>;
    SERVICE_RULE_ARRAY: schema.Entity<IServiceRule>[];
    APP: schema.Entity<IApp>;
    APP_ARRAY: schema.Entity<IApp>[];
    APP_SERVICE: schema.Entity<IAppService>;
    APP_SERVICE_ARRAY: schema.Entity<IAppService>[];
    REGION: schema.Entity<IRegion>;
    REGION_ARRAY: schema.Entity<IRegion>[];
    RULE_HOST: schema.Entity<IHostRule>;
    RULE_HOST_ARRAY: schema.Entity<IHostRule>[];
    RULE_SERVICE: schema.Entity<IServiceRule>;
    RULE_SERVICE_ARRAY: schema.Entity<IServiceRule>[];
    RULE_CONDITION: schema.Entity<ICondition>;
    RULE_CONDITION_ARRAY: schema.Entity<ICondition>[];
    CONDITION: schema.Entity<ICondition>;
    CONDITION_ARRAY: schema.Entity<ICondition>[];
    VALUE_MODE_ARRAY: schema.Entity<IValueMode>[];
    FIELD_ARRAY: schema.Entity<IField>[];
    OPERATOR_ARRAY: schema.Entity<IOperator>[];
    DECISION: schema.Entity<IDecision>;
    DECISION_ARRAY: schema.Entity<IDecision>[];
    NODE: schema.Entity<INode>;
    NODE_ARRAY: schema.Entity<INode>[];
    CLOUD_HOST: schema.Entity<ICloudHost>;
    CLOUD_HOST_ARRAY: schema.Entity<ICloudHost>[];
    CLOUD_HOST_RULE: schema.Entity<IHostRule>;
    CLOUD_HOST_RULE_ARRAY: schema.Entity<IHostRule>[];
    EDGE_HOST: schema.Entity<IEdgeHost>;
    EDGE_HOST_ARRAY: schema.Entity<IEdgeHost>[];
    EDGE_HOST_RULE: schema.Entity<IHostRule>;
    EDGE_HOST_RULE_ARRAY: schema.Entity<IHostRule>[];
    CONTAINER: schema.Entity<IContainer>;
    CONTAINER_ARRAY: schema.Entity<IContainer>[];
    LOGS_ARRAY: schema.Entity<ILogs>[];
}

const appServiceSchema: schema.Entity<IAppService> = new schema.Entity('services', undefined, {
    idAttribute: (service: IAppService) => service.service.serviceName
});
const appServices = new schema.Array(appServiceSchema);
const appSchema: schema.Entity<IApp> = new schema.Entity('apps', undefined, {
    idAttribute: (app: IApp) => app.name
});
const apps = new schema.Array(appSchema);

const dependencySchema: schema.Entity<IServiceDependency> = new schema.Entity('dependencies', undefined, {
    idAttribute: (dependency: IServiceDependency) => dependency.serviceName
});
const dependencies = new schema.Array(dependencySchema);

const dependeeSchema: schema.Entity<IDependee> = new schema.Entity('dependees', undefined, {
    idAttribute: (dependee: IDependee) => dependee.serviceName
});
const dependees = new schema.Array(dependeeSchema);

const predictionSchema: schema.Entity<IPrediction> = new schema.Entity('predictions', undefined, {
    idAttribute: (prediction: IPrediction) => prediction.name
});

const valueModeSchema: schema.Entity<IValueMode> = new schema.Entity('valueModes', undefined, {
    idAttribute: (valueMode: IValueMode) => valueMode.name
});
const valueModes = new schema.Array(valueModeSchema);

const fieldSchema: schema.Entity<IField> = new schema.Entity('fields', undefined, {
    idAttribute: (field: IField) => field.name
});
const fields = new schema.Array(fieldSchema);

const operatorSchema: schema.Entity<IOperator> = new schema.Entity('operators', undefined, {
    idAttribute: (operator: IOperator) => operator.name
});
const operators = new schema.Array(operatorSchema);

const conditionSchema: schema.Entity<ICondition> = new schema.Entity('conditions', undefined, {
    idAttribute: (condition: ICondition) => condition.name
});
const conditions = new schema.Array(conditionSchema);

const ruleHostSchema: schema.Entity<IHostRule> = new schema.Entity('hostRules', undefined, {
    idAttribute: (hostRule: IHostRule) => hostRule.name
});
const hostRules = new schema.Array(ruleHostSchema);

const cloudHostSchema: schema.Entity<ICloudHost> = new schema.Entity('cloudHosts', undefined, {
    idAttribute: (host: ICloudHost) => host.instanceId
});
const cloudHosts = new schema.Array(cloudHostSchema);

const edgeHostSchema: schema.Entity<IEdgeHost> = new schema.Entity('edgeHosts', undefined, {
    idAttribute: (host: IEdgeHost) => host.hostname
});
const edgeHosts = new schema.Array(edgeHostSchema);

const ruleServiceSchema: schema.Entity<IServiceRule> = new schema.Entity('serviceRules', undefined, {
    idAttribute: (serviceRule: IServiceRule) => serviceRule.name
});
const serviceRules = new schema.Array(ruleServiceSchema);

const decisionSchema: schema.Entity<IDecision> = new schema.Entity('decisions', undefined, {
    idAttribute: (decision: IDecision) => decision.name
});

const nodeSchema: schema.Entity<INode> = new schema.Entity('nodes', undefined, {
    idAttribute: (node: INode) => node.id.toString()
});

const serviceSchema: schema.Entity<IService> = new schema.Entity('services', undefined, {
    idAttribute: (service: IService) => service.serviceName
});
const services = new schema.Array(serviceSchema);

const regionSchema: schema.Entity<IRegion> = new schema.Entity('regions', undefined, {
    idAttribute: (region: IRegion) => region.name
});

const containerSchema: schema.Entity<IContainer> = new schema.Entity('containers', undefined, {
    idAttribute: (container: IContainer) => container.id.toString()
});

const logsSchema: schema.Entity<ILogs> = new schema.Entity('logs', undefined, {
    idAttribute: (logs: ILogs) => logs.eventId.toString()
});

/*const repositorySchema = new schema.Entity('repositories', {
    owner: userSchema
}, {
    idAttribute: repository => repository.fullName.toLowerCase()
})*/

appSchema.define({ appServices });
edgeHostSchema.define({ hostRules });
cloudHostSchema.define({ hostRules });
serviceSchema.define({ apps, dependencies, dependees, serviceRules });
conditionSchema.define({ valueModes, fields, operators });
ruleHostSchema.define({ conditions, edgeHosts, cloudHosts });
ruleServiceSchema.define({ conditions, services });

export const Schemas: ISchemas = {
    SERVICE: serviceSchema,
    SERVICE_ARRAY: [serviceSchema],
    SERVICE_APP: appSchema,
    SERVICE_APP_ARRAY: [appSchema],
    SERVICE_DEPENDENCY: dependencySchema,
    SERVICE_DEPENDENCY_ARRAY: [dependencySchema],
    SERVICE_DEPENDEE: dependeeSchema,
    SERVICE_DEPENDEE_ARRAY: [dependeeSchema],
    SERVICE_PREDICTION: predictionSchema,
    SERVICE_PREDICTION_ARRAY: [predictionSchema],
    SERVICE_RULE: ruleServiceSchema,
    SERVICE_RULE_ARRAY: [ruleServiceSchema],
    APP: appSchema,
    APP_ARRAY: [appSchema],
    APP_SERVICE: appServiceSchema,
    APP_SERVICE_ARRAY: [appServiceSchema],
    REGION: regionSchema,
    REGION_ARRAY: [regionSchema],
    RULE_HOST: ruleHostSchema,
    RULE_HOST_ARRAY: [ruleHostSchema],
    RULE_SERVICE: ruleServiceSchema,
    RULE_SERVICE_ARRAY: [ruleServiceSchema],
    RULE_CONDITION: conditionSchema,
    RULE_CONDITION_ARRAY: [conditionSchema],
    CONDITION: conditionSchema,
    CONDITION_ARRAY: [conditionSchema],
    VALUE_MODE_ARRAY: [valueModeSchema],
    FIELD_ARRAY: [fieldSchema],
    OPERATOR_ARRAY: [operatorSchema],
    DECISION: decisionSchema,
    DECISION_ARRAY: [decisionSchema],
    NODE: nodeSchema,
    NODE_ARRAY: [nodeSchema],
    CLOUD_HOST: cloudHostSchema,
    CLOUD_HOST_ARRAY: [cloudHostSchema],
    CLOUD_HOST_RULE: ruleHostSchema,
    CLOUD_HOST_RULE_ARRAY: [ruleHostSchema],
    EDGE_HOST: edgeHostSchema,
    EDGE_HOST_ARRAY: [edgeHostSchema],
    EDGE_HOST_RULE: ruleHostSchema,
    EDGE_HOST_RULE_ARRAY: [ruleHostSchema],
    CONTAINER: containerSchema,
    CONTAINER_ARRAY: [containerSchema],
    LOGS_ARRAY: [logsSchema],
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
