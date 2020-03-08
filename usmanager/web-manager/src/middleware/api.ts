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
import {IRule} from "../routes/services/ServiceRuleList";
import {IApp, IAppService} from "../routes/services/ServiceAppList";
import {INode} from "../routes/nodes/Node";
import {ICloudHost} from "../routes/hosts/CloudHost";
import {IEdgeHost} from "../routes/hosts/EdgeHost";

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
    SERVICE_RULE: schema.Entity<IRule>;
    SERVICE_RULE_ARRAY: schema.Entity<IRule>[];
    APP: schema.Entity<IApp>;
    APP_SERVICE_ARRAY: schema.Entity<IAppService>[];
    APP_ARRAY: schema.Entity<IApp>[];
    REGION: schema.Entity<IRegion>;
    REGION_ARRAY: schema.Entity<IRegion>[];
    RULE: schema.Entity<IRule>;
    RULE_ARRAY: schema.Entity<IRule>[];
    NODE: schema.Entity<INode>;
    NODE_ARRAY: schema.Entity<INode>[];
    CLOUD_HOST: schema.Entity<ICloudHost>;
    CLOUD_HOST_ARRAY: schema.Entity<ICloudHost>[];
    EDGE_HOST: schema.Entity<IEdgeHost>;
    EDGE_HOST_ARRAY: schema.Entity<IEdgeHost>[];
    LOGS_ARRAY: schema.Entity<ILogs>[];
}


const appServiceSchema: schema.Entity<IAppService> = new schema.Entity('appServices', undefined, {
    idAttribute: (app: IAppService) => app.service.serviceName
});
const appServices = new schema.Array(appServiceSchema);
const appSchema: schema.Entity<IApp> = new schema.Entity('apps',
  {
      appServices
  },
  {
      idAttribute: (app: IApp) => app.name
  });
const apps = new schema.Array(appSchema);

const dependencySchema: schema.Entity<IServiceDependency> = new schema.Entity('dependencies', {}, {
    idAttribute: (dependency: IServiceDependency) => dependency.serviceName
});
const dependencies = new schema.Array(dependencySchema);

const dependeeSchema: schema.Entity<IDependee> = new schema.Entity('dependees', {}, {
    idAttribute: (dependee: IDependee) => dependee.serviceName
});
const dependees = new schema.Array(dependeeSchema);

const predictionSchema: schema.Entity<IPrediction> = new schema.Entity('predictions', {}, {
    idAttribute: (prediction: IPrediction) => prediction.name
});
const predictions = new schema.Array(predictionSchema);

const ruleSchema: schema.Entity<IRule> = new schema.Entity('rules', {}, {
    idAttribute: (rule: IRule) => rule.name
});
const rules = new schema.Array(ruleSchema);

const nodeSchema: schema.Entity<INode> = new schema.Entity('nodes', {}, {
    idAttribute: (node: INode) => node.id.toString()
});
/*const nodes = new schema.Array(nodeSchema);*/

const serviceSchema: schema.Entity<IService> = new schema.Entity('services', {
    apps,
    dependencies,
    dependees,
    predictions,
    rules
}, {
    idAttribute: (service: IService) => service.serviceName
});
//const services = new schema.Array(serviceSchema);

const regionSchema: schema.Entity<IRegion> = new schema.Entity('regions', undefined, {
    idAttribute: (region: IRegion) => region.name
});

const cloudHostSchema: schema.Entity<ICloudHost> = new schema.Entity('cloudHosts', {}, {
    idAttribute: (host: ICloudHost) => host.instanceId
});

const edgeHostSchema: schema.Entity<IEdgeHost> = new schema.Entity('edgeHosts', {}, {
    idAttribute: (host: IEdgeHost) => host.hostname
});

const logsSchema: schema.Entity<ILogs> = new schema.Entity('logs', undefined, {
    idAttribute: (logs: ILogs) => logs.eventId.toString()
});

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
    SERVICE_RULE: ruleSchema,
    SERVICE_RULE_ARRAY: [ruleSchema],
    APP: appSchema,
    APP_ARRAY: [appSchema],
    APP_SERVICE_ARRAY: [appServiceSchema],
    REGION: regionSchema,
    REGION_ARRAY: [regionSchema],
    RULE: ruleSchema,
    RULE_ARRAY: [ruleSchema],
    NODE: nodeSchema,
    NODE_ARRAY: [nodeSchema],
    CLOUD_HOST: cloudHostSchema,
    CLOUD_HOST_ARRAY: [cloudHostSchema],
    EDGE_HOST: edgeHostSchema,
    EDGE_HOST_ARRAY: [edgeHostSchema],
    LOGS_ARRAY: [logsSchema],
};

/*const repoSchema = new schema.Entity('repos', {
    owner: userSchema
}, {
    idAttribute: repo => repo.fullName.toLowerCase()
})*/

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
