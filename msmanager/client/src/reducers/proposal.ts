import { IProposal } from './items'

interface IProposalAction { type: string, proposal: IProposal }

export function proposal(state = {}, action: IProposalAction) {
    return action.type === 'PROPOSAL_FETCH_DATA_SUCCESS' ? action.proposal : state;
}
