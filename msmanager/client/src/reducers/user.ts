import { IUser } from "./items";

interface IUserAction { type: string, user: IUser }

export function user(state = [], action: IUserAction) {
    return action.type === 'USER_FETCH_DATA_SUCCESS' ? action.user : state;
}
