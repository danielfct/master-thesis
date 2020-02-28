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

import {
  SERVICES_FAILURE,
  SERVICES_REQUEST,
  SERVICES_SUCCESS,
  SERVICE_DEPENDENCIES_SUCCESS,
  SERVICE_REQUEST,
  SERVICE_FAILURE,
  SERVICE_SUCCESS,
  SERVICE_DEPENDENCIES_REQUEST,
  SERVICE_DEPENDENCIES_FAILURE,
  REMOVE_SERVICE_DEPENDENCIES,
  ADD_SERVICE_DEPENDENCY,
  LOGS_REQUEST,
  LOGS_FAILURE,
  LOGS_SUCCESS,
  REGIONS_REQUEST,
  REGIONS_FAILURE, REGIONS_SUCCESS
} from "../actions";
import {normalize} from "normalizr";
import {Schemas} from "../middleware/api";
import {IService} from "../routes/services/Service";
import {merge, mergeWith, assign, pick, keys, isEqual } from 'lodash';
import {ILogs} from "../routes/logs/Logs";
import {IRegion} from "../routes/region/Region";

export type EntitiesState = {
  services: {
    data: { [key: string]: IService },
    isLoadingServices: boolean,
    loadServicesError?: string | null,
    isLoadingDependencies: boolean,
    loadDependenciesError?: string | null,
  },
  logs: {
    data: { [key: number]: ILogs },
    isLoading: boolean,
    error?: string | null,
  },
  regions: {
    data: { [key: string]: IRegion },
    isLoading: boolean,
    error?: string | null,
  }
  //TODO other entities
}

export type EntitiesAction = {
  type: string,
  entity?: number | string,
  isLoading?: {},
  error?: string,
  data?: {
    services?: IService[],
    dependencies?: IService[],
    dependenciesNames?: string[],
    logs?: ILogs[],
    regions?: IRegion[],
    //TODO other entities
  },
};

const entities = (state: EntitiesState = {
                    services: {
                      data: {},
                      isLoadingServices: false,
                      loadServicesError: null,
                      isLoadingDependencies: false,
                      loadDependenciesError: null,
                    },
                    logs: {
                      data: {},
                      isLoading: false,
                      error: null
                    },
                    regions: {
                      data: {},
                      isLoading: false,
                      error: null
                    }
                  },
                  action: EntitiesAction
) => {
  const { type, error, entity, data } = action;
  switch (type) {
    case SERVICE_REQUEST:
    case SERVICES_REQUEST:
      return merge({}, state, { services: { isLoadingServices: true } });
    case SERVICE_DEPENDENCIES_REQUEST:
      return merge({}, state, { services: { isLoadingDependencies: true } });
    case SERVICE_FAILURE:
    case SERVICES_FAILURE:
      return merge({}, state, { services: { isLoadingServices: false, loadServicesError: error } });
    case SERVICE_DEPENDENCIES_FAILURE:
      return merge({}, state, { services: { isLoadingDependencies: false, loadDependenciesError: error } });
    case SERVICE_SUCCESS:
      return {
        ...state,
        services: {
          data: merge({}, state.services.data, data?.services),
          isLoadingServices: false,
          loadServicesError: null,
          isLoadingDependencies: state.services.isLoadingDependencies,
          loadDependenciesError: state.services.loadDependenciesError
        }
      };
    case SERVICES_SUCCESS:
      return {
        ...state,
        services: {
          ...state.services,
          data: merge({}, pick(state.services.data, keys(data?.services)), data?.services),
          isLoadingServices: false,
          loadServicesError: null,
        }
      };
    case SERVICE_DEPENDENCIES_SUCCESS:
      const service = entity && state.services.data[entity];
      const dependencies = { dependencies: data?.dependencies || [] };
      const serviceWithDependencies = Object.assign(service ? service : [entity], dependencies);
      const normalizedService = normalize(serviceWithDependencies, Schemas.SERVICE).entities;
      return merge({}, state, { services: { data: normalizedService.services, isLoadingDependencies: false, loadDependenciesError: null } });
    case ADD_SERVICE_DEPENDENCY:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.dependenciesNames?.length) {
          service.dependencies?.unshift(data?.dependenciesNames[0]);
          return state = merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case REMOVE_SERVICE_DEPENDENCIES:
      if (entity) {
        const service = state.services.data[entity];
        const filteredDependencies = service.dependencies?.filter(dependency => !data?.dependenciesNames?.includes(dependency));
        const serviceWithDependencies = Object.assign(service, {dependencies: filteredDependencies});
        const normalizedService = normalize(serviceWithDependencies, Schemas.SERVICE).entities;
        state = merge({}, state, { services: { data: normalizedService.services } });
      }
      break;
    case LOGS_REQUEST:
      return merge({}, state, { logs: { isLoading: true } });
    case LOGS_FAILURE:
      return merge({}, state, { logs: { isLoading: false, error: error } });
    case LOGS_SUCCESS:
      return {
        ...state,
        logs: {
          data: data?.logs,
          isLoading: false,
          error: null,
        }
      };
    case REGIONS_REQUEST:
      return merge({}, state, { regions: { isLoading: true } });
    case REGIONS_FAILURE:
      return merge({}, state, { regions: { isLoading: false, error: error } });
    case REGIONS_SUCCESS:
      return {
        ...state,
        regions: {
          data: data?.regions,
          isLoading: false,
          error: null,
        }
      };
    default:
      return state;
  }
};


export default entities;