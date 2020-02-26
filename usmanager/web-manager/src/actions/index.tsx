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

export const SERVICE_DEPENDENCIES_REQUEST = 'SERVICE_DEPENDENCIES_REQUEST';
export const SERVICE_DEPENDENCIES_SUCCESS = 'SERVICE_DEPENDENCIES_SUCCESS';
export const SERVICE_DEPENDENCIES_FAILURE = 'SERVICE_DEPENDENCIES_FAILURE';

export const loadServiceDependencies = (serviceName: string) => (dispatch: any, getState: any) => {
  /*const cachedService = getState().entities.services[service.serviceName];
  let cached = cachedService && cachedService.dependencies;
  if (id) {
      cached = cached[id];
  }
  console.log('service dependencies of ' + service.serviceName + ' cached? ' + cached);
  return cached ? null : dispatch(fetchServiceDependencies(service, id));*/
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
