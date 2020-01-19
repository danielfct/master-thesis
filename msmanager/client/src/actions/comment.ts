import * as halfred from 'halfred';
import { itemsHasErrored, itemsIsLoading } from './items'

export function commentFetchData() {
  return (dispatch: any) => {
    dispatch(itemsIsLoading(true));

    fetch('/comments.json', {
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
      const comment = halfred.parse(json).original();
      dispatch(itemsIsLoading(false));
      dispatch(commentFetchDataSuccess(comment));
    }).catch(() => dispatch(itemsHasErrored(true)));
  }
}

export function commentFetchDataSuccess(comment: any) {
  return {
    type: 'COMMENT_FETCH_DATA_SUCCESS',
    comment
  };
}
