import * as halfred from 'halfred';
import { itemsHasErrored, itemsIsLoading } from './items'

export function reviewFetchData() {
  return (dispatch: any) => {
    dispatch(itemsIsLoading(true));

    fetch('/review.json', {
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
      const review = halfred.parse(json).original();
      dispatch(itemsIsLoading(false));
      dispatch(reviewFetchDataSuccess(review));
    }).catch(() => dispatch(itemsHasErrored(true)));
  }
}

export function reviewFetchDataSuccess(proposal: any) {
  return {
    type: 'REVIEW_FETCH_DATA_SUCCESS',
    proposal
  };
}
