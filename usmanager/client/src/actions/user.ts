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

import * as halfred from 'halfred';
import { itemsHasErrored, itemsIsLoading } from './items'

export function userFetchData(id: string) {
  let user = {};
  let status = false;
  return (dispatch: any) => {
    dispatch(itemsIsLoading(true));

    fetch(`http://localhost:8080/users/${id}`, {
      method: 'GET',
      headers: new Headers({
         'Authorization': 'Basic '+btoa('admin:password'),
       }),
    })
    .then(response => {
      if (response.ok) {
        status = true;
        return response.json();
      }
      throw new Error(response.statusText);
    }).then(json => {
      user = halfred.parse(json).original();
      fetch(`http://localhost:8080/employees/${id}`, {
        method: 'GET',
        headers: new Headers({
           'Authorization': 'Basic '+btoa('admin:password'),
         }),
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      }).then(json2 => {
        const employee = halfred.parse(json2).original();
        const userCompleteDetails = Object.assign({ user }, employee);
        dispatch(itemsIsLoading(false));
        dispatch(userFetchDataSuccess(userCompleteDetails));
      }).catch(() => {
        if (status) {
          dispatch(itemsIsLoading(false));
          dispatch(userFetchDataSuccess(user));
        } else {
          dispatch(itemsHasErrored(true));
        }
      });
    }).catch(() => dispatch(itemsHasErrored(true)));
  }
}

export function userFetchDataSuccess(user: any) {
  return {
    type: 'USER_FETCH_DATA_SUCCESS',
    user
  };
}
