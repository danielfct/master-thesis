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

interface IItemsHasErroredAction { type: string, hasErrored: boolean }
interface IItemsIsLoadingAction { type: string, isLoading: boolean }
interface IItemsAction { type: string, items: any[] }
interface IItemSelectedAction { type: string, itemSelected: any }

export interface IProposal {
  id: number;
  title: string;
  description: string;
  state: string;
  creationDate: string;
  _links: any;
  proposer?: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  job?: string;
  password?: string
}

export interface ICompany {
  id: number;
  name: string;
  city: string;
  zipCode: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  employees: IUser[];
}

export interface IReview {
  id: number;
  title: string;
  text: string;
  summary: string;
  classification: string;
  creationDate: string;
  author: string;
}

export interface IComment {
  id: number;
  title: string;
  text: string;
  creationDate: string;
  author: string;
}

export function itemsHasErrored(state = false,
  action: IItemsHasErroredAction) {
    switch (action.type) {
        case 'ITEMS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function itemsIsLoading(state = false,
  action: IItemsIsLoadingAction) {
    switch (action.type) {
        case 'ITEMS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function items(state = [],
  action: IItemsAction) {
    switch (action.type) {
        case 'ITEMS_FETCH_DATA_SUCCESS':
            return action.items;
        default:
            return state;
    }
}

export function itemSelected(state = {},
  action: IItemSelectedAction) {
    switch (action.type) {
        case 'ITEM_SELECTED':
            return action.itemSelected;
        default:
            return state;
    }
}
