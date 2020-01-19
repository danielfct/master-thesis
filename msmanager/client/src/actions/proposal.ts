import * as halfred from 'halfred';
import { itemsHasErrored, itemsIsLoading } from './items'

export function proposalFetchData() {
  let proposal = {};
  return (dispatch: any) => {
    dispatch(itemsIsLoading(true));

    fetch('/proposal.json', {
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
      const resource = halfred.parse(json);
      proposal = resource.original();
      // const proposer = halfred.parse(resource.link("proposer")).original(); //TODO
      const proposer = "Jerúcildio Gomes";
      const proposalWithProposer = Object.assign({ proposer }, proposal);
      dispatch(itemsIsLoading(false));
      dispatch(proposalFetchDataSuccess(proposalWithProposer));
    }).catch(() => dispatch(itemsHasErrored(true)));
  }
}

export function proposalFetchDataSuccess(proposal: any) {
  return {
    type: 'PROPOSAL_FETCH_DATA_SUCCESS',
    proposal
  };
}
