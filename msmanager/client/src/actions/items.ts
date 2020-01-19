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
