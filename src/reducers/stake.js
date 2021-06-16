import {
  LOAD_PPOL_INFO,
  APPROVE_BITE_TOKENS,
  APPROVE_PBR_TOKENS,
  RESET_USER_STAKE,
  SHOW_POOL_LOADING,
  HIDE_POOL_LOADING,
  RESET_PBR_TOKEN,
  RESET_BITE_TOKEN,
  STAKE_PBR_TOKENS,
  UNSTAKE_PBR_TOKENS,
  STAKE_BITE_TOKENS,
  UNSTAKE_BITE_TOKENS,
  APPROVE_CORGIB_TOKENS,
  RESET_CORGIB_TOKEN,
  STAKE_CORGIB_TOKENS,
  LOAD_CORGIB_POOL,
} from "../actions/types";

const initalState = {
  pbrApproved: false,
  biteApproved: false,
  corgibApproved: false,
  pbrStake: {},
  biteStake: {},
  corgibStake: {},
  pbrPoolData: {},
  bitePoolData: {},
  corgibPoolData: {},
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
    case LOAD_CORGIB_POOL:
      return {
        ...state,
        corgibPoolData: action.payload
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
    case APPROVE_CORGIB_TOKENS:
      return {
        ...state,
        corgibApproved: true,
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
    case RESET_CORGIB_TOKEN:
      return {
        ...state,
        corgibApproved: false,
      };
    case RESET_USER_STAKE:
      return {
        ...state,
        pbrApproved: false,
        biteApproved: false,
        corgibApproved: false,
        pbrStake: {},
        biteStake: {},
        corgibStake: {}
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
    case STAKE_CORGIB_TOKENS:
      return {
        ...state,
        corgibStake: action.payload,
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
