import { IComment } from "./items";

interface ICommentAction { type: string, comment: IComment }

export function comment(state = [], action: ICommentAction) {
    if (action.type === 'COMMENT_FETCH_DATA_SUCCESS') {
        return action.comment;
    } else {
        return state;
    }
}
