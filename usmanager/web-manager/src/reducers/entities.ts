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

import merge from 'lodash/merge'
import {
    SERVICES_FAILURE,
    SERVICES_REQUEST,
    SERVICES_SUCCESS,
    SERVICE_DEPENDENCIES_SUCCESS,
    SERVICE_REQUEST, SERVICE_FAILURE, SERVICE_SUCCESS, SERVICE_DEPENDENCIES_REQUEST, SERVICE_DEPENDENCIES_FAILURE
} from "../actions";
import {normalize} from "normalizr";
import {Schemas} from "../middleware/api";
import {IService} from "../components/services/Service";

const entities = (state: { services: { data: { [key: string]: IService }, isLoading: boolean, error?: string | null } } =
                    { services: { data: {}, isLoading: false, error: null } },
                  action: { type: string, args?: number | string, isLoading?: {}, error?: string, response?: { entities: { services: { data: {}}}, result: [] } }
) => {
    const { type, response, error, args } = action;
    switch (type) {
        case SERVICE_REQUEST:
        case SERVICES_REQUEST:
            state =  merge({}, state, { services: { isLoading: true } });
            break;
        case SERVICE_FAILURE:
        case SERVICES_FAILURE:
            state.services = { data: {}, isLoading: false, error: error };
            break;
        case SERVICE_SUCCESS:
            state = merge({}, state, { services: { data: response?.entities.services.data, isLoading: false, error: null } });
            break;
        case SERVICES_SUCCESS:
            state.services.data = {};
            state = merge({}, state, { services: { data: response?.entities.services.data, isLoading: false, error: null } });
            break;
        case SERVICE_DEPENDENCIES_REQUEST:
            //TODO
        case SERVICE_DEPENDENCIES_FAILURE:
            //TODO
        case SERVICE_DEPENDENCIES_SUCCESS:
            if (args) {
                const service = state.services.data[args];
                if (service) {
                    Object.assign(service, response?.entities);
                    console.log(service) //TODO
                    const normalized = normalize(state.services, Schemas.SERVICE_ARRAY);
                    state = merge({}, state, normalized.entities);
                }
            }
            break;
    }
    return state;
};

export default entities;