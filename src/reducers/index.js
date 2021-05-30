import { combineReducers } from "redux";
import accountReducer from "./account";
import stakeReducer from "./stake";

export default combineReducers({
  account: accountReducer,
  stake: stakeReducer,
});
