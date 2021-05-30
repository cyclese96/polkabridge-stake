import {
  LOAD_PPOL_INFO,
  APPROVE_TOKENS,
  GET_USER_STAKE,
  STAKE_TOKENS,
  UNSTAKE_TOKENS,
  RESET_USER_STAKE,
} from "../actions/types";

const initalState = {
  approved: false,
  stakeData: {}, // store current account stake
  poolData: {},
  poolID: 0,
};

export default function (state = initalState, action) {
  switch (action.type) {
    case LOAD_PPOL_INFO:
      return {
        ...state,
        poolData: action.payload,
      };
    case APPROVE_TOKENS:
      return {
        ...state,
        approved: true,
      };
    case RESET_USER_STAKE:
      return {
        ...state,
        approved: false,
        stakeData: {},
      };
    case GET_USER_STAKE:
      return {
        ...state,
        stakeData: action.payload,
      };
    case STAKE_TOKENS:
      return {
        ...state,
        stakeData: action.payload,
      };
    case UNSTAKE_TOKENS:
      return {
        ...state,
        stakeData: action.payload,
      };
    default:
      return state;
  }
}
