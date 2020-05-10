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

import { combineReducers } from 'redux'
import entities, {EntitiesState} from "./entities";
import {loadingBar, search, sidenav, UIState} from "./ui";

export interface ReduxState {
    ui: UIState;
    entities: EntitiesState;
}

/*interface ISelectServiceAction {
    type: string;
    service: IService;
}

function selectedService(state = 'reactjs', action: ISelectServiceAction) {
    switch (action.type) {
        case SELECT_SERVICE:
            return action.service;
        default:
            return state;
    }
}

interface IFetchServicesAction {
    type: string;
    isFetching: boolean;
    services: string[];
    failure: TypeError;
    receivedAt: number;
    didInvalidate: boolean;
}

function servicesAction(
    state = {
        isFetching: false,
        didInvalidate: false,
        items: [],
    },
    action: IFetchServicesAction) {
    switch (action.type) {
        case REQUEST_SERVICES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_SERVICES:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.items,
                didInvalidate: false,
                lastUpdated: action.receivedAt
            });
        case INVALIDATE_SERVICES:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        default:
            return state
    }
}

interface IState {
    containers: IListState,
    nodes: IListState,
    edge: IListState,
    cloud: IListState,
    apps: IListState,
    services: IListState,
    serviceRules: IListState,
    metrics: IListState,
    eureka: IListState,
    loadbalancer: IListState,
    regions: IListState,
}*/

export interface IListState {
    isFetching?: boolean;
    didInvalidate?: boolean;
    lastUpdated?: number;
    items?: string[];
}

/*function services(
    state = {
        isFetching: false,
        didInvalidate: false,
    },
    action: IFetchServicesAction) {
    console.log(action)
    switch (action.type) {
        case REQUEST_SERVICES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_SERVICES:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.services,
                didInvalidate: false,
                lastUpdated: action.receivedAt,
            });
        case FAILURE_SERVICES:
            return Object.assign({}, state, {
                isFetching: false,
                failure: action.failure,
            });
        case INVALIDATE_SERVICES:
            return Object.assign({}, state, {
                didInvalidate: true,
            });
        default:
            return state
    }
}*/

export interface IState {
    loadingBar: any, //TODO
    search: { value: string},
    navbar: { hidden: boolean},
    containers: IListState,
    nodes: IListState,
    edge: IListState,
    cloud: IListState,
    apps: IListState,
    services: IListState,
    rules: IListState,
    metrics: IListState,
    eureka: IListState,
    loadbalancer: IListState,
    regions: IListState,
}


const ui = combineReducers({
    sidenav,
    search,
});

// Updates the pagination data for different actions.
/*const pagination = combineReducers({
    starredByUser: paginate({
        mapActionToKey: action => action.login,
        types: [
            ActionTypes.STARRED_REQUEST,
            ActionTypes.STARRED_SUCCESS,
            ActionTypes.STARRED_FAILURE
        ]
    }),
    stargazersByRepo: paginate({
        mapActionToKey: action => action.fullName,
        types: [
            ActionTypes.STARGAZERS_REQUEST,
            ActionTypes.STARGAZERS_SUCCESS,
            ActionTypes.STARGAZERS_FAILURE
        ]
    })
});*/

const rootReducer = combineReducers({
    loadingBar,
    ui,
    entities,
    /*pagination,*/
});

export default rootReducer;