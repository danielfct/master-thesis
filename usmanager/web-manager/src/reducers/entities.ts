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
  APPS_REQUEST,
  APP_REQUEST,
  APPS_FAILURE,
  APP_FAILURE,
  APPS_SUCCESS,
  APP_SUCCESS,
  ADD_APP,
  UPDATE_APP,
  APP_SERVICES_REQUEST,
  APP_SERVICES_FAILURE,
  APP_SERVICES_SUCCESS,
  ADD_APP_SERVICES,
  REMOVE_APP_SERVICES,
  SERVICES_REQUEST,
  SERVICE_REQUEST,
  SERVICES_FAILURE,
  SERVICE_FAILURE,
  SERVICES_SUCCESS,
  SERVICE_SUCCESS,
  ADD_SERVICE,
  SERVICE_APPS_REQUEST,
  SERVICE_APPS_FAILURE,
  SERVICE_APPS_SUCCESS,
  ADD_SERVICE_APPS,
  REMOVE_SERVICE_APPS,
  SERVICE_DEPENDENCIES_REQUEST,
  SERVICE_DEPENDENCIES_FAILURE,
  SERVICE_DEPENDENCIES_SUCCESS,
  ADD_SERVICE_DEPENDENCIES,
  REMOVE_SERVICE_DEPENDENCIES,
  SERVICE_DEPENDENTS_REQUEST,
  SERVICE_DEPENDENTS_FAILURE,
  SERVICE_DEPENDENTS_SUCCESS,
  SERVICE_PREDICTIONS_REQUEST,
  SERVICE_PREDICTIONS_FAILURE,
  SERVICE_PREDICTIONS_SUCCESS,
  ADD_SERVICE_PREDICTIONS,
  REMOVE_SERVICE_PREDICTIONS,
  SERVICE_RULES_REQUEST,
  SERVICE_RULES_FAILURE,
  SERVICE_RULES_SUCCESS,
  ADD_SERVICE_RULES,
  REMOVE_SERVICE_RULES,
  CONTAINER_REQUEST,
  CONTAINERS_REQUEST,
  CONTAINER_FAILURE,
  CONTAINERS_FAILURE,
  CONTAINER_SUCCESS,
  CONTAINERS_SUCCESS,
  ADD_CONTAINER,
  CONTAINER_LOGS_REQUEST,
  CONTAINER_LOGS_FAILURE,
  CONTAINER_LOGS_SUCCESS,
  CLOUD_HOSTS_REQUEST,
  CLOUD_HOST_REQUEST,
  CLOUD_HOSTS_FAILURE,
  CLOUD_HOST_FAILURE,
  CLOUD_HOSTS_SUCCESS,
  CLOUD_HOST_SUCCESS,
  ADD_CLOUD_HOST,
  CLOUD_HOST_RULES_REQUEST,
  CLOUD_HOST_RULES_FAILURE,
  CLOUD_HOST_RULES_SUCCESS,
  ADD_CLOUD_HOST_RULE,
  REMOVE_CLOUD_HOST_RULES,
  EDGE_HOSTS_REQUEST,
  EDGE_HOST_REQUEST,
  EDGE_HOSTS_FAILURE,
  EDGE_HOST_FAILURE,
  EDGE_HOSTS_SUCCESS,
  EDGE_HOST_SUCCESS,
  ADD_EDGE_HOST,
  EDGE_HOST_RULES_REQUEST,
  EDGE_HOST_RULES_FAILURE,
  EDGE_HOST_RULES_SUCCESS,
  ADD_EDGE_HOST_RULES,
  REMOVE_EDGE_HOST_RULES,
  NODES_REQUEST,
  NODE_REQUEST,
  NODES_FAILURE,
  NODE_FAILURE,
  NODES_SUCCESS,
  NODE_SUCCESS,
  ADD_NODE,
  RULES_HOST_REQUEST,
  RULE_HOST_REQUEST,
  RULES_HOST_FAILURE,
  RULE_HOST_FAILURE,
  RULES_HOST_SUCCESS,
  RULE_HOST_SUCCESS,
  ADD_RULE_HOST,
  RULE_HOST_CONDITIONS_REQUEST,
  RULE_HOST_CONDITIONS_FAILURE,
  RULE_HOST_CONDITIONS_SUCCESS,
  ADD_RULE_HOST_CONDITIONS,
  REMOVE_RULE_HOST_CONDITIONS,
  RULE_HOST_CLOUD_HOSTS_REQUEST,
  RULE_HOST_CLOUD_HOSTS_FAILURE,
  RULE_HOST_CLOUD_HOSTS_SUCCESS,
  ADD_RULE_HOST_CLOUD_HOSTS,
  REMOVE_RULE_HOST_CLOUD_HOSTS,
  RULE_HOST_EDGE_HOSTS_REQUEST,
  RULE_HOST_EDGE_HOSTS_FAILURE,
  RULE_HOST_EDGE_HOSTS_SUCCESS,
  ADD_RULE_HOST_EDGE_HOSTS,
  REMOVE_RULE_HOST_EDGE_HOSTS,
  RULES_SERVICE_REQUEST,
  RULE_SERVICE_REQUEST,
  RULES_SERVICE_FAILURE,
  RULE_SERVICE_FAILURE,
  RULES_SERVICE_SUCCESS,
  RULE_SERVICE_SUCCESS,
  ADD_RULE_SERVICE,
  RULE_SERVICE_CONDITIONS_REQUEST,
  RULE_SERVICE_CONDITIONS_FAILURE,
  RULE_SERVICE_CONDITIONS_SUCCESS,
  ADD_RULE_SERVICE_CONDITIONS,
  REMOVE_RULE_SERVICE_CONDITIONS,
  RULE_SERVICE_SERVICES_REQUEST,
  RULE_SERVICE_SERVICES_FAILURE,
  RULE_SERVICE_SERVICES_SUCCESS,
  ADD_RULE_SERVICE_SERVICES,
  REMOVE_RULE_SERVICE_SERVICES,
  RULES_CONTAINER_REQUEST,
  RULE_CONTAINER_REQUEST,
  RULES_CONTAINER_FAILURE,
  RULE_CONTAINER_FAILURE,
  RULES_CONTAINER_SUCCESS,
  RULE_CONTAINER_SUCCESS,
  ADD_RULE_CONTAINER,
  RULE_CONTAINER_CONDITIONS_REQUEST,
  RULE_CONTAINER_CONDITIONS_FAILURE,
  RULE_CONTAINER_CONDITIONS_SUCCESS,
  ADD_RULE_CONTAINER_CONDITIONS,
  REMOVE_RULE_CONTAINER_CONDITIONS,
  RULE_CONTAINER_CONTAINERS_REQUEST,
  RULE_CONTAINER_CONTAINERS_FAILURE,
  RULE_CONTAINER_CONTAINERS_SUCCESS,
  ADD_RULE_CONTAINER_CONTAINERS,
  REMOVE_RULE_CONTAINER_CONTAINERS,


  VALUE_MODES_REQUEST,
  VALUE_MODES_FAILURE,
  VALUE_MODES_SUCCESS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FIELDS_SUCCESS,
  OPERATORS_REQUEST,
  OPERATORS_FAILURE,
  OPERATORS_SUCCESS,
  CONDITION_REQUEST,
  CONDITIONS_REQUEST,
  CONDITION_FAILURE,
  CONDITIONS_FAILURE,
  CONDITION_SUCCESS,
  CONDITIONS_SUCCESS,
  ADD_CONDITION,
  DECISION_REQUEST,
  DECISIONS_REQUEST,
  DECISION_FAILURE,
  DECISIONS_FAILURE,
  DECISION_SUCCESS,
  DECISIONS_SUCCESS,
  SIMULATED_HOST_METRICS_REQUEST,
  SIMULATED_HOST_METRIC_REQUEST,
  SIMULATED_HOST_METRICS_FAILURE,
  SIMULATED_HOST_METRIC_FAILURE,
  SIMULATED_HOST_METRICS_SUCCESS,
  SIMULATED_HOST_METRIC_SUCCESS,
  ADD_SIMULATED_HOST_METRIC,
  SIMULATED_HOST_METRIC_CLOUD_HOSTS_REQUEST,
  SIMULATED_HOST_METRIC_CLOUD_HOSTS_FAILURE,
  SIMULATED_HOST_METRIC_CLOUD_HOSTS_SUCCESS,
  ADD_SIMULATED_HOST_METRIC_CLOUD_HOSTS,
  REMOVE_SIMULATED_HOST_METRIC_CLOUD_HOSTS,
  SIMULATED_HOST_METRIC_EDGE_HOSTS_REQUEST,
  SIMULATED_HOST_METRIC_EDGE_HOSTS_FAILURE,
  SIMULATED_HOST_METRIC_EDGE_HOSTS_SUCCESS,
  ADD_SIMULATED_HOST_METRIC_EDGE_HOSTS,
  REMOVE_SIMULATED_HOST_METRIC_EDGE_HOSTS,
  SIMULATED_SERVICE_METRICS_REQUEST,
  SIMULATED_SERVICE_METRIC_REQUEST,
  SIMULATED_SERVICE_METRICS_FAILURE,
  SIMULATED_SERVICE_METRIC_FAILURE,
  SIMULATED_SERVICE_METRICS_SUCCESS,
  SIMULATED_SERVICE_METRIC_SUCCESS,
  ADD_SIMULATED_SERVICE_METRIC,
  SIMULATED_SERVICE_METRIC_SERVICES_REQUEST,
  SIMULATED_SERVICE_METRIC_SERVICES_FAILURE,
  SIMULATED_SERVICE_METRIC_SERVICES_SUCCESS,
  ADD_SIMULATED_SERVICE_METRIC_SERVICES,
  REMOVE_SIMULATED_SERVICE_METRIC_SERVICES,
  REGIONS_REQUEST,
  REGION_REQUEST,
  REGIONS_FAILURE,
  REGION_FAILURE,
  REGIONS_SUCCESS,
  REGION_SUCCESS,
  ADD_REGION,
  LOAD_BALANCERS_REQUEST,
  LOAD_BALANCER_REQUEST,
  LOAD_BALANCERS_FAILURE,
  LOAD_BALANCER_FAILURE,
  LOAD_BALANCERS_SUCCESS,
  LOAD_BALANCER_SUCCESS,
  ADD_LOAD_BALANCER,
  EUREKA_SERVERS_REQUEST,
  EUREKA_SERVER_REQUEST,
  EUREKA_SERVERS_FAILURE,
  EUREKA_SERVER_FAILURE,
  EUREKA_SERVERS_SUCCESS,
  EUREKA_SERVER_SUCCESS,
  ADD_EUREKA_SERVER,
  LOGS_REQUEST,
  LOGS_FAILURE,
  LOGS_SUCCESS,
} from "../actions";
import {Schemas} from "../middleware/api";
import {normalize} from "normalizr";
import {merge, pick, keys } from 'lodash';
import {IApp} from "../routes/apps/App";
import {IAddAppService, IAppService} from "../routes/apps/AppServicesList";
import {IService} from "../routes/services/Service";
import {IDependent} from "../routes/services/ServiceDependentList";
import {IPrediction} from "../routes/services/ServicePredictionList";
import {IRuleService} from "../routes/rules/services/RuleService";
import {IContainer} from "../routes/containers/Container";
import {ICloudHost} from "../routes/hosts/cloud/CloudHost";
import {IEdgeHost} from "../routes/hosts/edge/EdgeHost";
import {INode} from "../routes/nodes/Node";
import {IRuleHost} from "../routes/rules/hosts/RuleHost";
import {IValueMode, IField, IOperator, IDecision} from "../routes/rules/Rule";
import {IRuleCondition} from "../routes/rules/conditions/RuleCondition";
import {ISimulatedHostMetric} from "../routes/metrics/hosts/SimulatedHostMetric";
import {ISimulatedServiceMetric} from "../routes/metrics/services/SimulatedServiceMetric";
import {IRegion} from "../routes/region/Region";
import {ILoadBalancer} from "../routes/loadBalancer/LoadBalancer";
import {IEurekaServer} from "../routes/eureka/EurekaServer";
import {ILogs} from "../routes/logs/Logs";
import {IRuleContainer} from "../routes/rules/containers/RuleContainer";

export type EntitiesState = {
  apps: {
    data: { [key: string]: IApp },
    isLoadingApps: boolean,
    loadAppsError: string | null,
    isLoadingServices: boolean,
    loadServicesError: string | null,
  },
  services: {
    data: { [key: string]: IService },
    isLoadingServices: boolean,
    loadServicesError: string | null,
    isLoadingApps: boolean,
    loadAppsError: string | null,
    isLoadingDependencies: boolean,
    loadDependenciesError: string | null,
    isLoadingDependents: boolean,
    loadDependentsError: string | null,
    isLoadingPredictions: boolean,
    loadPredictionsError: string | null,
    isLoadingRules: boolean,
    loadRulesError?: string | null,
  },
  containers: {
    data: { [key: string]: IContainer },
    isLoadingContainers: boolean,
    loadContainersError: string | null,
    isLoadingLogs: boolean,
    loadLogsError: string | null,
    isLoadingRules: boolean,
    loadRulesError: string | null,
  },
  hosts: {
    cloud: {
      data: { [key: string]: ICloudHost },
      isLoadingHosts: boolean,
      loadHostsError: string | null,
      isLoadingRules: false,
      loadRulesError: null,
    },
    edge: {
      data: { [key: string]: IEdgeHost },
      isLoadingHosts: boolean,
      loadHostsError: string | null,
      isLoadingRules: false,
      loadRulesError: null,
    }
  },
  nodes: {
    data: { [key: string]: INode },
    isLoadingNodes: boolean,
    loadNodesError: string | null,
  },
  rules: {
    hosts: {
      data: { [key: string]: IRuleHost },
      isLoadingRules: boolean,
      loadRulesError: string | null,
      isLoadingConditions: boolean,
      loadConditionsError: string | null,
      isLoadingCloudHosts: boolean,
      loadCloudHostsError: string | null,
      isLoadingEdgeHosts: boolean,
      loadEdgeHostsError: string | null,
    },
    services: {
      data: { [key: string]: IRuleService },
      isLoadingRules: boolean,
      loadRulesError: string | null,
      isLoadingConditions: boolean,
      loadConditionsError: string | null,
      isLoadingServices: boolean,
      loadServicesError: string | null,
    },
    containers: {
      data: { [key: string]: IRuleContainer },
      isLoadingRules: boolean,
      loadRulesError: string | null,
      isLoadingConditions: boolean,
      loadConditionsError: string | null,
      isLoadingContainers: boolean,
      loadContainersError: string | null,
    },
    conditions: {
      data: { [key: string]: IRuleCondition },
      isLoadingConditions: boolean,
      loadConditionsError: string | null,
    }
  }
  valueModes: {
    data: { [key: string]: IValueMode },
    isLoadingValueModes: boolean,
    loadValueModesError: string | null,
  },
  fields: {
    data: { [key: string]: IField },
    isLoadingFields: boolean,
    loadFieldsError: string | null,
  },
  operators: {
    data: { [key: string]: IOperator },
    isLoadingOperators: boolean,
    loadOperatorsError: string | null,
  }
  decisions: {
    data: { [key: string]: IDecision },
    isLoadingDecisions: boolean,
    loadDecisionsError: string | null,
  },
  simulatedMetrics: {
    hosts: {
      data: { [key: string]: ISimulatedHostMetric },
      isLoadingSimulatedHostMetrics: boolean,
      loadSimulatedHostMetricsError: string | null,
      isLoadingCloudHosts: boolean,
      loadCloudHostsError: string | null,
      isLoadingEdgeHosts: boolean,
      loadEdgeHostsError: string | null,
    },
    services: {
      data: { [key: string]: ISimulatedServiceMetric },
      isLoadingSimulatedServiceMetrics: boolean,
      loadSimulatedServiceMetricsError: string | null,
      isLoadingServices: boolean,
      loadServicesError: string | null,
    },
    /*containers: {
      data: { [key: string]: ISimulatedContainerMetric },
      isLoadingSimulatedContainerMetrics: boolean,
      loadSimulatedContainerMetricsError: string | null,
      isLoadingContainers: boolean,
      loadContainersError: string | null,
    }*/
  },
  regions: {
    data: { [key: string]: IRegion },
    isLoadingRegions: boolean,
    loadRegionsError: string | null,
  },
  loadBalancers: {
    data: { [key: string]: ILoadBalancer },
    isLoadingLoadBalancers: boolean,
    loadLoadBalancersError: string | null,
  },
  eurekaServers: {
    data: { [key: string]: IEurekaServer },
    isLoadingEurekaServers: boolean,
    loadEurekaServersError: string | null,
  },
  logs: {
    data: { [key: number]: ILogs },
    isLoadingLogs: boolean,
    loadLogsError: string | null,
  },
}

export type EntitiesAction = {
  type: string,
  entity?: number | string,
  isLoading?: {},
  error?: string,
  data?: {
    apps?: Partial<IApp>[],
    appsNames?: string[],
    appServices?: IAppService[],
    addAppServices?: IAddAppService[],
    services?: IService[],
    serviceNames?: string[]
    dependencies?: IService[],
    dependenciesNames?: string[],
    dependents?: IDependent[],
    predictions?: IPrediction[],
    predictionsNames?: string[],
    containers?: IContainer[],
    containerIds?: string[],
    cloudHosts?: ICloudHost[],
    cloudHostsId?: string[],
    edgeHosts?: IEdgeHost[],
    edgeHostsHostname?: string[],
    nodes?: INode[],
    hostRules?: IRuleHost[],
    serviceRules?: IRuleService[],
    containerRules?: IRuleContainer[],
    rulesNames?: string[],
    valueModes?: IValueMode[],
    fields?: IField[],
    operators?: IOperator[],
    conditions?: IRuleCondition[],
    conditionsNames?: string[],
    decisions?: IDecision[],
    simulatedHostMetrics?: ISimulatedHostMetric[],
    simulatedServiceMetrics?: ISimulatedServiceMetric[],
    regions?: IRegion[],
    loadBalancers?: ILoadBalancer[],
    eurekaServers?: ILoadBalancer[],
    logs?: ILogs[],
  },
};

const entities = (state: EntitiesState = {
                    apps: {
                      data: {},
                      isLoadingApps: false,
                      loadAppsError: null,
                      isLoadingServices: false,
                      loadServicesError: null,
                    },
                    services: {
                      data: {},
                      isLoadingServices: false,
                      loadServicesError: null,
                      isLoadingApps: false,
                      loadAppsError: null,
                      isLoadingDependencies: false,
                      loadDependenciesError: null,
                      isLoadingDependents: false,
                      loadDependentsError: null,
                      isLoadingPredictions: false,
                      loadPredictionsError: null,
                      isLoadingRules: false,
                      loadRulesError: null,
                    },
                    containers: {
                      data: {},
                      isLoadingContainers: false,
                      loadContainersError: null,
                      isLoadingLogs: false,
                      loadLogsError: null,
                      isLoadingRules: false,
                      loadRulesError: null,
                    },
                    hosts: {
                      cloud: {
                        data: {},
                        isLoadingHosts: false,
                        loadHostsError: null,
                        isLoadingRules: false,
                        loadRulesError: null,
                      },
                      edge: {
                        data: {},
                        isLoadingHosts: false,
                        loadHostsError: null,
                        isLoadingRules: false,
                        loadRulesError: null,
                      },
                    },
                    nodes: {
                      data: {},
                      isLoadingNodes: false,
                      loadNodesError: null
                    },
                    rules: {
                      hosts: {
                        data: {},
                        isLoadingRules: false,
                        loadRulesError: null,
                        isLoadingConditions: false,
                        loadConditionsError: null,
                        isLoadingCloudHosts: false,
                        loadCloudHostsError: null,
                        isLoadingEdgeHosts: false,
                        loadEdgeHostsError: null,
                      },
                      services: {
                        data: {},
                        isLoadingRules: false,
                        loadRulesError: null,
                        isLoadingConditions: false,
                        loadConditionsError: null,
                        isLoadingServices: false,
                        loadServicesError: null,
                      },
                      containers: {
                        data: {},
                        isLoadingRules: false,
                        loadRulesError: null,
                        isLoadingConditions: false,
                        loadConditionsError: null,
                        isLoadingContainers: false,
                        loadContainersError: null,
                      },
                      conditions: {
                        data: {},
                        isLoadingConditions: false,
                        loadConditionsError: null
                      },
                    },
                    valueModes: {
                      data: {},
                      isLoadingValueModes: false,
                      loadValueModesError: null
                    },
                    fields: {
                      data: {},
                      isLoadingFields: false,
                      loadFieldsError: null
                    },
                    operators: {
                      data: {},
                      isLoadingOperators: false,
                      loadOperatorsError: null
                    },
                    decisions: {
                      data: {},
                      isLoadingDecisions: false,
                      loadDecisionsError: null
                    },
                    simulatedMetrics: {
                      hosts: {
                        data: {},
                        isLoadingSimulatedHostMetrics: false,
                        loadSimulatedHostMetricsError: null,
                        isLoadingCloudHosts: false,
                        loadCloudHostsError: null,
                        isLoadingEdgeHosts: false,
                        loadEdgeHostsError: null,
                      },
                      services: {
                        data: {},
                        isLoadingSimulatedServiceMetrics: false,
                        loadSimulatedServiceMetricsError: null,
                        isLoadingServices: false,
                        loadServicesError: null,
                      },
                      /*containers: {
                        data: {},
                        isLoadingSimulatedContainerMetrics: false,
                        loadSimulatedContainerMetricsError: null,
                        isLoadingContainers: false,
                        loadContainersError: null,
                      },*/
                    },
                    regions: {
                      data: {},
                      isLoadingRegions: false,
                      loadRegionsError: null
                    },
                    loadBalancers: {
                      data: {},
                      isLoadingLoadBalancers: false,
                      loadLoadBalancersError: null
                    },
                    eurekaServers: {
                      data: {},
                      isLoadingEurekaServers: false,
                      loadEurekaServersError: null
                    },
                    logs: {
                      data: {},
                      isLoadingLogs: false,
                      loadLogsError: null
                    },
                  },
                  action: EntitiesAction
): EntitiesState => {
  const { type, error, entity, data } = action;
  switch (type) {
    case APPS_REQUEST:
    case APP_REQUEST:
      return merge({}, state, { apps: { isLoadingApps: true, loadAppsError: null } });
    case APP_FAILURE:
    case APPS_FAILURE:
      return merge({}, state, { apps: { isLoadingApps: false, loadAppsError: error } });
    case APPS_SUCCESS:
      return {
        ...state,
        apps: {
          ...state.apps,
          data: merge({}, pick(state.apps.data, keys(data?.apps)), data?.apps),
          isLoadingApps: false,
          loadAppsError: null,
        }
      };
    case APP_SUCCESS:
      return {
        ...state,
        apps: {
          ...state.apps,
          data: merge({}, state.apps.data, data?.apps),
          isLoadingApps: false,
          loadAppsError: null,
        }
      };
    case ADD_APP:
      if (data?.apps?.length) {
        const apps = normalize(data?.apps, Schemas.APP_ARRAY).entities.apps;
        return merge({}, state, { apps: { data: apps } });
      }
      break;
    case UPDATE_APP:
      if (data?.apps && data.apps?.length > 1) {
        const previousApp = data.apps[0];
        const currentApp = data.apps[1];
        console.log(previousApp);
        console.log(currentApp);
      }
      break;
    case APP_SERVICES_REQUEST:
      return merge({}, state, { apps: { isLoadingServices: true, loadServicesError: null } });
    case APP_SERVICES_SUCCESS:
      const app = entity && state.apps.data[entity];
      const services = { services: data?.services || [] };
      const appWithServices = Object.assign(app ? app : [entity], services);
      const normalizedApp = normalize(appWithServices, Schemas.APP).entities.apps;
      return merge({}, state, {
        apps: {
          data: normalizedApp,
          isLoadingServices: false,
          loadServicesError: null
        }
      });
    case APP_SERVICES_FAILURE:
      return merge({}, state, { apps: { isLoadingServices: false, loadServicesError: error } });
    case ADD_APP_SERVICES:
      if (entity) {
        const app = state.apps.data[entity];
        if (data?.addAppServices?.length) {
          const addAppService = data?.addAppServices[0];
          const serviceName = addAppService.service;
          const service = state.services.data[serviceName];
          const launchOrder = addAppService.launchOrder;
          const appService = { id: 0, service, launchOrder };
          if (service) {
            app.services = { ...app.services, [serviceName]: appService };
            return merge({}, state, { apps: { data: { [app.name]: {...app } } } });
          }
        }
      }
      break;
    case REMOVE_APP_SERVICES:
      if (entity) {
        const app = state.apps.data[entity];
        const filteredServices = (app.services &&
                                  Object.values(app.services)
                                        .filter(appService => !data?.serviceNames?.includes(appService.service.serviceName))) || [];
        const normalizedServices = normalize(filteredServices, Schemas.APP_SERVICE_ARRAY).entities;
        const appWithServices = Object.assign(app, !Object.keys(normalizedServices).length ? { services: {} } : normalizedServices);
        const normalizedApp = normalize(appWithServices, Schemas.APP).entities;
        return merge({}, state, {
          apps: {
            ...state.apps,
            data: normalizedApp.apps,
          }
        });
      }
      break;
    case SERVICES_REQUEST:
    case SERVICE_REQUEST:
      return merge({}, state, { services: { isLoadingServices: true, loadServicesError: null } });
    case SERVICE_FAILURE:
    case SERVICES_FAILURE:
      return merge({}, state, { services: { isLoadingServices: false, loadServicesError: error } });
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
          isLoadingDependents: state.services.isLoadingDependents,
          loadDependentsError: state.services.loadDependentsError,
          isLoadingPredictions: state.services.isLoadingPredictions,
          loadPredictionsError: state.services.loadPredictionsError,
          isLoadingRules: state.services.isLoadingRules,
          loadRulesError: state.services.loadRulesError,
        }
      };
    case ADD_SERVICE:
      if (data?.services?.length) {
        const services = normalize(data?.services, Schemas.SERVICE_ARRAY).entities.services;
        return merge({}, state, { services: { data: services } });
      }
      break;
    case SERVICE_APPS_REQUEST:
      return merge({}, state, { services: { isLoadingApps: true, loadAppsError: null } });
    case SERVICE_APPS_FAILURE:
      return merge({}, state, { services: { isLoadingApps: false, loadAppsError: error } });
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
    case ADD_SERVICE_APPS:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.appsNames?.length) {
          if (service.apps) {
            service.apps.unshift(...data.appsNames);
          }
          else {
           service.apps = data.appsNames;
          }
          return merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case REMOVE_SERVICE_APPS:
      if (entity) {
        const service = state.services.data[entity];
        const filteredApps = service.apps?.filter(app => !data?.appsNames?.includes(app));
        const serviceWithApps = Object.assign(service, { apps: filteredApps });
        const normalizeService = normalize(serviceWithApps, Schemas.SERVICE).entities;
        return merge({}, state, {
          services: {
            ...state.services,
            data: normalizeService.services,
          }
        });
      }
      break;
    case SERVICE_DEPENDENCIES_REQUEST:
      return merge({}, state, { services: { isLoadingDependencies: true, loadDependenciesError: null } });
    case SERVICE_DEPENDENCIES_FAILURE:
      return merge({}, state, { services: { isLoadingDependencies: false, loadDependenciesError: error } });
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
    case ADD_SERVICE_DEPENDENCIES:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.dependenciesNames?.length) {
          if (service.dependencies) {
            service.dependencies.unshift(...data.dependenciesNames);
          }
          else {
            service.dependencies = data.dependenciesNames;
          }
          return merge({}, state, { services: { data: { [service.serviceName]: {...service } } } });
        }
      }
      break;
    case REMOVE_SERVICE_DEPENDENCIES:
      if (entity) {
        const service = state.services.data[entity];
        const filteredDependencies = service.dependencies?.filter(dependency => !data?.dependenciesNames?.includes(dependency));
        const serviceWithDependencies = Object.assign(service, { dependencies: filteredDependencies });
        const normalizeService = normalize(serviceWithDependencies, Schemas.SERVICE).entities;
        return merge({}, state, {
          services: {
            ...state.services,
            data: normalizeService.services,
          }
        });
      }
      break;
    case SERVICE_DEPENDENTS_REQUEST:
      return merge({}, state, { services: { isLoadingDependents: true, loadDependentsError: null } });
    case SERVICE_DEPENDENTS_FAILURE:
      return merge({}, state, { services: { isLoadingDependents: false, loadDependentsError: error } });
    case SERVICE_DEPENDENTS_SUCCESS: {
      const service = entity && state.services.data[entity];
      const dependents = { dependents: data?.dependents || [] };
      const serviceWithDependents = Object.assign(service ? service : [entity], dependents);
      const normalizedService = normalize(serviceWithDependents, Schemas.SERVICE).entities;
      return merge({}, state, {
        services: {
          data: normalizedService.services,
          isLoadingDependents: false,
          loadDependentsError: null
        }
      });
    }
    case SERVICE_PREDICTIONS_REQUEST:
      return merge({}, state, { services: { isLoadingPredictions: true, loadPredictionsError: null } });
    case SERVICE_PREDICTIONS_FAILURE:
      return merge({}, state, { services: { isLoadingPredictions: false, loadPredictionsError: error } });
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
    case ADD_SERVICE_PREDICTIONS:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.predictions?.length) {
          const newPredictions = data?.predictions.map(prediction => ({[prediction.name]: { id: 0, ...prediction }}));
          service.predictions = merge({}, service.predictions, newPredictions);
          return merge({}, state, { services: { data: { [service.serviceName]: { ...service } } } });
        }
      }
      break;
    case REMOVE_SERVICE_PREDICTIONS:
      if (entity) {
        const service = state.services.data[entity];
        const filteredPredictions = Object.values(service.predictions || {})
                                          .filter(prediction => !data?.predictionsNames?.includes(prediction.name));
        const normalizedPredictions = normalize(filteredPredictions, Schemas.SERVICE_PREDICTION_ARRAY).entities;
        const serviceWithPredictions = Object.assign(service, !Object.keys(normalizedPredictions).length ? { predictions: {} } : normalizedPredictions);
        const normalizeService = normalize(serviceWithPredictions, Schemas.SERVICE).entities;
        return merge({}, state, {
          services: {
            ...state.services,
            data: normalizeService.services,
          }
        });
      }
      break;
    case SERVICE_RULES_REQUEST:
      return merge({}, state, { services: { isLoadingRules: true, loadRulesError: null } });
    case SERVICE_RULES_FAILURE:
      return merge({}, state, { services: { isLoadingRules: false, loadRulesError: error } });
    case SERVICE_RULES_SUCCESS: {
      const service = entity && state.services.data[entity];
      const rules = { serviceRules: data?.serviceRules || [] };
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
    case ADD_SERVICE_RULES:
      if (entity) {
        const service = state.services.data[entity];
        if (data?.rulesNames?.length) {
          if (service.serviceRules) {
            service.serviceRules.unshift(...data.rulesNames);
          }
          else {
            service.serviceRules = data.rulesNames;
          }
          return merge({}, state, { services: { data: { [service.serviceName]: { ...service } } } });
        }
      }
      break;
    case REMOVE_SERVICE_RULES:
      if (entity) {
        const service = state.services.data[entity];
        const filteredRules = service.serviceRules?.filter(rule => !data?.rulesNames?.includes(rule));
        const serviceWithRules = Object.assign(service, { rules: filteredRules });
        const normalizeService = normalize(serviceWithRules, Schemas.SERVICE).entities;
        return merge({}, state, {
          services: {
            ...state.services,
            data: normalizeService.services,
          }
        });
      }
      break;
    case CONTAINERS_REQUEST:
    case CONTAINER_REQUEST:
      return merge({}, state, { containers: { isLoadingContainers: true, loadContainersError: null } });
    case CONTAINERS_FAILURE:
    case CONTAINER_FAILURE:
      return merge({}, state, { containers: { isLoadingContainers: false, loadContainersError: error } });
    case CONTAINERS_SUCCESS:
      return {
        ...state,
        containers: {
          ...state.containers,
          data: merge({}, pick(state.containers.data, keys(data?.containers)), data?.containers),
          isLoadingContainers: false,
          loadContainersError: null,
        }
      };
    case CONTAINER_SUCCESS:
      return {
        ...state,
        containers: {
          ...state.containers,
          data: merge({}, state.containers.data, data?.containers),
          isLoadingContainers: false,
          loadContainersError: null,
        }
      };
    case ADD_CONTAINER:
      if (data?.containers?.length) {
        const containers = normalize(data?.containers, Schemas.CONTAINER_ARRAY).entities.containers;
        return merge({}, state, { containers: { data: containers } });
      }
      break;
    case CONTAINER_LOGS_REQUEST:
      return merge({}, state, { containers: { isLoadingLogs: true, loadLogsError: null } });
    case CONTAINER_LOGS_FAILURE:
      return merge({}, state, { containers: { isLoadingLogs: false, loadLogsError: error } });
    case CONTAINER_LOGS_SUCCESS:
      const container = entity && state.containers.data[entity];
      const logs = { logs: data || "" };
      const containerWithLogs = Object.assign(container ? container : [entity], logs);
      const normalizedContainer = normalize(containerWithLogs, Schemas.CONTAINER).entities;
      return merge({}, state, {
        containers : {
          ...state.containers,
          data: normalizedContainer.containers,
          isLoadingLogs: false,
          loadLogsError: null,
        },
      });
    case CLOUD_HOSTS_REQUEST:
    case CLOUD_HOST_REQUEST:
      return merge({}, state, { hosts: { cloud: { isLoadingHosts: true, loadHostsError: null } } });
    case CLOUD_HOSTS_FAILURE:
    case CLOUD_HOST_FAILURE:
      return merge({}, state, { hosts: { cloud: { isLoadingHosts: false, loadHostsError: error } } });
    case CLOUD_HOSTS_SUCCESS:
      return {
        ...state,
        hosts: {
          ...state.hosts,
          cloud: {
            ...state.hosts.cloud,
            data: merge({}, pick(state.hosts.cloud.data, keys(data?.cloudHosts)), data?.cloudHosts),
            isLoadingHosts: false,
            loadHostsError: null,
          }
        }
      };
    case CLOUD_HOST_SUCCESS:
      return {
        ...state,
        hosts: {
          ...state.hosts,
          cloud: {
            ...state.hosts.cloud,
            data: merge({}, state.hosts.cloud.data, data?.cloudHosts),
            isLoadingHosts: false,
            loadHostsError: null,
          }
        }
      };
    case ADD_CLOUD_HOST:
      if (data?.cloudHosts?.length) {
        const cloudHosts = normalize(data?.cloudHosts, Schemas.CLOUD_HOST_ARRAY).entities.cloudHosts;
        return merge({}, state, { hosts: { cloud: { data: cloudHosts } } });
      }
      break;
    case CLOUD_HOST_RULES_REQUEST:
      return merge({}, state, { hosts: { cloud: { isLoadingRules: true, loadRulesError: null } } });
    case CLOUD_HOST_RULES_FAILURE:
      return merge({}, state, { hosts: { cloud: { isLoadingRules: false, loadRulesError: error } } });
    case CLOUD_HOST_RULES_SUCCESS: {
      const cloudHost = entity && state.hosts.cloud.data[entity];
      const rules = { hostRules: data?.hostRules || [] };
      const hostWithRules = Object.assign(cloudHost ? cloudHost : [entity], rules);
      const normalizedCloudHost = normalize(hostWithRules, Schemas.CLOUD_HOST).entities.cloudHosts;
      return {
        ...state,
        hosts: {
          ...state.hosts,
          cloud: {
            ...state.hosts.cloud,
            data: merge({}, state.hosts.cloud.data, normalizedCloudHost),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      }
    }
    case ADD_CLOUD_HOST_RULE:
      if (entity && data?.rulesNames?.length) {
        const cloudHost = state.hosts.cloud.data[entity];
        if (cloudHost) {
          if (cloudHost.hostRules) {
            cloudHost.hostRules.unshift(...data.rulesNames);
          }
          else {
            cloudHost.hostRules = data.rulesNames;
          }
          const normalizedCloudHost = normalize(cloudHost, Schemas.CLOUD_HOST).entities.cloudHosts;
          return merge({}, state, { hosts: { cloud: { data: { ...normalizedCloudHost } } } });
        }
        return state;
      }
      break;
    case REMOVE_CLOUD_HOST_RULES:
      if (entity) {
        const cloudHost = state.hosts.cloud.data[entity];
        const filteredRules = cloudHost.hostRules?.filter(rule => !data?.rulesNames?.includes(rule));
        const cloudHostWithRules = Object.assign(cloudHost, { hostRules: filteredRules });
        const normalizedCloudHost = normalize(cloudHostWithRules, Schemas.CLOUD_HOST).entities.cloudHosts;
        return merge({}, state, { hosts: { cloud: { data: { ...normalizedCloudHost } } } });
      }
      break;
    case EDGE_HOSTS_REQUEST:
    case EDGE_HOST_REQUEST:
      return merge({}, state, { hosts: { edge: { isLoadingHosts: true, loadHostsError: null } } });
    case EDGE_HOSTS_FAILURE:
    case EDGE_HOST_FAILURE:
      return merge({}, state, { hosts: { edge: { isLoadingHosts: false, loadHostsError: error } } });
    case EDGE_HOSTS_SUCCESS:
      return {
        ...state,
        hosts: {
          ...state.hosts,
          edge: {
            ...state.hosts.edge,
            data: merge({}, pick(state.hosts.edge.data, keys(data?.edgeHosts)), data?.edgeHosts),
            isLoadingHosts: false,
            loadHostsError: null,
          }
        }
      };
    case EDGE_HOST_SUCCESS:
      return {
        ...state,
        hosts: {
          ...state.hosts,
          edge: {
            ...state.hosts.edge,
            data: merge({}, state.hosts.edge.data, data?.edgeHosts),
            isLoadingHosts: false,
            loadHostsError: null,
          }
        }
      };
    case ADD_EDGE_HOST:
      if (data?.edgeHosts?.length) {
        const edgeHosts = normalize(data?.edgeHosts, Schemas.EDGE_HOST_ARRAY).entities.edgeHosts;
        return merge({}, state, { hosts: { edge: { data: edgeHosts } } });
      }
      break;
    case EDGE_HOST_RULES_REQUEST:
      return merge({}, state, { hosts: { edge: { isLoadingRules: true, loadRulesError: null } } });
    case EDGE_HOST_RULES_FAILURE:
      return merge({}, state, { hosts: { edge: { isLoadingRules: false, loadRulesError: error } } });
    case EDGE_HOST_RULES_SUCCESS: {
      const host = entity && state.hosts.edge.data[entity];
      const rules = { hostRules: data?.hostRules || [] };
      const hostWithRules = Object.assign(host ? host : [entity], rules);
      const normalizedHost = normalize(hostWithRules, Schemas.EDGE_HOST).entities;
      return {
        ...state,
        hosts: {
          ...state.hosts,
          edge: {
            ...state.hosts.edge,
            data: normalizedHost.edgeHosts || {},
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    }
    case ADD_EDGE_HOST_RULES:
      if (entity && data?.rulesNames?.length) {
        const edgeHost = state.hosts.edge.data[entity];
        if (edgeHost) {
          if (edgeHost.hostRules) {
            edgeHost.hostRules.unshift(...data.rulesNames);
          }
          else {
            edgeHost.hostRules = data.rulesNames;
          }
          const normalizedEdgeHost = normalize(edgeHost, Schemas.EDGE_HOST).entities.edgeHosts;
          return merge({}, state, { hosts: { edge: { data: { ...normalizedEdgeHost } } } });
        }
        return state;
      }
      break;
    case REMOVE_EDGE_HOST_RULES:
      if (entity) {
        const edgeHost = state.hosts.edge.data[entity];
        const filteredRules = edgeHost.hostRules?.filter(rule => !data?.rulesNames?.includes(rule));
        const edgeHostWithRules = Object.assign(edgeHost, { hostRules: filteredRules });
        const normalizedEdgeHost = normalize(edgeHostWithRules, Schemas.EDGE_HOST).entities.edgeHosts;
        return merge({}, state, { hosts: { edge: { data: { ...normalizedEdgeHost } } } });
      }
      break;
    case NODES_REQUEST:
    case NODE_REQUEST:
      return merge({}, state, { nodes: { isLoadingNodes: true, loadNodesError: null } });
    case NODES_FAILURE:
    case NODE_FAILURE:
      return merge({}, state, { nodes: { isLoadingNodes: false, loadNodesError: error } });
    case NODES_SUCCESS:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          data: merge({}, pick(state.nodes.data, keys(data?.nodes)), data?.nodes),
          isLoadingNodes: false,
          loadNodesError: null,
        }
      };
    case NODE_SUCCESS:
      return {
        ...state,
        nodes: {
          data: merge({}, state.nodes.data, data?.nodes),
          isLoadingNodes: false,
          loadNodesError: null,
        }
      };
    case ADD_NODE:
      if (data?.nodes?.length) {
        const nodes = normalize(data?.nodes, Schemas.NODE_ARRAY).entities.nodes;
        return merge({}, state, { nodes: { data: nodes } });
      }
      break;
    case RULES_HOST_REQUEST:
    case RULE_HOST_REQUEST:
      return merge({}, state, { rules: { hosts: { isLoadingRules: true, loadRulesError: null } } });
    case RULES_HOST_FAILURE:
    case RULE_HOST_FAILURE:
      return merge({}, state, { rules: { hosts: { isLoadingRules: false, loadRulesError: error } } });
    case RULES_HOST_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          hosts: {
            ...state.rules.hosts,
            data: merge({}, pick(state.rules.hosts.data, keys(data?.hostRules)), data?.hostRules),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    case RULE_HOST_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          hosts: {
            ...state.rules.hosts,
            data: merge({}, state.rules.hosts.data, data?.hostRules),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    case ADD_RULE_HOST:
      if (data?.hostRules?.length) {
        const hostRules = normalize(data?.hostRules, Schemas.RULE_HOST_ARRAY).entities.hostRules;
        return merge({}, state, { rules: { hosts : { data: hostRules } } });
      }
      break;
    case RULE_HOST_CONDITIONS_REQUEST:
      return merge({}, state, { rules: { hosts: { isLoadingConditions: true, loadConditionsError: null } } });
    case RULE_HOST_CONDITIONS_FAILURE:
      return merge({}, state, { rules: { hosts: { isLoadingConditions: false, loadConditionsError: error } } });
    case RULE_HOST_CONDITIONS_SUCCESS: {
      const rule = entity && state.rules.hosts.data[entity];
      const conditions = { conditions: data?.conditions || [] };
      const ruleWithConditions = Object.assign(rule ? rule : [entity], conditions);
      const normalizedRule = normalize(ruleWithConditions, Schemas.RULE_HOST).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          hosts : {
            ...state.rules.hosts,
            data: normalizedRule.hostRules,
            isLoadingConditions: false,
            loadConditionsError: null,
          },
        }
      });
    }
    case ADD_RULE_HOST_CONDITIONS:
      if (entity && data?.conditionsNames?.length) {
        const rule = state.rules.hosts.data[entity];
        if (rule) {
          if (rule.conditions) {
            rule.conditions.unshift(...data.conditionsNames);
          }
          else {
            rule.conditions = data.conditionsNames;
          }
          return merge({}, state, { rules: { hosts: { data: { [rule.name]: { ...rule } } } } });
        }
        return state;
      }
      break;
    case REMOVE_RULE_HOST_CONDITIONS:
      if (entity) {
        const rule = state.rules.hosts.data[entity];
        const filteredConditions = rule.conditions?.filter(condition => !data?.conditionsNames?.includes(condition));
        const ruleWithConditions = Object.assign(rule, { conditions: filteredConditions });
        const normalizeRule = normalize(ruleWithConditions, Schemas.RULE_HOST).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            hosts: {
              ...state.rules.hosts,
              data: normalizeRule.hostRules,
            }
          }
        });
      }
      break;
    case RULE_HOST_CLOUD_HOSTS_REQUEST:
      return merge({}, state, { rules: { hosts: { isLoadingCloudHosts: true, loadCloudHostsError: null } } });
    case RULE_HOST_CLOUD_HOSTS_FAILURE:
      return merge({}, state, { rules: { hosts: { isLoadingCloudHosts: false, loadCloudHostsError: error } } });
    case RULE_HOST_CLOUD_HOSTS_SUCCESS: {
      const rule = entity && state.rules.hosts.data[entity];
      const cloudHosts = { cloudHosts: data?.cloudHosts || [] };
      const ruleWithCloudHosts = Object.assign(rule ? rule : [entity], cloudHosts);
      const normalizedRule = normalize(ruleWithCloudHosts, Schemas.RULE_HOST).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          hosts : {
            ...state.rules.hosts,
            data: normalizedRule.hostRules,
            isLoadingCloudHosts: false,
            loadCloudHostsError: null,
          },
        }
      });
    }
    case ADD_RULE_HOST_CLOUD_HOSTS:
      if (entity && data?.cloudHostsId?.length) {
        const rule = state.rules.hosts.data[entity];
        if (rule) {
          if (rule.cloudHosts) {
            rule.cloudHosts.unshift(...data.cloudHostsId);
          }
          else {
            rule.cloudHosts = data.cloudHostsId;
          }
          return merge({}, state, { rules: { hosts: { data: { [rule.name]: { ...rule } } } } });
        }
        return state;
      }
      break;
    case REMOVE_RULE_HOST_CLOUD_HOSTS:
      if (entity) {
        const rule = state.rules.hosts.data[entity];
        const filteredCloudHosts = rule.cloudHosts?.filter(cloudHost => !data?.cloudHostsId?.includes(cloudHost));
        const ruleWithCloudHosts = Object.assign(rule, { cloudHosts: filteredCloudHosts });
        const normalizeRule = normalize(ruleWithCloudHosts, Schemas.RULE_HOST).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            hosts: {
              ...state.rules.hosts,
              data: normalizeRule.hostRules,
            }
          }
        });
      }
      break;
    case RULE_HOST_EDGE_HOSTS_REQUEST:
      return merge({}, state, { rules: { hosts: { isLoadingEdgeHosts: true, loadEdgeHostsError: null } } });
    case RULE_HOST_EDGE_HOSTS_FAILURE:
      return merge({}, state, { rules: { hosts: { isLoadingEdgeHosts: false, loadEdgeHostsError: error } } });
    case RULE_HOST_EDGE_HOSTS_SUCCESS: {
      const rule = entity && state.rules.hosts.data[entity];
      const edgeHosts = { edgeHosts: data?.edgeHosts || [] };
      const ruleWithEdgeHosts = Object.assign(rule ? rule : [entity], edgeHosts);
      const normalizedRule = normalize(ruleWithEdgeHosts, Schemas.RULE_HOST).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          hosts : {
            ...state.rules.hosts,
            data: normalizedRule.hostRules,
            isLoadingEdgeHosts: false,
            loadEdgeHostsError: null,
          },
        }
      });
    }
    case ADD_RULE_HOST_EDGE_HOSTS:
      if (entity && data?.edgeHostsHostname?.length) {
        const rule = state.rules.hosts.data[entity];
        if (rule) {
          if (rule.edgeHosts) {
            rule.edgeHosts.unshift(...data.edgeHostsHostname);
          }
          else {
            rule.edgeHosts = data.edgeHostsHostname;
          }
          return merge({}, state, { rules: { hosts: { data: { [rule.name]: { ...rule } } } } });
        }
        return state;
      }
      break;
    case REMOVE_RULE_HOST_EDGE_HOSTS:
      if (entity) {
        const rule = state.rules.hosts.data[entity];
        const filteredEdgeHosts = rule.edgeHosts?.filter(edgeHost => !data?.edgeHostsHostname?.includes(edgeHost));
        const ruleWithEdgeHosts = Object.assign(rule, { edgeHosts: filteredEdgeHosts });
        const normalizeRule = normalize(ruleWithEdgeHosts, Schemas.RULE_HOST).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            hosts: {
              ...state.rules.hosts,
              data: normalizeRule.hostRules,
            }
          }
        });
      }
      break;
    case RULES_SERVICE_REQUEST:
    case RULE_SERVICE_REQUEST:
      return merge({}, state, { rules: { services: { isLoadingRules: true, loadRulesError: null } } });
    case RULES_SERVICE_FAILURE:
    case RULE_SERVICE_FAILURE:
      return merge({}, state, { rules: { services: { isLoadingRules: false, loadRulesError: error } } });
    case RULES_SERVICE_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          services: {
            ...state.rules.services,
            data: merge({}, pick(state.rules.services.data, keys(data?.serviceRules)), data?.serviceRules),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    case RULE_SERVICE_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          services: {
            ...state.rules.services,
            data: merge({}, state.rules.services.data, data?.serviceRules),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    case ADD_RULE_SERVICE:
      if (data?.serviceRules?.length) {
        const serviceRules = normalize(data?.serviceRules, Schemas.RULE_SERVICE_ARRAY).entities.serviceRules;
        return merge({}, state, { rules: { services : { data: serviceRules } } });
      }
      break;
    case RULE_SERVICE_CONDITIONS_REQUEST:
      return merge({}, state, { rules: { services: { isLoadingConditions: true, loadConditionsError: null } } });
    case RULE_SERVICE_CONDITIONS_FAILURE:
      return merge({}, state, { rules: { services: { isLoadingConditions: false, loadConditionsError: error } } });
    case RULE_SERVICE_CONDITIONS_SUCCESS: {
      const rule = entity && state.rules.services.data[entity];
      const conditions = { conditions: data?.conditions || [] };
      const ruleWithConditions = Object.assign(rule ? rule : [entity], conditions);
      const normalizedRule = normalize(ruleWithConditions, Schemas.RULE_SERVICE).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          services : {
            ...state.rules.services,
            data: normalizedRule.serviceRules,
            isLoadingConditions: false,
            loadConditionsError: null,
          }
        }
      });
    }
    case ADD_RULE_SERVICE_CONDITIONS:
      if (entity && data?.conditionsNames?.length) {
        const rule = state.rules.services.data[entity];
        if (rule) {
          if (rule.conditions) {
            rule.conditions.unshift(...data.conditionsNames);
          }
          else {
            rule.conditions = data.conditionsNames;
          }
          return merge({}, state, { rules: { services: { data: { [rule.name]: {...rule } } } } });
        }
      }
      break;
    case REMOVE_RULE_SERVICE_CONDITIONS:
      if (entity) {
        const rule = state.rules.services.data[entity];
        const filteredConditions = rule.conditions?.filter(condition => !data?.conditionsNames?.includes(condition));
        const ruleWithConditions = Object.assign(rule, { conditions: filteredConditions });
        const normalizeRule = normalize(ruleWithConditions, Schemas.RULE_SERVICE).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            services: {
              ...state.rules.services,
              data: normalizeRule.serviceRules,
            }
          }
        });
      }
      return state;
    case RULE_SERVICE_SERVICES_REQUEST:
      return merge({}, state, { rules: { services: { isLoadingServices: true, loadServicesError: null } } });
    case RULE_SERVICE_SERVICES_FAILURE:
      return merge({}, state, { rules: { services: { isLoadingServices: false, loadServicesError: error } } });
    case RULE_SERVICE_SERVICES_SUCCESS: {
      const rule = entity && state.rules.services.data[entity];
      const services = { services: data?.services || [] };
      const ruleWithServices = Object.assign(rule ? rule : [entity], services);
      const normalizedRule = normalize(ruleWithServices, Schemas.RULE_SERVICE).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          services : {
            ...state.rules.services,
            data: normalizedRule.serviceRules,
            isLoadingServices: false,
            loadServicesError: null,
          },
        }
      });
    }
    case ADD_RULE_SERVICE_SERVICES:
      if (entity && data?.serviceNames?.length) {
        const rule = state.rules.services.data[entity];
        if (rule) {
          if (rule.services) {
            rule.services.unshift(...data.serviceNames);
          }
          else {
            rule.services = data.serviceNames;
          }
          return merge({}, state, { rules: { services: { data: { [rule.name]: { ...rule } } } } });
        }
        return state;
      }
      break;
    case REMOVE_RULE_SERVICE_SERVICES:
      if (entity) {
        const rule = state.rules.services.data[entity];
        const filteredServices = rule.services?.filter(service => !data?.serviceNames?.includes(service));
        const ruleWithServices = Object.assign(rule, { services: filteredServices });
        const normalizeRule = normalize(ruleWithServices, Schemas.RULE_SERVICE).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            services: {
              ...state.rules.services,
              data: normalizeRule.serviceRules,
            }
          }
        });
      }
      break;
    case RULES_CONTAINER_REQUEST:
    case RULE_CONTAINER_REQUEST:
      return merge({}, state, { rules: { containers: { isLoadingRules: true, loadRulesError: null } } });
    case RULES_CONTAINER_FAILURE:
    case RULE_CONTAINER_FAILURE:
      return merge({}, state, { rules: { containers: { isLoadingRules: false, loadRulesError: error } } });
    case RULES_CONTAINER_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          containers: {
            ...state.rules.containers,
            data: merge({}, pick(state.rules.containers.data, keys(data?.containerRules)), data?.containerRules),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    case RULE_CONTAINER_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          containers: {
            ...state.rules.containers,
            data: merge({}, state.rules.containers.data, data?.containerRules),
            isLoadingRules: false,
            loadRulesError: null,
          }
        }
      };
    case ADD_RULE_CONTAINER:
      if (data?.containerRules?.length) {
        const containerRules = normalize(data?.containerRules, Schemas.RULE_CONTAINER_ARRAY).entities.containerRules;
        return merge({}, state, { rules: { containers : { data: containerRules } } });
      }
      break;
    case RULE_CONTAINER_CONDITIONS_REQUEST:
      return merge({}, state, { rules: { containers: { isLoadingConditions: true, loadConditionsError: null } } });
    case RULE_CONTAINER_CONDITIONS_FAILURE:
      return merge({}, state, { rules: { containers: { isLoadingConditions: false, loadConditionsError: error } } });
    case RULE_CONTAINER_CONDITIONS_SUCCESS: {
      const rule = entity && state.rules.containers.data[entity];
      const conditions = { conditions: data?.conditions || [] };
      const ruleWithConditions = Object.assign(rule ? rule : [entity], conditions);
      const normalizedRule = normalize(ruleWithConditions, Schemas.RULE_CONTAINER).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          containers : {
            ...state.rules.containers,
            data: normalizedRule.containerRules,
            isLoadingConditions: false,
            loadConditionsError: null,
          }
        }
      });
    }
    case ADD_RULE_CONTAINER_CONDITIONS:
      if (entity && data?.conditionsNames?.length) {
        const rule = state.rules.containers.data[entity];
        if (rule) {
          if (rule.conditions) {
            rule.conditions.unshift(...data.conditionsNames);
          }
          else {
            rule.conditions = data.conditionsNames;
          }
          return merge({}, state, { rules: { containers: { data: { [rule.name]: {...rule } } } } });
        }
      }
      break;
    case REMOVE_RULE_CONTAINER_CONDITIONS:
      if (entity) {
        const rule = state.rules.containers.data[entity];
        const filteredConditions = rule.conditions?.filter(condition => !data?.conditionsNames?.includes(condition));
        const ruleWithConditions = Object.assign(rule, { conditions: filteredConditions });
        const normalizeRule = normalize(ruleWithConditions, Schemas.RULE_CONTAINER).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            containers: {
              ...state.rules.containers,
              data: normalizeRule.containerRules,
            }
          }
        });
      }
      return state;
    case RULE_CONTAINER_CONTAINERS_REQUEST:
      return merge({}, state, { rules: { containers: { isLoadingContainers: true, loadContainersError: null } } });
    case RULE_CONTAINER_CONTAINERS_FAILURE:
      return merge({}, state, { rules: { containers: { isLoadingContainers: false, loadContainersError: error } } });
    case RULE_CONTAINER_CONTAINERS_SUCCESS: {
      const rule = entity && state.rules.containers.data[entity];
      const containers = { containers: data?.containers || [] };
      const ruleWithContainers = Object.assign(rule ? rule : [entity], containers);
      const normalizedRule = normalize(ruleWithContainers, Schemas.RULE_CONTAINER).entities;
      return merge({}, state, {
        rules: {
          ...state.rules,
          containers : {
            ...state.rules.containers,
            data: normalizedRule.containerRules,
            isLoadingContainers: false,
            loadContainersError: null,
          },
        }
      });
    }
    case ADD_RULE_CONTAINER_CONTAINERS:
      if (entity && data?.containerIds?.length) {
        const rule = state.rules.containers.data[entity];
        if (rule) {
          if (rule.containers) {
            rule.containers.unshift(...data.containerIds);
          } else {
            rule.containers = data?.containerIds;
          }
          return merge({}, state, { rules: { containers: { data: { [rule.name]: { ...rule } } } } });
        }
        return state;
      }
      break;
    case REMOVE_RULE_CONTAINER_CONTAINERS:
      if (entity) {
        const rule = state.rules.containers.data[entity];
        const filteredContainers = rule.containers?.filter(container => !data?.containerIds?.includes(container));
        const ruleWithContainers = Object.assign(rule, { containers: filteredContainers });
        const normalizeRule = normalize(ruleWithContainers, Schemas.RULE_CONTAINER).entities;
        return merge({}, state, {
          rules: {
            ...state.rules,
            containers: {
              ...state.rules.containers,
              data: normalizeRule.containerRules,
            }
          }
        });
      }
      break;
    case CONDITIONS_REQUEST:
    case CONDITION_REQUEST:
      return merge({}, state, { rules: { conditions: { isLoadingConditions: true, loadConditionsError: null } } });
    case CONDITIONS_FAILURE:
    case CONDITION_FAILURE:
      return merge({}, state, { rules: { conditions: { isLoadingConditions: false, loadConditionsError: error } } });
    case CONDITIONS_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          conditions: {
            ...state.rules.conditions,
            data: merge({}, pick(state.rules.conditions.data, keys(data?.conditions)), data?.conditions),
            isLoadingConditions: false,
            loadConditionsError: null,
          }
        }
      };
    case CONDITION_SUCCESS:
      return {
        ...state,
        rules: {
          ...state.rules,
          conditions: {
            ...state.rules.conditions,
            data: merge({}, state.rules.conditions.data, data?.conditions),
            isLoadingConditions: false,
            loadConditionsError: null,
          }
        }
      };
    case ADD_CONDITION:
      if (data?.conditions?.length) {
        const conditions = normalize(data?.conditions, Schemas.RULE_CONDITION_ARRAY).entities.conditions;
        return merge({}, state, { rules: { conditions : { data: conditions } } });
      }
      break;
    case VALUE_MODES_REQUEST:
      return merge({}, state, { valueModes: { isLoadingValueModes: true, loadValueModesError: null } });
    case VALUE_MODES_FAILURE:
      return merge({}, state, { valueModes: { isLoadingValueModes: false, loadValueModesError: error } });
    case VALUE_MODES_SUCCESS:
      return {
        ...state,
        valueModes: {
          ...state.valueModes,
          data: merge({}, pick(state.valueModes.data, keys(data?.valueModes)), data?.valueModes),
          isLoadingValueModes: false,
          loadValueModesError: null,
        }
      };
    case FIELDS_REQUEST:
      return merge({}, state, { fields: { isLoadingFields: true, loadFieldsError: null } });
    case FIELDS_FAILURE:
      return merge({}, state, { fields: { isLoadingFields: false, loadFieldsError: error } });
    case FIELDS_SUCCESS:
      return {
        ...state,
        fields: {
          ...state.fields,
          data: merge({}, pick(state.fields.data, keys(data?.fields)), data?.fields),
          isLoadingFields: false,
          loadFieldsError: null,
        }
      };
    case OPERATORS_REQUEST:
      return merge({}, state, { operators: { isLoadingOperators: true, loadOperatorsError: null } });
    case OPERATORS_FAILURE:
      return merge({}, state, { operators: { isLoadingOperators: false, loadOperatorsError: error } });
    case OPERATORS_SUCCESS:
      return {
        ...state,
        operators: {
          ...state.operators,
          data: merge({}, pick(state.operators.data, keys(data?.operators)), data?.operators),
          isLoadingOperators: false,
          loadOperatorsError: null,
        }
      };
    case DECISIONS_REQUEST:
    case DECISION_REQUEST:
      return merge({}, state, { decisions: { isLoadingDecisions: true, loadDecisionsError: null } });
    case DECISIONS_FAILURE:
    case DECISION_FAILURE:
      return merge({}, state, { decisions: { isLoadingDecisions: false, loadDecisionsError: error } });
    case DECISIONS_SUCCESS:
      return {
        ...state,
        decisions: {
          ...state.nodes,
          data: merge({}, pick(state.decisions.data, keys(data?.decisions)), data?.decisions),
          isLoadingDecisions: false,
          loadDecisionsError: null,
        }
      };
    case DECISION_SUCCESS:
      return {
        ...state,
        decisions: {
          data: merge({}, state.decisions.data, data?.decisions),
          isLoadingDecisions: false,
          loadDecisionsError: null,
        }
      };
    case SIMULATED_HOST_METRICS_REQUEST:
    case SIMULATED_HOST_METRIC_REQUEST:
      return merge({}, state, { simulatedMetrics: { hosts: { isLoadingSimulatedHostMetrics: true, loadSimulatedHostMetricsError: null } } });
    case SIMULATED_HOST_METRICS_FAILURE:
    case SIMULATED_HOST_METRIC_FAILURE:
      return merge({}, state, { simulatedMetrics: { hosts: { isLoadingSimulatedHostMetrics: false, loadSimulatedHostMetricsError: error } } });
    case SIMULATED_HOST_METRICS_SUCCESS:
      return {
        ...state,
        simulatedMetrics: {
          ...state.simulatedMetrics,
          hosts: {
            ...state.simulatedMetrics.hosts,
            data: merge({}, pick(state.simulatedMetrics.hosts.data, keys(data?.simulatedHostMetrics)), data?.simulatedHostMetrics),
            isLoadingSimulatedHostMetrics: false,
            loadSimulatedHostMetricsError: null,
          }
        }
      };
    case SIMULATED_HOST_METRIC_SUCCESS:
      return {
        ...state,
        simulatedMetrics: {
          ...state.simulatedMetrics,
          hosts: {
            ...state.simulatedMetrics.hosts,
            data: merge({}, state.simulatedMetrics.hosts.data, data?.simulatedHostMetrics),
            isLoadingSimulatedHostMetrics: false,
            loadSimulatedHostMetricsError: null,
          }
        }
      };
    case ADD_SIMULATED_HOST_METRIC:
      if (data?.simulatedHostMetrics?.length) {
        const simulatedHostMetrics = normalize(data?.simulatedHostMetrics, Schemas.SIMULATED_HOST_METRIC_ARRAY).entities.simulatedHostMetrics;
        return merge({}, state, { simulatedMetrics: { hosts : { data: simulatedHostMetrics } } });
      }
      break;
    case SIMULATED_HOST_METRIC_CLOUD_HOSTS_REQUEST:
      return merge({}, state, { simulatedMetrics: { hosts: { isLoadingCloudHosts: true, loadCloudHostsError: null } } });
    case SIMULATED_HOST_METRIC_CLOUD_HOSTS_FAILURE:
      return merge({}, state, { simulatedMetrics: { hosts: { isLoadingCloudHosts: false, loadCloudHostsError: error } } });
    case SIMULATED_HOST_METRIC_CLOUD_HOSTS_SUCCESS: {
      const simulatedHostMetric = entity && state.simulatedMetrics.hosts.data[entity];
      const cloudHosts = { cloudHosts: data?.cloudHosts || [] };
      const simulatedHostMetricWithCloudHosts = Object.assign(simulatedHostMetric ? simulatedHostMetric : [entity], cloudHosts);
      const normalizedSimulatedHostMetric = normalize(simulatedHostMetricWithCloudHosts, Schemas.SIMULATED_HOST_METRIC).entities;
      return merge({}, state, {
        simulatedMetrics: {
          ...state.simulatedMetrics,
          hosts : {
            ...state.simulatedMetrics.hosts,
            data: normalizedSimulatedHostMetric.simulatedHostMetrics,
            isLoadingCloudHosts: false,
            loadCloudHostsError: null,
          }
        }
      });
    }
    case ADD_SIMULATED_HOST_METRIC_CLOUD_HOSTS:
      if (entity && data?.cloudHostsId?.length) {
        const simulatedHostMetric = state.simulatedMetrics.hosts.data[entity];
        if (simulatedHostMetric) {
          if (simulatedHostMetric.cloudHosts) {
            simulatedHostMetric.cloudHosts.unshift(...data.cloudHostsId);
          }
          else {
            simulatedHostMetric.cloudHosts = data.cloudHostsId
          }
          return merge({}, state, { simulatedMetrics: { hosts: { data: { [simulatedHostMetric.name]: {...simulatedHostMetric } } } } });
        }
      }
      break;
    case REMOVE_SIMULATED_HOST_METRIC_CLOUD_HOSTS:
      if (entity) {
        const simulatedHostMetric = state.simulatedMetrics.hosts.data[entity];
        const filteredCloudHosts = simulatedHostMetric.cloudHosts?.filter(cloudHost => !data?.cloudHostsId?.includes(cloudHost));
        const simulatedHostMetricWithCloudHosts = Object.assign(simulatedHostMetric, { cloudHosts: filteredCloudHosts });
        const normalizeSimulatedHostMetric = normalize(simulatedHostMetricWithCloudHosts, Schemas.SIMULATED_HOST_METRIC).entities;
        return merge({}, state, {
          simulatedMetrics: {
            ...state.simulatedMetrics,
            hosts: {
              ...state.simulatedMetrics.hosts,
              data: normalizeSimulatedHostMetric.simulatedHostMetrics,
            }
          }
        });
      }
      return state;
    case SIMULATED_HOST_METRIC_EDGE_HOSTS_REQUEST:
      return merge({}, state, { simulatedMetrics: { hosts: { isLoadingEdgeHosts: true, loadEdgeHostsError: null } } });
    case SIMULATED_HOST_METRIC_EDGE_HOSTS_FAILURE:
      return merge({}, state, { simulatedMetrics: { hosts: { isLoadingEdgeHosts: false, loadEdgeHostsError: error } } });
    case SIMULATED_HOST_METRIC_EDGE_HOSTS_SUCCESS: {
      const simulatedHostMetric = entity && state.simulatedMetrics.hosts.data[entity];
      const edgeHosts = { edgeHosts: data?.edgeHosts || [] };
      const simulatedHostMetricWithEdgeHosts = Object.assign(simulatedHostMetric ? simulatedHostMetric : [entity], edgeHosts);
      const normalizedSimulatedHostMetric = normalize(simulatedHostMetricWithEdgeHosts, Schemas.SIMULATED_HOST_METRIC).entities;
      return merge({}, state, {
        simulatedMetrics: {
          ...state.simulatedMetrics,
          hosts : {
            ...state.simulatedMetrics.hosts,
            data: normalizedSimulatedHostMetric.simulatedHostMetrics,
            isLoadingEdgeHosts: false,
            loadEdgeHostsError: null,
          }
        }
      });
    }
    case ADD_SIMULATED_HOST_METRIC_EDGE_HOSTS:
      if (entity && data?.edgeHostsHostname?.length) {
        const simulatedHostMetric = state.simulatedMetrics.hosts.data[entity];
        if (simulatedHostMetric) {
          if (simulatedHostMetric.edgeHosts) {
            simulatedHostMetric.edgeHosts.unshift(...data.edgeHostsHostname);
          }
          else {
            simulatedHostMetric.edgeHosts = data.edgeHostsHostname;
          }
          return merge({}, state, { simulatedMetrics: { hosts: { data: { [simulatedHostMetric.name]: {...simulatedHostMetric } } } } });
        }
      }
      break;
    case REMOVE_SIMULATED_HOST_METRIC_EDGE_HOSTS:
      if (entity) {
        const simulatedHostMetric = state.simulatedMetrics.hosts.data[entity];
        const filteredEdgeHosts = simulatedHostMetric.edgeHosts?.filter(edgeHost => !data?.edgeHostsHostname?.includes(edgeHost));
        const simulatedHostMetricWithEdgeHosts = Object.assign(simulatedHostMetric, { edgeHosts: filteredEdgeHosts });
        const normalizeSimulatedHostMetric = normalize(simulatedHostMetricWithEdgeHosts, Schemas.SIMULATED_HOST_METRIC).entities;
        return merge({}, state, {
          simulatedMetrics: {
            ...state.simulatedMetrics,
            hosts: {
              ...state.simulatedMetrics.hosts,
              data: normalizeSimulatedHostMetric.simulatedHostMetrics,
            }
          }
        });
      }
      return state;
    case SIMULATED_SERVICE_METRICS_REQUEST:
    case SIMULATED_SERVICE_METRIC_REQUEST:
      return merge({}, state, { simulatedMetrics: { services: { isLoadingSimulatedServiceMetrics: true, loadSimulatedServiceMetricsError: null } } });
    case SIMULATED_SERVICE_METRICS_FAILURE:
    case SIMULATED_SERVICE_METRIC_FAILURE:
      return merge({}, state, { simulatedMetrics: { services: { isLoadingSimulatedServiceMetrics: false, loadSimulatedServiceMetricsError: error } } });
    case SIMULATED_SERVICE_METRICS_SUCCESS:
      return {
        ...state,
        simulatedMetrics: {
          ...state.simulatedMetrics,
          services: {
            ...state.simulatedMetrics.services,
            data: merge({}, pick(state.simulatedMetrics.services.data, keys(data?.simulatedServiceMetrics)), data?.simulatedServiceMetrics),
            isLoadingSimulatedServiceMetrics: false,
            loadSimulatedServiceMetricsError: null,
          }
        }
      };
    case SIMULATED_SERVICE_METRIC_SUCCESS:
      return {
        ...state,
        simulatedMetrics: {
          ...state.simulatedMetrics,
          services: {
            ...state.simulatedMetrics.services,
            data: merge({}, state.simulatedMetrics.services.data, data?.simulatedServiceMetrics),
            isLoadingSimulatedServiceMetrics: false,
            loadSimulatedServiceMetricsError: null,
          }
        }
      };
    case ADD_SIMULATED_SERVICE_METRIC:
      if (data?.simulatedServiceMetrics?.length) {
        const simulatedServiceMetrics = normalize(data?.simulatedServiceMetrics, Schemas.SIMULATED_SERVICE_METRIC_ARRAY).entities.simulatedServiceMetrics;
        return merge({}, state, { simulatedMetrics: { services : { data: simulatedServiceMetrics } } });
      }
      break;
    case SIMULATED_SERVICE_METRIC_SERVICES_REQUEST:
      return merge({}, state, { simulatedMetrics: { services: { isLoadingServices: true, loadServicesError: null } } });
    case SIMULATED_SERVICE_METRIC_SERVICES_FAILURE:
      return merge({}, state, { simulatedMetrics: { services: { isLoadingServices: false, loadServicesError: error } } });
    case SIMULATED_SERVICE_METRIC_SERVICES_SUCCESS: {
      const simulatedServiceMetric = entity && state.simulatedMetrics.services.data[entity];
      const services = { services: data?.services || [] };
      const simulatedServiceMetricWithServices = Object.assign(simulatedServiceMetric ? simulatedServiceMetric : [entity], services);
      const normalizedSimulatedServiceMetric = normalize(simulatedServiceMetricWithServices, Schemas.SIMULATED_SERVICE_METRIC).entities;
      return merge({}, state, {
        simulatedMetrics: {
          ...state.simulatedMetrics,
          services : {
            ...state.simulatedMetrics.services,
            data: normalizedSimulatedServiceMetric.simulatedServiceMetrics,
            isLoadingServices: false,
            loadServicesError: null,
          }
        }
      });
    }
    case ADD_SIMULATED_SERVICE_METRIC_SERVICES:
      if (entity && data?.serviceNames?.length) {
        const simulatedServiceMetric = state.simulatedMetrics.services.data[entity];
        if (simulatedServiceMetric) {
          if (simulatedServiceMetric.services) {
            simulatedServiceMetric.services.unshift(...data.serviceNames);
          }
          else {
            simulatedServiceMetric.services = data.serviceNames;
          }
          return merge({}, state, { simulatedMetrics: { services: { data: { [simulatedServiceMetric.name]: {...simulatedServiceMetric } } } } });
        }
      }
      break;
    case REMOVE_SIMULATED_SERVICE_METRIC_SERVICES:
      if (entity) {
        const simulatedServiceMetric = state.simulatedMetrics.services.data[entity];
        const filteredServices = simulatedServiceMetric.services?.filter(service => !data?.serviceNames?.includes(service));
        const simulatedServiceMetricWithServices = Object.assign(simulatedServiceMetric, { services: filteredServices });
        const normalizeSimulatedServiceMetric = normalize(simulatedServiceMetricWithServices, Schemas.SIMULATED_SERVICE_METRIC).entities;
        return merge({}, state, {
          simulatedMetrics: {
            ...state.simulatedMetrics,
            services: {
              ...state.simulatedMetrics.services,
              data: normalizeSimulatedServiceMetric.simulatedServiceMetrics,
            }
          }
        });
      }
      return state;
    case REGIONS_REQUEST:
    case REGION_REQUEST:
      return merge({}, state, { regions: { isLoadingRegions: true, loadRegionsError: null } });
    case REGIONS_FAILURE:
    case REGION_FAILURE:
      return merge({}, state, { regions: { isLoadingRegions: false, loadRegionsError: error } });
    case REGIONS_SUCCESS:
      return {
        ...state,
        regions: {
          ...state.regions,
          data: merge({}, pick(state.regions.data, keys(data?.regions)), data?.regions),
          isLoadingRegions: false,
          loadRegionsError: null,
        }
      };
    case REGION_SUCCESS:
      return {
        ...state,
        regions: {
          data: merge({}, state.regions.data, data?.regions),
          isLoadingRegions: false,
          loadRegionsError: null,
        }
      };
    case ADD_REGION:
      if (data?.regions?.length) {
        const regions = normalize(data?.regions, Schemas.REGION_ARRAY).entities.regions;
        return merge({}, state, { regions: { data: regions } });
      }
      break;
    case LOAD_BALANCERS_REQUEST:
    case LOAD_BALANCER_REQUEST:
      return merge({}, state, { loadBalancers: { isLoadingLoadBalancers: true, loadLoadBalancersError: null } });
    case LOAD_BALANCERS_FAILURE:
    case LOAD_BALANCER_FAILURE:
      return merge({}, state, { loadBalancers: { isLoadingLoadBalancers: false, loadLoadBalancersError: error } });
    case LOAD_BALANCERS_SUCCESS:
      return {
        ...state,
        loadBalancers: {
          ...state.loadBalancers,
          data: merge({}, pick(state.loadBalancers.data, keys(data?.loadBalancers)), data?.loadBalancers),
          isLoadingLoadBalancers: false,
          loadLoadBalancersError: null,
        }
      };
    case LOAD_BALANCER_SUCCESS:
      return {
        ...state,
        loadBalancers: {
          data: merge({}, state.loadBalancers.data, data?.loadBalancers),
          isLoadingLoadBalancers: false,
          loadLoadBalancersError: null,
        }
      };
    case ADD_LOAD_BALANCER:
      if (data?.loadBalancers?.length) {
        const loadBalancers = normalize(data?.loadBalancers, Schemas.LOAD_BALANCER_ARRAY).entities.loadBalancers;
        return merge({}, state, { loadBalancers: { data: loadBalancers } });
      }
      break;
    case EUREKA_SERVERS_REQUEST:
    case EUREKA_SERVER_REQUEST:
      return merge({}, state, { eurekaServers: { isLoadingEurekaServers: true, loadEurekaServersError: null } });
    case EUREKA_SERVERS_FAILURE:
    case EUREKA_SERVER_FAILURE:
      return merge({}, state, { eurekaServers: { isLoadingEurekaServers: false, loadEurekaServersError: error } });
    case EUREKA_SERVERS_SUCCESS:
      return {
        ...state,
        eurekaServers: {
          ...state.eurekaServers,
          data: merge({}, pick(state.eurekaServers.data, keys(data?.eurekaServers)), data?.eurekaServers),
          isLoadingEurekaServers: false,
          loadEurekaServersError: null,
        }
      };
    case EUREKA_SERVER_SUCCESS:
      return {
        ...state,
        eurekaServers: {
          data: merge({}, state.eurekaServers.data, data?.eurekaServers),
          isLoadingEurekaServers: false,
          loadEurekaServersError: null,
        }
      };
    case ADD_EUREKA_SERVER:
      if (data?.eurekaServers?.length) {
        const eurekaServers = normalize(data?.eurekaServers, Schemas.EUREKA_SERVER_ARRAY).entities.eurekaServers;
        return merge({}, state, { eurekaServers: { data: eurekaServers } });
      }
      break;
    case LOGS_REQUEST:
      return merge({}, state, { logs: { isLoadingLogs: true, loadLogsError: null } });
    case LOGS_FAILURE:
      return merge({}, state, { logs: { isLoadingLogs: false, loadLogsError: error } });
    case LOGS_SUCCESS:
      return {
        ...state,
        logs: {
          ...state.apps,
          data: merge({}, pick(state.logs.data, keys(data?.logs)), data?.logs),
          isLoadingLogs: false,
          loadLogsError: null,
        }
      };
    default:
      return state;
  }
  return state;
};

export default entities;
