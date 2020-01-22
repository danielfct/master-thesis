import {loadingBarReducer as loadingBar} from "react-redux-loading-bar";
import items from './items'
import services from './services'
import searchFilter from './searchFilter'
import sidenav from "./sidenav";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
  loadingBar,
  items,
  searchFilter,
  sidenav,
  services
});

export default rootReducer;
