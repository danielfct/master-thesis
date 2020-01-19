import { combineReducers } from 'redux';
import { items, itemsHasErrored, itemsIsLoading, itemSelected } from './items';
import { proposal } from './proposal';
import { user } from './user';
import { review } from './review';
import { comment } from './comment';
import { company } from './company';
import { modalStatusChanged } from './modals';

export default combineReducers({
    items,
    itemsHasErrored,
    itemsIsLoading,
    modalStatusChanged,
    itemSelected,
    proposal,
    user,
    review,
    comment,
    company
});
