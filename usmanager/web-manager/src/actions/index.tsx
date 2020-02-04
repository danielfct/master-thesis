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
import {IBreadcrumbs} from "../components/shared/Breadcrumbs";
import {IService} from "../components/services/Service";
import {IServiceDependency} from "../components/services/ServiceDependencyList";

export const SERVICE_REQUEST = 'SERVICE_REQUEST';
export const SERVICE_SUCCESS = 'SERVICE_SUCCESS';
export const SERVICE_FAILURE = 'SERVICE_FAILURE';

export const loadServices = (name?: string, requiredField = 'id') => (dispatch: any, getState: any) => {
    let cached;
    if (name) {
        let entity = getState().entities.services[name];
        cached = entity && entity.hasOwnProperty(requiredField);
    }
    else {
        let entities = getState().entities.services;
        cached = entities && entities.length
            && entities.every((entity: IService) => entity.hasOwnProperty(requiredField));
    }
    return cached ? null : dispatch(fetchServices(name));
};

const fetchServices = (name?: string) => ({
    [CALL_API]: {
        types: [ SERVICE_REQUEST, SERVICE_SUCCESS, SERVICE_FAILURE ],
        /*  endpoint: !id ? `services` : `services/${id}`,TODO*/
        endpoint: !name ? `services.json` : `service.json`,
        schema: !name ? Schemas.SERVICE_ARRAY : Schemas.SERVICE,
    }
});

export const SERVICE_DEPENDENCIES_REQUEST = 'SERVICE_DEPENDENCIES_REQUEST';
export const SERVICE_DEPENDENCIES_SUCCESS = 'SERVICE_DEPENDENCIES_SUCCESS';
export const SERVICE_DEPENDENCIES_FAILURE = 'SERVICE_DEPENDENCIES_FAILURE';

export const loadServiceDependencies = (service: IService, id?: string | number) => (dispatch: any, getState: any) => {
    const cachedService = getState().entities.services[service.serviceName];
    let cached = cachedService && cachedService.dependencies;
    if (id) {
        cached = cached[id];
    }
    console.log('service dependencies of ' + service.serviceName + ' cached? ' + cached);
    return cached ? null : dispatch(fetchServiceDependencies(service, id));
};

const fetchServiceDependencies = (service: IService, id?: string | number) => ({
    [CALL_API]: {
        types: [ SERVICE_DEPENDENCIES_REQUEST, SERVICE_DEPENDENCIES_SUCCESS, SERVICE_DEPENDENCIES_FAILURE ],
        /*endpoint: !id ? `services/${service.id}/dependencies` : `services/${service.id}/dependencies/${id}`,TODO*/
        endpoint: !id ? `serviceDependencies.json` : `serviceDependency.json`,
        schema: !id ? Schemas.SERVICE_DEPENDENCY_ARRAY : Schemas.SERVICE_DEPENDENCY,
        args: service.serviceName
    }
});



export const SELECT_ENTITY = 'SELECT_ENTITY';

export function selectEntity<T>(entity: T) {
    return {
        type: SELECT_ENTITY,
        entity
    }
}

/*export const RECEIVE_SERVICES = 'RECEIVE_SERVICES';
function receiveServices(servicesJson: string) {
    return {
        type: RECEIVE_SERVICES,
        services: servicesJson,
        receivedAt: Date.now()
    }
}

export const INVALIDATE_SERVICES = 'INVALIDATE_SERVICES';
export function invalidateServices() {
    return {
        type: INVALIDATE_SERVICES
    }
}



export const DELETE_SERVICE = 'DELETE_SERVICE';
export function deleteService(service: IService) {
    return {
        type: DELETE_SERVICE,
        service
    }
}

export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export function updateService(service: IService) {
    return {
        type: UPDATE_SERVICE,
        service
    }
}

function shouldFetchServices(state: any) {
    return true;
   /!* const services = state.services.items;
    if (!services) {
        return true;
    } else if (services.isFetching) {
        return false;
    } else {
        return services.didInvalidate;
    }*!/
}

export function fetchPostsIfNeeded() {
    return (dispatch: any, getState: any) => {
        if (shouldFetchServices(getState())) {
            return dispatch(fetchServices())
        } else {
            return Promise.resolve()
        }
    }
}

export function fetchDeleteService(service: IService) {
    //TODO
}

export function fetchUpdateService(service: IService) {
    //TODO
}

export const HIDE_SIDE_NAV = 'HIDE_SIDE_NAV';
export const hideSidenav = (hidden: boolean) => (
    {
        type: HIDE_SIDE_NAV,
        hidden,
    }
);*/

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
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

export const BREADCRUMBS_UPDATE = 'BREADCRUMBS_UPDATE';

export const updateBreadcrumbs = (breadcrumbs: IBreadcrumbs) => (
    {
        type: BREADCRUMBS_UPDATE,
        breadcrumbs
    }
);

/*
export const BREADCRUMBS_ADD = 'BREADCRUMBS_ADD';

export const addBreadcrumb = (title: string, link?: string) => (
    {
        type: BREADCRUMBS_ADD,
        title,
        link
    }
);*/
