import {
  LOAD_PPOL_INFO,
  APPROVE_BITE_TOKENS,
  APPROVE_PBR_TOKENS,
  GET_USER_STAKE,
  STAKE_TOKENS,
  UNSTAKE_TOKENS,
  RESET_USER_STAKE,
  SHOW_POOL_LOADING,
  HIDE_POOL_LOADING,
  DISAPPROVE_TOKENS,
  RESET_PBR_TOKEN,
  RESET_BITE_TOKEN,
  STAKE_PBR_TOKENS,
  UNSTAKE_PBR_TOKENS,
  STAKE_BITE_TOKENS,
  UNSTAKE_BITE_TOKENS,
} from "../actions/types";

const initalState = {
  pbrApproved: false,
  biteApproved: false,
  pbrStake: {},
  biteStake: {},
  pbrPoolData: {},
  bitePoolData: {},
  poolLoading: false,
};

export default function (state = initalState, action) {
  switch (action.type) {
    case LOAD_PPOL_INFO:
      return {
        ...state,
        pbrPoolData: action.payload.pbr,
        bitePoolData: action.payload.bite,
      };
    case APPROVE_PBR_TOKENS:
      return {
        ...state,
        pbrApproved: true,
      };
    case APPROVE_BITE_TOKENS:
      return {
        ...state,
        biteApproved: true,
      };
    case RESET_PBR_TOKEN:
      return {
        ...state,
        pbrApproved: false,
      };
    case RESET_BITE_TOKEN:
      return {
        ...state,
        biteApproved: false,
      };
    case RESET_USER_STAKE:
      return {
        ...state,
        pbrApproved: false,
        biteApproved: false,
        pbrStake: {},
        biteStake: {}
      };
    case STAKE_PBR_TOKENS:
      return {
        ...state,
        pbrStake: action.payload,
      };
    case UNSTAKE_PBR_TOKENS:
      return {
        ...state,
        pbrStake: action.payload,
      };
    case STAKE_BITE_TOKENS:
      return {
        ...state,
        biteStake: action.payload,
      };
    case UNSTAKE_BITE_TOKENS:
      return {
        ...state,
        biteStake: action.payload,
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
    default:
      return state;
  }
}
