import { combineReducers } from "redux";
import accountReducer from "./account";
import stakeReducer from "./stake";
import multicall from "../state/multicall/reducer";

export default combineReducers({
  account: accountReducer,
  stake: stakeReducer,
  multicall: multicall,
});
