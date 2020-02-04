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

import union from 'lodash/union'

interface IPaginate {
    types: [string, string, string];
    mapActionToKey: (action: any) => string
}

const paginate = ({ types, mapActionToKey }: IPaginate) => {
    const [ requestType, successType, failureType ] = types;
    const updatePagination = (state = {
        isFetching: false,
        ids: []
    }, action: any) => {
        switch (action.type) {
            case requestType:
                return {
                    ...state,
                    isFetching: true,
                };
            case successType:
                return {
                    ...state,
                    isFetching: false,
                    ids: union(state.ids, action.response.result),
                };
            case failureType:
                return {
                    ...state,
                    isFetching: false,
                };
            default:
                return state;
        }
    };
    return (state = {}, action: any) => {
        switch (action.type) {
            case requestType:
            case successType:
            case failureType:
                const key = mapActionToKey(action);
                // @ts-ignore
                const stateKey = state[key];
                return {
                    ...state,
                    [key]: updatePagination(stateKey, action)
                };
            default:
                return state
        }
    }
};

export default paginate;
