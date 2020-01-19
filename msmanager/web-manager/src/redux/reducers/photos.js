import {getData} from "../../utils/data";

const FETCH = 'photos/FETCH';
const PHOTOS_URL = 'http://localhost/services';

export const fetchPhotos = () => ({
  type: FETCH,
  payload: getData(PHOTOS_URL)
});

export default function photosReducer(state = [], action = {}) {
  if (action.type === `${FETCH}_FULFILLED`) {
    return action.payload;
  } else {
    return state
  }
}
