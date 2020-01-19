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
