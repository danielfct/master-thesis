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
import {IServiceDependency} from "../routes/services/ServiceDependencyList";
import {EntitiesAction, EntitiesState} from "../reducers/entities";

export const SERVICES_REQUEST = 'SERVICES_REQUEST';
export const SERVICES_SUCCESS = 'SERVICES_SUCCESS';
export const SERVICES_FAILURE = 'SERVICES_FAILURE';
export const SERVICE_REQUEST = 'SERVICE_REQUEST';
export const SERVICE_SUCCESS = 'SERVICE_SUCCESS';
export const SERVICE_FAILURE = 'SERVICE_FAILURE';
export const loadServices = (name?: string) => (dispatch: any) => {
  /*let cached;
  if (name) {
      let entity = getState().entities.services[name];
      cached = entity && entity.hasOwnProperty(requiredField);
  }
  else {
      let entities = getState().entities.services;
      cached = entities && entities.length
          && entities.every((entity: IService) => entity.hasOwnProperty(requiredField));
  }
  return cached ? null : dispatch(fetchServices(name));*/
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
export const REMOVE_SERVICE_APP = 'REMOVE_SERVICE_APP';
export function removeServiceApps(serviceName: string, apps: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_APP,
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

export const SERVICE_DEPENDENTSBY_REQUEST = 'SERVICE_DEPENDENTSBY_REQUEST';
export const SERVICE_DEPENDENTSBY_SUCCESS = 'SERVICE_DEPENDENTSBY_SUCCESS';
export const SERVICE_DEPENDENTSBY_FAILURE = 'SERVICE_DEPENDENTSBY_FAILURE';
export const loadServiceDependentsBy = (serviceName: string) => (dispatch: any) => {
  return dispatch(fetchServiceDependentsBy(serviceName));
};
const fetchServiceDependentsBy = (serviceName: string) => ({
  [CALL_API]: {
    types: [ SERVICE_DEPENDENTSBY_REQUEST, SERVICE_DEPENDENTSBY_SUCCESS, SERVICE_DEPENDENTSBY_FAILURE ],
    endpoint: `services/${serviceName}/dependents_by`,
    schema: Schemas.SERVICE_DEPENDENTBY_ARRAY,
    entity: serviceName
  }
});
export const ADD_SERVICE_DEPENDENTSBY = 'ADD_SERVICE_DEPENDENTSBY';
export function addServiceDependentBy(serviceName: string, dependentBy: string): EntitiesAction {
  return {
    type: ADD_SERVICE_DEPENDENTSBY,
    entity: serviceName,
    data: { dependentsByNames: new Array(dependentBy) }
  }
}
export const REMOVE_SERVICE_DEPENDENTSBY = 'REMOVE_SERVICE_DEPENDENTSBY';
export function removeServiceDependentsBy(serviceName: string, dependentsBy: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_DEPENDENTSBY,
    entity: serviceName,
    data: { dependentsByNames: dependentsBy }
  }
}

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
export const REMOVE_SERVICE_PREDICTION = 'REMOVE_SERVICE_PREDICTION';
export function removeServicePredictions(serviceName: string, predictions: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_PREDICTION,
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
export const REMOVE_SERVICE_RULE = 'REMOVE_SERVICE_RULE';
export function removeServiceRules(serviceName: string, rules: string[]): EntitiesAction {
  return {
    type: REMOVE_SERVICE_RULE,
    entity: serviceName,
    data: { rulesNames: rules }
  }
}

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
