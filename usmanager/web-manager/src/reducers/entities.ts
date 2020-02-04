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
import {SERVICE_DEPENDENCIES_SUCCESS, SERVICE_SUCCESS} from "../actions";
import {normalize} from "normalizr";
import {Schemas} from "../middleware/api";

const entities = (state = { services: {} },
                  action: { type: string, args?: number | string, response: { entities: {}, result: [] }}) => {
    if (action.response && action.response.entities) {
        const {type, args, response} = action;
        switch (type) {
            case SERVICE_SUCCESS:
                return merge({}, state, response.entities);
            case SERVICE_DEPENDENCIES_SUCCESS:
                // @ts-ignore
                const service = state.services[args];
                if (!service) {
                    return state;
                }
                Object.assign(service, response.entities);
                const normalized = normalize(state.services, Schemas.SERVICE_ARRAY);
                return merge({}, state, normalized.entities);
        }
    }
    return state;
};

export default entities;