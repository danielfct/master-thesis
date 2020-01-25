/*
 * MIT License
 *
 * Copyright (c) 2020 msmanager
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

import {normalize, schema} from 'normalizr';
import { camelizeKeys } from 'humps';
import IService from "../components/services/IService";

/*const API_ROOT = 'http://localhost/';*/
const API_ROOT = '';

const callApi = (endpoint: string, schema: schema.Entity<IService>) => {
    const url = endpoint.includes(API_ROOT) ? endpoint : API_ROOT + endpoint;
    return fetch(url)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                const camelizedJson = camelizeKeys(json);
                return normalize(camelizedJson, schema);
            })
        )
};

interface ISchemas {
    SERVICE: schema.Entity<IService>;
    SERVICE_ARRAY: schema.Entity<IService>[];
}

const serviceSchema: schema.Entity<IService> = new schema.Entity('services', {}, {
    idAttribute: (service: IService) => service.serviceName.toString()
});

export const Schemas: ISchemas = {
    SERVICE: serviceSchema,
    SERVICE_ARRAY: [serviceSchema],
};

/*const repoSchema = new schema.Entity('repos', {
    owner: userSchema
}, {
    idAttribute: repo => repo.fullName.toLowerCase()
})*/

export const CALL_API = 'Call API';

export default (store: any) => (next: (action: any) => void) => (action: any) => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action)
    }
    const { endpoint, schema, types } = callAPI;
    const actionWith = (data: any) => {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    };
    const [ requestType, successType, failureType ] = types;
    next(actionWith({ type: requestType }));
    return callApi(endpoint, schema).then(
        response => next(actionWith({
            response,
            type: successType,
        })),
        error => next(actionWith({
            error: error.message || 'Error fetching data',
            type: failureType,
        }))
    )
}
