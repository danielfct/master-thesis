import {ReduxState} from "../reducers";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.log('Failed to load state from local storage: ' + e);
        return undefined;
    }
};

export const saveState = (state: ReduxState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        console.log('Failed to save state to local storage: ' + e);
    }
};
