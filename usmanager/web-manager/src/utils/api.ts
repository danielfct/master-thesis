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

import axios, {AxiosError, AxiosResponse, Method} from "axios";
import {isAuthenticated} from "./auth";

export const API_URL = 'http://localhost:8080';
/*const API_URL = '/';*/
const TIMEOUT = 5000;


export function getData(url: string): any {
    /* console.log(`GET ${url}`);
     return (dispatch: any) => {
         fetch(url, {
             method: 'GET'
         }).then(response => {
             if (response.ok) {
                 return response.json();
             }
             throw new Error(`${response.status} ${response.statusText}`);
         }).then(json => {
             dispatch(fetchData(json));
         }).catch(e => {
             dispatch(fetchError(e))
         });
     }*/
}

export function postData(url: string, requestBody: any,
                         successCallback: (response: any) => void, failureCallback: (reason: string) => void): void {
    sendData(url, 'POST', requestBody, successCallback, failureCallback);
}

export function putData(url: string, requestBody: any,
                        successCallback: (response: any) => void, failureCallback: (reason: string) => void): void {
    sendData(url, 'PUT', requestBody, successCallback, failureCallback);
}

export function patchData(url: string, requestBody: any,
                          successCallback: (response: any) => void, failureCallback: (reason: string) => void,
                          action?: "post" | "put" | "delete", ): void {
    if (action) {
        requestBody = { request: action.toUpperCase(), body: requestBody };
    }
    sendData(url, 'PATCH', requestBody, successCallback, failureCallback);
}

const sendData = (endpoint: string, method: Method, data: any,
                  successCallback: (response: any) => void, failureCallback: (reason: string) => void) => {
    const url = new URL(endpoint.includes(API_URL) ? endpoint : `${API_URL}/${endpoint}`);
    console.log(`${method} ${url} ${JSON.stringify(data)}`);
    axios(url.href, {
        method,
        headers: {
            //TODO remove headers
            'Authorization': 'Basic YWRtaW46YWRtaW4=',
            'Content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json;charset=UTF-8',
        },
        data,
    }).then((response: AxiosResponse) => {
        console.log(response);
        successCallback(response)
    }).catch((error: AxiosError) => {
        console.error(error);
        failureCallback(error.message);
    })
};

export function deleteData(endpoint: string, successCallback: () => void, failureCallback: (reason: string) => void): void {
    const url = new URL(endpoint.includes(API_URL) ? endpoint : `${API_URL}/${endpoint}`);
    console.log(`DELETE ${url}`);
    axios.delete(url.href, {
        // TODO set options from setupAxiosInterceptors instead, after login
        headers: {
            'Authorization': 'Basic YWRtaW46YWRtaW4=', //TODO remove
            'Content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json;charset=UTF-8',
        },
        timeout: TIMEOUT,
    }).then((response: AxiosResponse) => {
        console.log(response);
        successCallback();
    }).catch((error: AxiosError) => {
        console.log(error);
        failureCallback(error.message);
    })
}

export const setupAxiosInterceptors = (token: string): void => {
    axios.interceptors.request.use(
        (config) => {
            if (isAuthenticated()) {
                config.headers.authorization = token;
            }
            config.headers.contentType = 'application/json;charset=UTF-8';
            config.headers.accept = 'application/json;charset=UTF-8';
            config.timeout = TIMEOUT;
            return config
        }
    )
};
