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

export function itemsHasErrored(boolState: boolean) {
  return {
    type: 'ITEMS_HAS_ERRORED',
    hasErrored: boolState
  };
}

export function itemsIsLoading(boolState: boolean) {
  return {
    type: 'ITEMS_IS_LOADING',
    isLoading: boolState
  };
}

export function itemsFetchDataSuccess(items: any[]) {
  return {
    type: 'ITEMS_FETCH_DATA_SUCCESS',
    items
  };
}

export function itemsFetchData(url: string, embeddedArray: string) {
  return (dispatch: any) => {
    dispatch(itemsIsLoading(true));

    fetch(url, {
      method: 'GET',
      headers: new Headers({
         'Authorization': 'Basic '+btoa('admin:password'),
       }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    }).then(json => {
      const items = halfred.parse(json)
        .embeddedResourceArray(embeddedArray)
        .map(resource => resource.original());
      dispatch(itemsIsLoading(false));
      dispatch(itemsFetchDataSuccess(items));
    }).catch(() => dispatch(itemsHasErrored(true)));
  }
}

export function itemSelected(item: any) {
  return {
    type: 'ITEM_SELECTED',
    itemSelected: item
  };
}
