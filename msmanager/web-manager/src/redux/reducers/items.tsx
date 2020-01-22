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

const TYPE = 'items';

interface IItemsReducer<T> {
    type: string,
    data: T[],
    fetchError: TypeError,
    itemSelected: T,
    edit: boolean
}

export function fetchData<T>(data: T[]) {
    return {
        type: `${TYPE}/FETCH_FULFILLED`,
        data,
    }
}

export const fetchError = (fetchError: TypeError) => ({
    type: `${TYPE}/FETCH_ERROR`,
    fetchError,
});

export function itemSelection<T>(itemSelected: T) {
    return {
        type: `${TYPE}/SELECT`,
        itemSelected,
    }
}

export const editItem = (edit: boolean) => ({
    type: `${TYPE}/EDIT`,
    edit,
});

export default function itemsReducer<T>(state = [], action: IItemsReducer<T>) {
    switch (action.type) {
        case `${TYPE}/FETCH_FULFILLED`:
            const data = action.data;
            return {
                ...state,
                data
            };
        case `${TYPE}/FETCH_ERROR`:
            const fetchError = action.fetchError;
            return {
                ...state,
                fetchError
            };
        case `${TYPE}/SELECT`:
            const itemSelected = action.itemSelected;
            return {
                ...state,
                itemSelected
            };
        case `${TYPE}/EDIT`:
            const edit = action.edit;
            return {
                ...state,
                edit
            };
        default:
            return state;
    }
}
