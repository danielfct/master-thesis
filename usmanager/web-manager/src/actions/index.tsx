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

import {CALL_API, Schemas} from "../middleware/api";
import {IBreadcrumbs} from "../components/breadcrumbs/Breadcrumbs";
import {IService} from "../routes/services/Service";
import {IServiceDependency} from "../routes/services/dependencies/ServiceDependencyList";
import {EntitiesAction, EntitiesState} from "../reducers/entities";

export const SERVICES_REQUEST = 'SERVICES_REQUEST';
export const SERVICES_SUCCESS = 'SERVICES_SUCCESS';
export const SERVICES_FAILURE = 'SERVICES_FAILURE';
export const SERVICE_REQUEST = 'SERVICE_REQUEST';
export const SERVICE_SUCCESS = 'SERVICE_SUCCESS';
export const SERVICE_FAILURE = 'SERVICE_FAILURE';
export const loadServices = (name?: string) => (dispatch: any) => {
  return dispatch(fetchServices(name));
};
const fetchServices = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ SERVICES_REQUEST, SERVICES_SUCCESS, SERVICES_FAILURE ],
        endpoint: `services`,
        schema: Schemas.SERVICE_ARRAY,
        entity: 'services'
      }
      : {
        types: [ SERVICE_REQUEST, SERVICE_SUCCESS, SERVICE_FAILURE ],
        endpoint: `services/${name}`,
        schema: Schemas.SERVICE,
        entity: 'services'
      }
});

export const SERVICE_APPS_REQUEST = 'SERVICE_APPS_REQUEST';
export const SERVICE_APPS_SUCCESS = 'SERVICE_APPS_SUCCESS';
export const SERVICE_APPS_FAILURE = 'SERVICE_APPS_FAILURE';
export const loadServiceApps = (serviceName: string) => (dispatch: any) => {
  return dispatch(fetchServiceApps(serviceName));
};
const fetchServiceApps = (serviceName: string) => ({
  [CALL_API]: {
    types: [ SERVICE_APPS_REQUEST, SERVICE_APPS_SUCCESS, SERVICE_APPS_FAILURE ],
    endpoint: `services/${serviceName}/apps`,
    schema: Schemas.SERVICE_APP_ARRAY,
    entity: serviceName
  }
});
export const ADD_SERVICE_APP = 'ADD_SERVICE_APP';
export function addServiceApp(serviceName: string, app: string): EntitiesAction {
  return {
    type: ADD_SERVICE_APP,
    entity: serviceName,
    data: { appsNames: new Array(app) }
  }
}
export const REMOVE_SERVICE_APPS = 'REMOVE_SERVICE_APPS';
export function removeServiceApps(serviceName: string, apps: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_APPS,
    entity: serviceName,
    data: { appsNames: apps }
  }
}

export const SERVICE_DEPENDENCIES_REQUEST = 'SERVICE_DEPENDENCIES_REQUEST';
export const SERVICE_DEPENDENCIES_SUCCESS = 'SERVICE_DEPENDENCIES_SUCCESS';
export const SERVICE_DEPENDENCIES_FAILURE = 'SERVICE_DEPENDENCIES_FAILURE';
export const loadServiceDependencies = (serviceName: string) => (dispatch: any) => {
  return dispatch(fetchServiceDependencies(serviceName));
};
const fetchServiceDependencies = (serviceName: string) => ({
  [CALL_API]: {
    types: [ SERVICE_DEPENDENCIES_REQUEST, SERVICE_DEPENDENCIES_SUCCESS, SERVICE_DEPENDENCIES_FAILURE ],
    endpoint: `services/${serviceName}/dependencies`,
    schema: Schemas.SERVICE_DEPENDENCY_ARRAY,
    entity: serviceName
  }
});
export const ADD_SERVICE_DEPENDENCY = 'ADD_SERVICE_DEPENDENCY';
export function addServiceDependency(serviceName: string, dependency: string): EntitiesAction {
  return {
    type: ADD_SERVICE_DEPENDENCY,
    entity: serviceName,
    data: { dependenciesNames: new Array(dependency) }
  }
}
export const REMOVE_SERVICE_DEPENDENCIES = 'REMOVE_SERVICE_DEPENDENCY';
export function removeServiceDependencies(serviceName: string, dependencies: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_DEPENDENCIES,
    entity: serviceName,
    data: { dependenciesNames: dependencies }
  }
}

export const SERVICE_DEPENDEES_REQUEST = 'SERVICE_DEPENDEES_REQUEST';
export const SERVICE_DEPENDEES_SUCCESS = 'SERVICE_DEPENDEES_SUCCESS';
export const SERVICE_DEPENDEES_FAILURE = 'SERVICE_DEPENDEES_FAILURE';
export const loadServiceDependees = (serviceName: string) => (dispatch: any) => {
  return dispatch(fetchServiceDependees(serviceName));
};
const fetchServiceDependees = (serviceName: string) => ({
  [CALL_API]: {
    types: [ SERVICE_DEPENDEES_REQUEST, SERVICE_DEPENDEES_SUCCESS, SERVICE_DEPENDEES_FAILURE ],
    endpoint: `services/${serviceName}/dependees`,
    schema: Schemas.SERVICE_DEPENDEE_ARRAY,
    entity: serviceName
  }
});

export const SERVICE_PREDICTIONS_REQUEST = 'SERVICE_PREDICTIONS_REQUEST';
export const SERVICE_PREDICTIONS_SUCCESS = 'SERVICE_PREDICTIONS_SUCCESS';
export const SERVICE_PREDICTIONS_FAILURE = 'SERVICE_PREDICTIONS_FAILURE';
export const loadServicePredictions = (serviceName: string) => (dispatch: any) => {
  return dispatch(fetchServicePredictions(serviceName));
};
const fetchServicePredictions = (serviceName: string) => ({
  [CALL_API]: {
    types: [ SERVICE_PREDICTIONS_REQUEST, SERVICE_PREDICTIONS_SUCCESS, SERVICE_PREDICTIONS_FAILURE ],
    endpoint: `services/${serviceName}/predictions`,
    schema: Schemas.SERVICE_PREDICTION_ARRAY,
    entity: serviceName
  }
});
export const ADD_SERVICE_PREDICTION = 'ADD_SERVICE_PREDICTION';
export function addServicePrediction(serviceName: string, prediction: string): EntitiesAction {
  return {
    type: ADD_SERVICE_PREDICTION,
    entity: serviceName,
    data: { predictionsNames: new Array(prediction) }
  }
}
export const REMOVE_SERVICE_PREDICTIONS = 'REMOVE_SERVICE_PREDICTIONS';
export function removeServicePredictions(serviceName: string, predictions: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_PREDICTIONS,
    entity: serviceName,
    data: { predictionsNames: predictions }
  }
}

export const SERVICE_RULES_REQUEST = 'SERVICE_RULES_REQUEST';
export const SERVICE_RULES_SUCCESS = 'SERVICE_RULES_SUCCESS';
export const SERVICE_RULES_FAILURE = 'SERVICE_RULES_FAILURE';
export const loadServiceRules = (serviceName: string) => (dispatch: any) => {
  return dispatch(fetchServiceRules(serviceName));
};
const fetchServiceRules = (serviceName: string) => ({
  [CALL_API]: {
    types: [ SERVICE_RULES_REQUEST, SERVICE_RULES_SUCCESS, SERVICE_RULES_FAILURE ],
    endpoint: `services/${serviceName}/rules`,
    schema: Schemas.SERVICE_RULE_ARRAY,
    entity: serviceName
  }
});
export const ADD_SERVICE_RULE = 'ADD_SERVICE_RULE';
export function addServiceRule(serviceName: string, rule: string): EntitiesAction {
  return {
    type: ADD_SERVICE_RULE,
    entity: serviceName,
    data: { rulesNames: new Array(rule) }
  }
}
export const REMOVE_SERVICE_RULES = 'REMOVE_SERVICE_RULES';
export function removeServiceRules(serviceName: string, rules: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_RULES,
    entity: serviceName,
    data: { rulesNames: rules }
  }
}

export const APPS_REQUEST = 'APPS_REQUEST';
export const APPS_SUCCESS = 'APPS_SUCCESS';
export const APPS_FAILURE = 'APPS_FAILURE';
export const APP_REQUEST = 'APP_REQUEST';
export const APP_SUCCESS = 'APP_SUCCESS';
export const APP_FAILURE = 'APP_FAILURE';
export const loadApps = (name?: string) => (dispatch: any) => {
  return dispatch(fetchApps(name));
};
const fetchApps = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE ],
        endpoint: `apps`,
        schema: Schemas.APP_ARRAY,
        entity: 'apps'
      }
      : {
        types: [ APP_REQUEST, APP_SUCCESS, APP_FAILURE ],
        endpoint: `apps/${name}`,
        schema: Schemas.APP,
        entity: 'apps'
      }
});
export const APP_SERVICES_REQUEST = 'APP_SERVICES_REQUEST';
export const APP_SERVICES_SUCCESS = 'APP_SERVICES_SUCCESS';
export const APP_SERVICES_FAILURE = 'APP_SERVICES_FAILURE';
export const loadAppServices = (appName: string) => (dispatch: any) => {
  return dispatch(fetchAppServices(appName));
};
const fetchAppServices = (appName: string) => ({
  [CALL_API]: {
    types: [ APP_SERVICES_REQUEST, APP_SERVICES_SUCCESS, APP_SERVICES_FAILURE ],
    endpoint: `apps/${appName}/services`,
    schema: Schemas.APP_SERVICE_ARRAY,
    entity: appName
  }
});
export const ADD_APP_SERVICE = 'ADD_APP_SERVICE';
export function addAppService(appName: string, serviceName: string): EntitiesAction {
  return {
    type: ADD_APP_SERVICE,
    entity: appName,
    data: { serviceNames: new Array(serviceName) }
  }
}
export const REMOVE_APP_SERVICES = 'REMOVE_APP_SERVICES';
export function removeAppServices(appName: string, serviceNames: string[]): EntitiesAction {
  return {
    type: REMOVE_APP_SERVICES,
    entity: appName,
    data: { serviceNames: serviceNames }
  }
}

export const REGIONS_REQUEST = 'REGIONS_REQUEST';
export const REGIONS_SUCCESS = 'REGIONS_SUCCESS';
export const REGIONS_FAILURE = 'REGIONS_FAILURE';
export const REGION_REQUEST = 'REGION_REQUEST';
export const REGION_SUCCESS = 'REGION_SUCCESS';
export const REGION_FAILURE = 'REGION_FAILURE';
export const loadRegions = (name?: string) => (dispatch: any) => {
  return dispatch(fetchRegions(name));
};
const fetchRegions = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ REGIONS_REQUEST, REGIONS_SUCCESS, REGIONS_FAILURE ],
        endpoint: `regions`,
        schema: Schemas.REGION_ARRAY,
        entity: 'regions'
      }
      : {
        types: [ REGION_REQUEST, REGION_SUCCESS, REGION_FAILURE ],
        endpoint: `regions/${name}`,
        schema: Schemas.REGION,
        entity: 'regions'
      }
});

export const RULES_HOST_REQUEST = 'RULES_HOST_REQUEST';
export const RULES_HOST_SUCCESS = 'RULES_HOST_SUCCESS';
export const RULES_HOST_FAILURE = 'RULES_HOST_FAILURE';
export const RULE_HOST_REQUEST = 'RULE_HOST_REQUEST';
export const RULE_HOST_SUCCESS = 'RULE_HOST_SUCCESS';
export const RULE_HOST_FAILURE = 'RULE_HOST_FAILURE';
export const loadRulesHost = (name?: string) => (dispatch: any) => {
  return dispatch(fetchRulesHost(name));
};
const fetchRulesHost = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ RULES_HOST_REQUEST, RULES_HOST_SUCCESS, RULES_HOST_FAILURE ],
        endpoint: `rules/hosts`,
        schema: Schemas.RULE_HOST_ARRAY,
        entity: 'hostRules'
      }
      : {
        types: [ RULE_HOST_REQUEST, RULE_HOST_SUCCESS, RULE_HOST_FAILURE ],
        endpoint: `rules/hosts/${name}`,
        schema: Schemas.RULE_HOST,
        entity: 'hostRules'
      }
});

export const GENERIC_RULES_HOST_REQUEST = 'GENERIC_RULES_HOST_REQUEST';
export const GENERIC_RULES_HOST_SUCCESS = 'GENERIC_RULES_HOST_SUCCESS';
export const GENERIC_RULES_HOST_FAILURE = 'GENERIC_RULES_HOST_FAILURE';
export const GENERIC_RULE_HOST_REQUEST = 'GENERIC_RULE_HOST_REQUEST';
export const GENERIC_RULE_HOST_SUCCESS = 'GENERIC_RULE_HOST_SUCCESS';
export const GENERIC_RULE_HOST_FAILURE = 'GENERIC_RULE_HOST_FAILURE';
export const loadGenericRulesHost = (name?: string) => (dispatch: any) => {
  return dispatch(fetchGenericRulesHost(name));
};
const fetchGenericRulesHost = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ GENERIC_RULES_HOST_REQUEST, GENERIC_RULES_HOST_SUCCESS, GENERIC_RULES_HOST_FAILURE ],
        endpoint: `rules/generic/hosts`,
        schema: Schemas.RULE_HOST_ARRAY,
        entity: 'genericHostRules'
      }
      : {
        types: [ GENERIC_RULE_HOST_REQUEST, GENERIC_RULE_HOST_SUCCESS, GENERIC_RULE_HOST_FAILURE ],
        endpoint: `rules/generic/hosts/${name}`,
        schema: Schemas.RULE_HOST,
        entity: 'genericHostRules'
      }
});

export const RULES_SERVICE_REQUEST = 'RULES_SERVICE_REQUEST';
export const RULES_SERVICE_SUCCESS = 'RULES_SERVICE_SUCCESS';
export const RULES_SERVICE_FAILURE = 'RULES_SERVICE_FAILURE';
export const RULE_SERVICE_REQUEST = 'RULE_SERVICE_REQUEST';
export const RULE_SERVICE_SUCCESS = 'RULE_SERVICE_SUCCESS';
export const RULE_SERVICE_FAILURE = 'RULE_SERVICE_FAILURE';
export const loadRulesService = (name?: string) => (dispatch: any) => {
  return dispatch(fetchRulesService(name));
};
const fetchRulesService = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ RULES_SERVICE_REQUEST, RULES_SERVICE_SUCCESS, RULES_SERVICE_FAILURE ],
        endpoint: `rules/services`,
        schema: Schemas.RULE_SERVICE_ARRAY,
        entity: 'serviceRules'
      }
      : {
        types: [ RULE_SERVICE_REQUEST, RULE_SERVICE_SUCCESS, RULE_SERVICE_FAILURE ],
        endpoint: `rules/services/${name}`,
        schema: Schemas.RULE_SERVICE,
        entity: 'serviceRules'
      }
});

export const GENERIC_RULES_SERVICE_REQUEST = 'GENERIC_RULES_SERVICE_REQUEST';
export const GENERIC_RULES_SERVICE_SUCCESS = 'GENERIC_RULES_SERVICE_SUCCESS';
export const GENERIC_RULES_SERVICE_FAILURE = 'GENERIC_RULES_SERVICE_FAILURE';
export const GENERIC_RULE_SERVICE_REQUEST = 'GENERIC_RULE_SERVICE_REQUEST';
export const GENERIC_RULE_SERVICE_SUCCESS = 'GENERIC_RULE_SERVICE_SUCCESS';
export const GENERIC_RULE_SERVICE_FAILURE = 'GENERIC_RULE_SERVICE_FAILURE';
export const loadGenericRulesService = (name?: string) => (dispatch: any) => {
  return dispatch(fetchGenericRulesService(name));
};
const fetchGenericRulesService = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ GENERIC_RULES_SERVICE_REQUEST, GENERIC_RULES_SERVICE_SUCCESS, GENERIC_RULES_SERVICE_FAILURE ],
        endpoint: `rules/generic/services`,
        schema: Schemas.RULE_SERVICE_ARRAY,
        entity: 'genericServiceRules'
      }
      : {
        types: [ GENERIC_RULE_SERVICE_REQUEST, GENERIC_RULE_SERVICE_SUCCESS, GENERIC_RULE_SERVICE_FAILURE ],
        endpoint: `rules/generic/services/${name}`,
        schema: Schemas.RULE_SERVICE,
        entity: 'genericServiceRules'
      }
});

export const RULE_HOST_CONDITIONS_REQUEST = 'RULE_HOST_CONDITIONS_REQUEST';
export const RULE_HOST_CONDITIONS_SUCCESS = 'RULE_HOST_CONDITIONS_SUCCESS';
export const RULE_HOST_CONDITIONS_FAILURE = 'RULE_HOST_CONDITIONS_FAILURE';
export const loadRuleHostConditions = (ruleName: string) => (dispatch: any) => {
  return dispatch(fetchRuleHostConditions(ruleName));
};
const fetchRuleHostConditions = (ruleName: string) => ({
  [CALL_API]: {
    types: [ RULE_HOST_CONDITIONS_REQUEST, RULE_HOST_CONDITIONS_SUCCESS, RULE_HOST_CONDITIONS_FAILURE ],
    endpoint: `rules/hosts/${ruleName}/conditions`,
    schema: Schemas.RULE_CONDITION_ARRAY,
    entity: ruleName
  }
});
export const ADD_RULE_HOST_CONDITION = 'ADD_RULE_HOST_CONDITION';
export function addRuleHostCondition(ruleName: string, condition: string): EntitiesAction {
  return {
    type: ADD_RULE_HOST_CONDITION,
    entity: ruleName,
    data: { conditionsNames: new Array(condition) }
  }
}

export const RULE_SERVICE_CONDITIONS_REQUEST = 'RULE_SERVICE_CONDITIONS_REQUEST';
export const RULE_SERVICE_CONDITIONS_SUCCESS = 'RULE_SERVICE_CONDITIONS_SUCCESS';
export const RULE_SERVICE_CONDITIONS_FAILURE = 'RULE_SERVICE_CONDITIONS_FAILURE';
export const loadRuleServiceConditions = (ruleName: string) => (dispatch: any) => {
  return dispatch(fetchRuleServiceConditions(ruleName));
};
const fetchRuleServiceConditions = (ruleName: string) => ({
  [CALL_API]: {
    types: [ RULE_SERVICE_CONDITIONS_REQUEST, RULE_SERVICE_CONDITIONS_SUCCESS, RULE_SERVICE_CONDITIONS_FAILURE ],
    endpoint: `rules/services/${ruleName}/conditions`,
    schema: Schemas.RULE_CONDITION_ARRAY,
    entity: ruleName
  }
});
export const ADD_RULE_SERVICE_CONDITION = 'ADD_RULE_SERVICE_CONDITION';
export function addRuleServiceCondition(ruleName: string, condition: string): EntitiesAction {
  return {
    type: ADD_RULE_SERVICE_CONDITION,
    entity: ruleName,
    data: { conditionsNames: new Array(condition) }
  }
}
export const REMOVE_RULE_HOST_CONDITIONS = 'REMOVE_RULE_HOST_CONDITIONS';
export function removeRuleHostConditions(ruleName: string, condition: string[]): EntitiesAction {
  return {
    type: REMOVE_RULE_HOST_CONDITIONS,
    entity: ruleName,
    data: { conditionsNames: condition }
  }
}
export const REMOVE_RULE_SERVICE_CONDITIONS = 'REMOVE_RULE_SERVICE_CONDITIONS';
export function removeRuleServiceConditions(ruleName: string, condition: string[]): EntitiesAction {
  return {
    type: REMOVE_RULE_SERVICE_CONDITIONS,
    entity: ruleName,
    data: { conditionsNames: condition }
  }
}

export const CONDITIONS_REQUEST = 'CONDITIONS_REQUEST';
export const CONDITIONS_SUCCESS = 'CONDITIONS_SUCCESS';
export const CONDITIONS_FAILURE = 'CONDITIONS_FAILURE';
export const CONDITION_REQUEST = 'CONDITION_REQUEST';
export const CONDITION_SUCCESS = 'CONDITION_SUCCESS';
export const CONDITION_FAILURE = 'CONDITION_FAILURE';
export const loadConditions = (name?: string) => (dispatch: any) => {
  return dispatch(fetchConditions(name));
};
const fetchConditions = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ CONDITIONS_REQUEST, CONDITIONS_SUCCESS, CONDITIONS_FAILURE ],
        endpoint: `rules/conditions`,
        schema: Schemas.CONDITION_ARRAY,
        entity: 'conditions'
      }
      : {
        types: [ CONDITION_REQUEST, CONDITION_SUCCESS, CONDITION_FAILURE ],
        endpoint: `rules/conditions/${name}`,
        schema: Schemas.CONDITION,
        entity: 'conditions'
      }
});

export const VALUE_MODES_REQUEST = 'VALUE_MODES_REQUEST';
export const VALUE_MODES_SUCCESS = 'VALUE_MODES_SUCCESS';
export const VALUE_MODES_FAILURE = 'VALUE_MODES_FAILURE';
export const loadValueModes = () => (dispatch: any) => {
  return dispatch(fetchValueModes());
};
const fetchValueModes = () => ({
  [CALL_API]: {
    types: [ VALUE_MODES_REQUEST, VALUE_MODES_SUCCESS, VALUE_MODES_FAILURE ],
    endpoint: `value-modes`,
    schema: Schemas.VALUE_MODE_ARRAY,
    entity: 'value-modes'
  }
});

export const FIELDS_REQUEST = 'FIELDS_REQUEST';
export const FIELDS_SUCCESS = 'FIELDS_SUCCESS';
export const FIELDS_FAILURE = 'FIELDS_FAILURE';
export const loadFields = () => (dispatch: any) => {
  return dispatch(fetchFields());
};
const fetchFields = () => ({
  [CALL_API]: {
    types: [ FIELDS_REQUEST, FIELDS_SUCCESS, FIELDS_FAILURE ],
    endpoint: `fields`,
    schema: Schemas.FIELD_ARRAY,
    entity: 'fields'
  }
});

export const OPERATORS_REQUEST = 'OPERATORS_REQUEST';
export const OPERATORS_SUCCESS = 'OPERATORS_SUCCESS';
export const OPERATORS_FAILURE = 'OPERATORS_FAILURE';
export const loadOperators = () => (dispatch: any) => {
  return dispatch(fetchOperators());
};
const fetchOperators = () => ({
  [CALL_API]: {
    types: [ OPERATORS_REQUEST, OPERATORS_SUCCESS, OPERATORS_FAILURE ],
    endpoint: `operators`,
    schema: Schemas.OPERATOR_ARRAY,
    entity: 'operators'
  }
});

export const DECISIONS_REQUEST = 'DECISIONS_REQUEST';
export const DECISIONS_SUCCESS = 'DECISIONS_SUCCESS';
export const DECISIONS_FAILURE = 'DECISIONS_FAILURE';
export const DECISION_REQUEST = 'DECISION_REQUEST';
export const DECISION_SUCCESS = 'DECISION_SUCCESS';
export const DECISION_FAILURE = 'DECISION_FAILURE';
export const loadDecisions = (name?: string) => (dispatch: any) => {
  return dispatch(fetchDecisions(name));
};
const fetchDecisions = (name?: string) => ({
  [CALL_API]:
    !name
      ? {
        types: [ DECISIONS_REQUEST, DECISIONS_SUCCESS, DECISIONS_FAILURE ],
        endpoint: `decisions`,
        schema: Schemas.DECISION_ARRAY,
        entity: 'serviceRules'
      }
      : {
        types: [ DECISION_REQUEST, DECISION_SUCCESS, DECISION_FAILURE ],
        endpoint: `decisions`,
        schema: Schemas.DECISION,
        entity: 'decisions'
      }
});

export const NODES_REQUEST = 'NODES_REQUEST';
export const NODES_SUCCESS = 'NODES_SUCCESS';
export const NODES_FAILURE = 'NODES_FAILURE';
export const NODE_REQUEST = 'NODE_REQUEST';
export const NODE_SUCCESS = 'NODE_SUCCESS';
export const NODE_FAILURE = 'NODE_FAILURE';
export const loadNodes = (id?: string) => (dispatch: any) => {
  return dispatch(fetchNodes(id));
};
const fetchNodes = (id?: string) => ({
  [CALL_API]:
    !id
      ? {
        types: [ NODES_REQUEST, NODES_SUCCESS, NODES_FAILURE ],
        endpoint: `nodes`,
        schema: Schemas.NODE_ARRAY,
        entity: 'nodes'
      }
      : {
        types: [ NODE_REQUEST, NODE_SUCCESS, NODE_FAILURE ],
        endpoint: `nodes/${id}`,
        schema: Schemas.NODE,
        entity: 'nodes'
      }
});

export const CLOUD_HOSTS_REQUEST = 'CLOUD_HOSTS_REQUEST';
export const CLOUD_HOSTS_SUCCESS = 'CLOUD_HOSTS_SUCCESS';
export const CLOUD_HOSTS_FAILURE = 'CLOUD_HOSTS_FAILURE';
export const CLOUD_HOST_REQUEST = 'CLOUD_HOST_REQUEST';
export const CLOUD_HOST_SUCCESS = 'CLOUD_HOST_SUCCESS';
export const CLOUD_HOST_FAILURE = 'CLOUD_HOST_FAILURE';
export const loadCloudHosts = (instanceId?: string) => (dispatch: any) => {
  return dispatch(fetchCloudHosts(instanceId));
};
const fetchCloudHosts = (instanceId?: string) => ({
  [CALL_API]:
    !instanceId
      ? {
        types: [ CLOUD_HOSTS_REQUEST, CLOUD_HOSTS_SUCCESS, CLOUD_HOSTS_FAILURE ],
        endpoint: `hosts/cloud`,
        schema: Schemas.CLOUD_HOST_ARRAY,
        entity: 'cloudHosts'
      }
      : {
        types: [ CLOUD_HOST_REQUEST, CLOUD_HOST_SUCCESS, CLOUD_HOST_FAILURE ],
        endpoint: `hosts/cloud/${instanceId}`,
        schema: Schemas.CLOUD_HOST,
        entity: 'cloudHosts'
      }
});
export const CLOUD_HOST_RULES_REQUEST = 'CLOUD_HOST_RULES_REQUEST';
export const CLOUD_HOST_RULES_SUCCESS = 'CLOUD_HOST_RULES_SUCCESS';
export const CLOUD_HOST_RULES_FAILURE = 'CLOUD_HOST_RULES_FAILURE';
export const loadCloudHostRules = (instanceId: string) => (dispatch: any) => {
  return dispatch(fetchCloudHostRules(instanceId));
};
const fetchCloudHostRules = (instanceId: string) => ({
  [CALL_API]: {
    types: [ CLOUD_HOST_RULES_REQUEST, CLOUD_HOST_RULES_SUCCESS, CLOUD_HOST_RULES_FAILURE ],
    endpoint: `hosts/cloud/${instanceId}/rules`,
    schema: Schemas.CLOUD_HOST_RULE_ARRAY,
    entity: instanceId
  }
});
export const ADD_CLOUD_HOST_RULE = 'ADD_CLOUD_HOST_RULE';
export function addCloudHostRule(hostname: string, rule: string): EntitiesAction {
  return {
    type: ADD_CLOUD_HOST_RULE,
    entity: hostname,
    data: { rulesNames: new Array(rule) }
  }
}
export const REMOVE_CLOUD_HOST_RULES = 'REMOVE_CLOUD_HOST_RULES';
export function removeCloudHostRules(hostname: string, rules: string[]): EntitiesAction {
  return {
    type: REMOVE_CLOUD_HOST_RULES,
    entity: hostname,
    data: { rulesNames: rules }
  }
}

export const EDGE_HOSTS_REQUEST = 'EDGE_HOSTS_REQUEST';
export const EDGE_HOSTS_SUCCESS = 'EDGE_HOSTS_SUCCESS';
export const EDGE_HOSTS_FAILURE = 'EDGE_HOSTS_FAILURE';
export const EDGE_HOST_REQUEST = 'EDGE_HOST_REQUEST';
export const EDGE_HOST_SUCCESS = 'EDGE_HOST_SUCCESS';
export const EDGE_HOST_FAILURE = 'EDGE_HOST_FAILURE';
export const loadEdgeHosts = (hostname?: string) => (dispatch: any) => {
  return dispatch(fetchEdgeHosts(hostname));
};
const fetchEdgeHosts = (hostname?: string) => ({
  [CALL_API]:
    !hostname
      ? {
        types: [ EDGE_HOSTS_REQUEST, EDGE_HOSTS_SUCCESS, EDGE_HOSTS_FAILURE ],
        endpoint: `hosts/edge`,
        schema: Schemas.EDGE_HOST_ARRAY,
        entity: 'edgeHosts'
      }
      : {
        types: [ EDGE_HOST_REQUEST, EDGE_HOST_SUCCESS, EDGE_HOST_FAILURE ],
        endpoint: `hosts/edge/${hostname}`,
        schema: Schemas.EDGE_HOST,
        entity: 'edgeHosts'
      }
});
export const EDGE_HOST_RULES_REQUEST = 'EDGE_HOST_RULES_REQUEST';
export const EDGE_HOST_RULES_SUCCESS = 'EDGE_HOST_RULES_SUCCESS';
export const EDGE_HOST_RULES_FAILURE = 'EDGE_HOST_RULES_FAILURE';
export const loadEdgeHostRules = (hostname: string) => (dispatch: any) => {
  return dispatch(fetchEdgeHostRules(hostname));
};
const fetchEdgeHostRules = (hostname: string) => ({
  [CALL_API]: {
    types: [ EDGE_HOST_RULES_REQUEST, EDGE_HOST_RULES_SUCCESS, EDGE_HOST_RULES_FAILURE ],
    endpoint: `hosts/edge/${hostname}/rules`,
    schema: Schemas.EDGE_HOST_RULE_ARRAY,
    entity: hostname
  }
});
export const ADD_EDGE_HOST_RULE = 'ADD_EDGE_HOST_RULE';
export function addEdgeHostRule(hostname: string, rule: string): EntitiesAction {
  return {
    type: ADD_EDGE_HOST_RULE,
    entity: hostname,
    data: { rulesNames: new Array(rule) }
  }
}
export const REMOVE_EDGE_HOST_RULES = 'REMOVE_EDGE_HOST_RULES';
export function removeEdgeHostRules(hostname: string, rules: string[]): EntitiesAction {
  return {
    type: REMOVE_EDGE_HOST_RULES,
    entity: hostname,
    data: { rulesNames: rules }
  }
}


export const CONTAINERS_REQUEST = 'CONTAINERS_REQUEST';
export const CONTAINERS_SUCCESS = 'CONTAINERS_SUCCESS';
export const CONTAINERS_FAILURE = 'CONTAINERS_FAILURE';
export const CONTAINER_REQUEST = 'CONTAINER_REQUEST';
export const CONTAINER_SUCCESS = 'CONTAINER_SUCCESS';
export const CONTAINER_FAILURE = 'CONTAINER_FAILURE';
export const loadContainers = (id?: string) => (dispatch: any) => {
  return dispatch(fetchContainers(id));
};
const fetchContainers = (id?: string) => ({
  [CALL_API]:
    !id
      ? {
        types: [ CONTAINERS_REQUEST, CONTAINERS_SUCCESS, CONTAINERS_FAILURE ],
        endpoint: `containers`,
        schema: Schemas.CONTAINER_ARRAY,
        entity: 'containers'
      }
      : {
        types: [ CONTAINER_REQUEST, CONTAINER_SUCCESS, CONTAINER_FAILURE ],
        endpoint: `containers/${id}`,
        schema: Schemas.CONTAINER,
        entity: 'containers'
      }
});

export const LOGS_REQUEST = 'LOGS_REQUEST';
export const LOGS_SUCCESS = 'LOGS_SUCCESS';
export const LOGS_FAILURE = 'LOGS_FAILURE';
export const loadLogs = () => (dispatch: any) => {
  return dispatch(fetchLogs());
};
const fetchLogs = () => ({
  [CALL_API]: {
    types: [ LOGS_REQUEST, LOGS_SUCCESS, LOGS_FAILURE ],
    endpoint: `logs`,
    schema: Schemas.LOGS_ARRAY,
  }
});

export const SIDENAV_SHOW_USER = 'SIDENAV_SHOW_USER';

export const showSidenavByUser = (value: boolean) => (
  {
    type: SIDENAV_SHOW_USER,
    value
  }
);

export const SIDENAV_SHOW_WIDTH = 'SIDENAV_SHOW_WIDTH';

export const showSidenavByWidth = (value: boolean) => (
  {
    type: SIDENAV_SHOW_WIDTH,
    value
  }
);

export const SEARCH_UPDATE = 'SEARCH_UPDATE';

export const updateSearch = (search: string) => (
  {
    type: SEARCH_UPDATE,
    search
  }
);
