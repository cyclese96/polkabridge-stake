import {
  RESET_USER_STAKE,
  SHOW_POOL_LOADING,
  HIDE_POOL_LOADING,
  LOAD_PBR_MARKET_DATA,
  LOAD_STAKE_POOL,
  ALLOWANCE_UPDATE,
  GET_USER_STAKE_DATA,
} from "../actions/types";

const initalState = {
  approved: {},
  stake: {},
  pool: {},
  poolLoading: false,
  pbrMarketData: {},
};

export default function (state = initalState, action) {
  switch (action.type) {
    case LOAD_PBR_MARKET_DATA:
      return {
        ...state,
        pbrMarketData: {
          ...state.pbrMarketData,
          ...action.payload,
        },
      };
    case LOAD_STAKE_POOL:
      return {
        ...state,
        pool: {
          ...state.pool,
          ...action.payload,
        },
      };
    case RESET_USER_STAKE:
      return {
        ...state,
        approved: initalState.approved,
        stake: initalState.stake,
      };
    case SHOW_POOL_LOADING:
      return {
        ...state,
        poolLoading: true,
      };
    case HIDE_POOL_LOADING:
      return {
        ...state,
        poolLoading: false,
      };
    case ALLOWANCE_UPDATE:
      return {
        ...state,
        approved: {
          ...state.approved,
          ...action.payload,
        },
      };
    case GET_USER_STAKE_DATA:
      return {
        ...state,
        stake: {
          ...state.stake,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
