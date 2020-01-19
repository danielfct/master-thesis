import { IReview } from "./items";

interface IUserAction { type: string, review: IReview }

export function review(state = [], action: IUserAction) {
    return action.type === 'REVIEW_FETCH_DATA_SUCCESS' ? action.review : state;
}
