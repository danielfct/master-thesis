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
