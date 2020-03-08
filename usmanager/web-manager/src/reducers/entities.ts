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
  REGIONS_FAILURE,
  REGIONS_SUCCESS,
  SERVICE_APPS_REQUEST,
  SERVICE_PREDICTIONS_REQUEST,
  SERVICE_RULES_REQUEST,
  SERVICE_APPS_FAILURE,
  SERVICE_PREDICTIONS_FAILURE,
  SERVICE_RULES_FAILURE,
  SERVICE_APPS_SUCCESS,
  SERVICE_DEPENDEES_FAILURE,
  SERVICE_DEPENDEES_REQUEST,
  SERVICE_DEPENDEES_SUCCESS,
  ADD_SERVICE_APP,
  REMOVE_SERVICE_APPS,
  ADD_SERVICE_PREDICTION,
  REMOVE_SERVICE_PREDICTIONS,
  ADD_SERVICE_RULE,
  REMOVE_SERVICE_RULES,
  RULES_REQUEST,
  RULES_FAILURE,
  RULES_SUCCESS,
  SERVICE_PREDICTIONS_SUCCESS,
  SERVICE_RULES_SUCCESS,
  APPS_REQUEST,
  APPS_FAILURE,
  APPS_SUCCESS,
  APP_SERVICES_FAILURE,
  APP_SERVICES_SUCCESS,
  APP_SERVICES_REQUEST,
  NODES_REQUEST,
  NODES_FAILURE,
  NODES_SUCCESS,
  CLOUD_HOSTS_REQUEST,
  CLOUD_HOSTS_FAILURE, CLOUD_HOSTS_SUCCESS, EDGE_HOSTS_REQUEST, EDGE_HOSTS_FAILURE, EDGE_HOSTS_SUCCESS
} from "../actions";
import {normalize} from "normalizr";
import {Schemas} from "../middleware/api";
import {IService} from "../routes/services/Service";
import {merge, pick, keys } from 'lodash';
import {ILogs} from "../routes/logs/Logs";
import {IRegion} from "../routes/region/Region";
import {IApp, IAppService} from "../routes/services/ServiceAppList";
import {IPrediction} from "../routes/services/ServicePredictionList";
import {IRule} from "../routes/services/ServiceRuleList";
import {IDependee} from "../routes/services/ServiceDependeeList";
import {INode} from "../routes/nodes/Node";
import {ICloudHost} from "../routes/hosts/CloudHost";
import {IEdgeHost} from "../routes/hosts/EdgeHost";

export type EntitiesState = {
  services: {
    data: { [key: string]: IService },
    isLoadingServices: boolean,
    loadServicesError?: string | null,
    isLoadingApps: boolean,
    loadAppsError?: string | null,
    isLoadingDependencies: boolean,
    loadDependenciesError?: string | null,
    isLoadingDependees: boolean,
    loadDependeesError?: string | null,
    isLoadingPredictions: boolean,
    loadPredictionsError?: string | null,
    isLoadingRules: boolean,
    loadRulesError?: string | null,
  },
  apps: {
    data: { [key: string]: IApp },
    isLoading: boolean,
    error?: string | null,
    isLoadingServices: boolean,
    loadServicesError?: string | null,
  },
  regions: {
    data: { [key: string]: IRegion },
    isLoading: boolean,
    error?: string | null,
  },
  rules: {
    data: { [key: string]: IRule },
    isLoading: boolean,
    error?: string | null,
  },
  nodes: {
    data: { [key: string]: INode },
    isLoading: boolean,
    error?: string | null,
  },
  hosts: {
    cloud: {
      data: { [key: string]: ICloudHost },
      isLoading: boolean,
      error?: string | null,
    },
    edge: {
      data: { [key: string]: IEdgeHost },
      isLoading: boolean,
      error?: string | null,
    }
  },
  logs: {
    data: { [key: number]: ILogs },
    isLoading: boolean,
    error?: string | null,
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
    apps?: IApp[],
    appServices?: IAppService[],
    appsNames?: string[],
    dependencies?: IService[],
    dependenciesNames?: string[],
    dependees?: IDependee[],
    predictions?: IPrediction[],
    predictionsNames?: string[],
    regions?: IRegion[],
    rules?: IRule[],
    rulesNames?: string[],
    nodes?: INode[],
    cloudHosts?: ICloudHost[],
    edgeHosts?: ICloudHost[],
    logs?: ILogs[],
    //TODO other entities
  },
};

const entities = (state: EntitiesState = {
                    services: {
                      data: {},
                      isLoadingServices: false,
                      loadServicesError: null,
                      isLoadingApps: false,
                      loadAppsError: null,
                      isLoadingDependencies: false,
                      loadDependenciesError: null,
                      isLoadingDependees: false,
                      loadDependeesError: null,
                      isLoadingPredictions: false,
                      loadPredictionsError: null,
                      isLoadingRules: false,
                      loadRulesError: null,
                    },
                    apps: {
                      data: {},
                      isLoading: false,
                      error: null,
                      isLoadingServices: false,
                      loadServicesError: null,
                    },
                    regions: {
                      data: {},
                      isLoading: false,
                      error: null
                    },
                    rules: {
                      data: {},
                      isLoading: false,
                      error: null
                    },
                    nodes: {
                      data: {},
                      isLoading: false,
                      error: null
                    },
                    hosts: {
                      cloud: {
                        data: {},
                        isLoading: false,
                        error: null,
                      },
                      edge: {
                        data: {},
                        isLoading: false,
                        error: null,
                      },
                    },
                    logs: {
                      data: {},
                      isLoading: false,
                      error: null
                    },
                  },
                  action: EntitiesAction
): EntitiesState => {
  const { type, error, entity, data } = action;
  switch (type) {
    case SERVICE_REQUEST:
    case SERVICES_REQUEST:
      return merge({}, state, { services: { isLoadingServices: true } });
    case SERVICE_APPS_REQUEST:
      return merge({}, state, { services: { isLoadingApps: true } });
    case SERVICE_DEPENDENCIES_REQUEST:
      return merge({}, state, { services: { isLoadingDependencies: true } });
    case SERVICE_DEPENDEES_REQUEST:
      return merge({}, state, { services: { isLoadingDependees: true } });
    case SERVICE_PREDICTIONS_REQUEST:
      return merge({}, state, { services: { isLoadingPredictions: true } });
    case SERVICE_RULES_REQUEST:
      return merge({}, state, { services: { isLoadingRules: true } });
    case SERVICE_FAILURE:
    case SERVICES_FAILURE:
      return merge({}, state, { services: { isLoadingServices: false, loadServicesError: error } });
    case SERVICE_APPS_FAILURE:
      return merge({}, state, { services: { isLoadingApps: false, loadAppsError: error } });
    case SERVICE_DEPENDENCIES_FAILURE:
      return merge({}, state, { services: { isLoadingDependencies: false, loadDependenciesError: error } });
    case SERVICE_DEPENDEES_FAILURE:
      return merge({}, state, { services: { isLoadingDependees: false, loadDependeesError: error } });
    case SERVICE_PREDICTIONS_FAILURE:
      return merge({}, state, { services: { isLoadingPredictions: false, loadPredictionsError: error } });
    case SERVICE_RULES_FAILURE:
      return merge({}, state, { services: { isLoadingRules: false, loadRulesError: error } });
    case SERVICE_SUCCESS:
      return {
        ...state,
        services: {
          data: merge({}, state.services.data, data?.services),
          isLoadingServices: false,
          loadServicesError: null,
          isLoadingApps: state.services.isLoadingApps,
          loadAppsError: state.services.loadAppsError,
          isLoadingDependencies: state.services.isLoadingDependencies,
          loadDependenciesError: state.services.loadDependenciesError,
          isLoadingDependees: state.services.isLoadingDependees,
          loadDependeesError: state.services.loadDependeesError,
          isLoadingPredictions: state.services.isLoadingPredictions,
          loadPredictionsError: state.services.loadPredictionsError,
          isLoadingRules: state.services.isLoadingRules,
          loadRulesError: state.services.loadRulesError,
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
    case SERVICE_APPS_SUCCESS: {
      const service = entity && state.services.data[entity];
      const apps = { apps: data?.apps || [] };
      const serviceWithApps = Object.assign(service ? service : [entity], apps);
      const normalizedService = normalize(serviceWithApps, Schemas.SERVICE).entities;
      return merge({}, state, {
        services: {
          data: normalizedService.services,
          isLoadingApps: false,
          loadAppsError: null
        }
      });
    }
    case SERVICE_DEPENDENCIES_SUCCESS: {
      const service = entity && state.services.data[entity];
      const dependencies = { dependencies: data?.dependencies || [] };
      const serviceWithDependencies = Object.assign(service ? service : [entity], dependencies);
      const normalizedService = normalize(serviceWithDependencies, Schemas.SERVICE).entities;
      return merge({}, state, {
        services: {
          data: normalizedService.services,
          isLoadingDependencies: false,
          loadDependenciesError: null
        }
      });
    }
    case SERVICE_DEPENDEES_SUCCESS: {
      const service = entity && state.services.data[entity];
      const dependees = { dependees: data?.dependees || [] };
      const serviceWithDependees = Object.assign(service ? service : [entity], dependees);
      const normalizedService = normalize(serviceWithDependees, Schemas.SERVICE).entities;
      return merge({}, state, {
        services: {
          data: normalizedService.services,
          isLoadingDependees: false,
          loadDependeesError: null
        }
      });
    }
    case SERVICE_PREDICTIONS_SUCCESS: {
      const service = entity && state.services.data[entity];
      const predictions = { predictions: data?.predictions || [] };
      const serviceWithPredictions = Object.assign(service ? service : [entity], predictions);
      const normalizedService = normalize(serviceWithPredictions, Schemas.SERVICE).entities;
      return merge({}, state, {
        services: {
          data: normalizedService.services,
          isLoadingPredictions: false,
          loadPredictionsError: null
        }
      });
    }
    case SERVICE_RULES_SUCCESS: {
      const service = entity && state.services.data[entity];
      const rules = { rules: data?.rules || [] };
      const serviceWithRules = Object.assign(service ? service : [entity], rules);
      const normalizedService = normalize(serviceWithRules, Schemas.SERVICE).entities;
      return merge({}, state, {
        services: {
          data: normalizedService.services,
          isLoadingRules: false,
          loadRulesError: null
        }
      });
    }
    case ADD_SERVICE_APP:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.appsNames?.length) {
          service.apps?.unshift(data?.appsNames[0]);
          return state = merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case ADD_SERVICE_DEPENDENCY:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.dependenciesNames?.length) {
          service.dependencies?.unshift(data?.dependenciesNames[0]);
          return state = merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case ADD_SERVICE_PREDICTION:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.predictionsNames?.length) {
          service.predictions?.unshift(data?.predictionsNames[0]);
          return state = merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case ADD_SERVICE_RULE:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.rulesNames?.length) {
          service.rules?.unshift(data?.rulesNames[0]);
          return state = merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case REMOVE_SERVICE_APPS:
      if (entity) {
        const service = state.services.data[entity];
        const filteredApps = service.apps?.filter(app => !data?.appsNames?.includes(app));
        const serviceWithApps = Object.assign(service, { apps: filteredApps });
        return merge({}, state, { services: { data: serviceWithApps } });
      }
      break;
    case REMOVE_SERVICE_DEPENDENCIES:
      if (entity) {
        const service = state.services.data[entity];
        const filteredDependencies = service.dependencies?.filter(dependency => !data?.dependenciesNames?.includes(dependency));
        const serviceWithDependencies = Object.assign(service, { dependencies: filteredDependencies });
        return merge({}, state, { services: { data: serviceWithDependencies } });
      }
      break;
    case REMOVE_SERVICE_PREDICTIONS:
      if (entity) {
        const service = state.services.data[entity];
        const filteredPredictions = service.predictions?.filter(prediction => !data?.predictionsNames?.includes(prediction));
        const serviceWithPredictions = Object.assign(service, { predictions: filteredPredictions });
        return merge({}, state, { services: { data: serviceWithPredictions } });
      }
      break;
    case REMOVE_SERVICE_RULES:
      if (entity) {
        const service = state.services.data[entity];
        const filteredRules = service.rules?.filter(rule => !data?.rulesNames?.includes(rule));
        const serviceWithRules = Object.assign(service, { rules: filteredRules });
        return merge({}, state, { services: { data: serviceWithRules } });
      }
      break;
    case REGIONS_REQUEST:
      return merge({}, state, { regions: { isLoading: true } });
    case REGIONS_FAILURE:
      return merge({}, state, { regions: { isLoading: false, error: error } });
    case REGIONS_SUCCESS:
      return {
        ...state,
        regions: {
          ...state.regions,
          data: merge({}, pick(state.regions.data, keys(data?.regions)), data?.regions),
          isLoading: false,
          error: null,
        }
      };
    case NODES_REQUEST:
      return merge({}, state, { nodes: { isLoading: true } });
    case NODES_FAILURE:
      return merge({}, state, { nodes: { isLoading: false, error: error } });
    case NODES_SUCCESS:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          data: merge({}, pick(state.nodes.data, keys(data?.nodes)), data?.nodes),
          isLoading: false,
          error: null,
        }
      };
    case RULES_REQUEST:
      return merge({}, state, { rules: { isLoading: true } });
    case RULES_FAILURE:
      return merge({}, state, { rules: { isLoading: false, error: error } });
    case RULES_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          data: merge({}, pick(state.rules.data, keys(data?.rules)), data?.rules),
          isLoading: false,
          error: null,
        }
      };
    case APPS_REQUEST:
      return merge({}, state, { apps: { isLoading: true } });
    case APP_SERVICES_REQUEST:
      return merge({}, state, { apps: { isLoadingServices: true } });
    case APPS_FAILURE:
      return merge({}, state, { apps: { isLoading: false, error: error } });
    case APP_SERVICES_FAILURE:
      return merge({}, state, { apps: { isLoadingServices: false, loadServicesError: error } });
    case APPS_SUCCESS:
      return {
        ...state,
        apps: {
          ...state.apps,
          data: merge({}, pick(state.apps.data, keys(data?.apps)), data?.apps),
          isLoading: false,
          error: null,
        }
      };
    case APP_SERVICES_SUCCESS:
      const app = entity && state.apps.data[entity];
      const services = { services: data?.appServices || [] };
      const appWithServices = Object.assign(app ? app : [entity], services);
      const normalizedApp = normalize(appWithServices, Schemas.APP).entities;
      return merge({}, state, {
        apps: {
          data: normalizedApp.apps,
          isLoadingServices: false,
          loadServicesError: null
        }
      });
    case CLOUD_HOSTS_REQUEST:
      return merge({}, state, { hosts: { cloud: { isLoading: true } } });
    case CLOUD_HOSTS_FAILURE:
      return merge({}, state, { hosts: { cloud: { isLoading: false, error: error } } });
    case CLOUD_HOSTS_SUCCESS:
      return {
        ...state,
        hosts: {
          ...state.hosts,
          cloud: {
            ...state.hosts.cloud,
            data: merge({}, pick(state.hosts.cloud.data, keys(data?.cloudHosts)), data?.cloudHosts),
            isLoading: false,
            error: null,
          }
        }
      };
    case EDGE_HOSTS_REQUEST:
      return merge({}, state, { hosts: { edge: { isLoading: true } } });
    case EDGE_HOSTS_FAILURE:
      return merge({}, state, { hosts: { edge: { isLoading: false, error: error } } });
    case EDGE_HOSTS_SUCCESS:
      return {
        ...state,
        hosts: {
          ...state.hosts,
          edge: {
            ...state.hosts.edge,
            data: merge({}, pick(state.hosts.edge.data, keys(data?.edgeHosts)), data?.edgeHosts),
            isLoading: false,
            error: null,
          }
        }
      };
    case LOGS_REQUEST:
      return merge({}, state, { logs: { isLoading: true } });
    case LOGS_FAILURE:
      return merge({}, state, { logs: { isLoading: false, error: error } });
    case LOGS_SUCCESS:
      return {
        ...state,
        logs: {
          ...state.apps,
          data: merge({}, pick(state.logs.data, keys(data?.logs)), data?.logs),
          isLoading: false,
          error: null,
        }
      };
    default:
      return state;
  }
  return state;
};


export default entities;