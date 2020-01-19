import fetch from 'isomorphic-fetch'
import { shuffle, slice } from 'lodash'
import {getData} from "../../utils/data";

const FETCH = 'photos/FETCH';
const PHOTOS_URL = 'http://localhost/services';

export const fetchPhotos = () => ({
  type: FETCH,
  payload: getData(PHOTOS_URL)
});

export default function photosReducer(state = [], action = {}) {
  if (action.type === `${FETCH}_FULFILLED`) {
    return slice(shuffle(action.payload), 0, 5)
  } else {
    return state
  }
}
