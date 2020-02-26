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
  REMOVE_SERVICE_DEPENDENCIES, ADD_SERVICE_DEPENDENCY
} from "../actions";
import {normalize} from "normalizr";
import {Schemas} from "../middleware/api";
import {IService} from "../routes/services/Service";
import {merge, mergeWith, assign, pick, keys, isEqual } from 'lodash';

export type EntitiesState = {
  services: {
    data: { [key: string]: IService },
    isLoadingServices: boolean,
    loadServicesError?: string | null,
    isLoadingDependencies: boolean,
    loadDependenciesError?: string | null,
  },
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
    //TODO other entities
  },
};

const entities = (state: EntitiesState = {
                    services: {
                      data: {},
                      isLoadingServices: false,
                      loadServicesError: null,
                      isLoadingDependencies: false,
                      loadDependenciesError: null
                    }
                  },
                  action: EntitiesAction
) => {
  const { type, error, entity, data } = action;
  switch (type) {
    case SERVICE_REQUEST:
    case SERVICES_REQUEST:
      state = merge({}, state, { services: { isLoadingServices: true } });
      break;
    case SERVICE_DEPENDENCIES_REQUEST:
      state = merge({}, state, { services: { isLoadingDependencies: true } });
      break;
    case SERVICE_FAILURE:
    case SERVICES_FAILURE:
      state = merge({}, state, { services: { isLoadingServices: false, loadServicesError: error } });
      break;
    case SERVICE_DEPENDENCIES_FAILURE:
      state = merge({}, state, { services: { isLoadingDependencies: false, loadDependenciesError: error } });
      break;
    case SERVICE_SUCCESS:
      state = { ...state, services: {
          data: merge({}, state.services.data, data?.services),
          isLoadingServices: false,
          loadServicesError: null,
          isLoadingDependencies: state.services.isLoadingDependencies,
          loadDependenciesError: state.services.loadDependenciesError
        }
      };
      break;
    case SERVICES_SUCCESS:
      state = { ...state, services: {
          data: merge({}, pick(state.services.data, keys(data?.services)), data?.services),
          isLoadingServices: false,
          loadServicesError: null,
          isLoadingDependencies: state.services.isLoadingDependencies,
          loadDependenciesError: state.services.loadDependenciesError
        }
      };
      break;
    case SERVICE_DEPENDENCIES_SUCCESS:
      if (entity) {
        const service = state.services.data[entity];
        const dependencies = { dependencies: data?.dependencies || [] };
        const serviceWithDependencies = Object.assign(service ? service : [entity], dependencies);
        const normalizedService = normalize(serviceWithDependencies, Schemas.SERVICE).entities;
        state = merge({}, state, { services: { data: normalizedService.services, isLoadingDependencies: false, loadDependenciesError: null } });
      }
      break;
    case ADD_SERVICE_DEPENDENCY:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.dependenciesNames?.length) {
          service.dependencies?.unshift(data?.dependenciesNames[0]);
          state = merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
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
  }
  return state;
};


export default entities;