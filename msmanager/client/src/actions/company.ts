import * as halfred from 'halfred';
import { itemsHasErrored, itemsIsLoading } from './items'

export function companyFetchData(id: string) {
  let company = {};
  let status = false;
  return (dispatch: any) => {
    dispatch(itemsIsLoading(true));

    fetch('/company.json', {
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
      company = halfred.parse(json).original();
      fetch('/company-employees.json', {
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
        const companyEmployees = halfred.parse(json2)
          .embeddedResourceArray("employees")
          .map(resource => resource.original());
        const companyWithEmployees = Object.assign({ employees: companyEmployees }, company);
        dispatch(itemsIsLoading(false));
        dispatch(companyFetchDataSuccess(companyWithEmployees));
      }).catch(() => {
        if (status) {
          dispatch(itemsIsLoading(false));
          dispatch(companyFetchDataSuccess(company));
        } else {
          dispatch(itemsHasErrored(true));
        }
      });
    }).catch(() => dispatch(itemsHasErrored(true)));
  }
}

export function companyFetchDataSuccess(company: any) {
  return {
    type: 'COMPANY_FETCH_DATA_SUCCESS',
    company
  };
}
