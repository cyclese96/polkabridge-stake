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
  APPROVE_CORGIB_TOKENS,
  RESET_CORGIB_TOKEN,
  STAKE_CORGIB_TOKENS,
  APPROVE_PWAR_TOKENS,
  STAKE_PWAR_TOKENS,
  LOAD_BSC_POOL,
  RESET_PWAR_TOKEN,
} from "../actions/types";

const initalState = {
  // pbrApproved: false,
  // biteApproved: false,
  // corgibApproved: false,
  approved: {
    PBR: false,
    BITE: false,
    CORGIB: false,
    PWAR: false
  },
  stake: {
    PBR: {},
    BITE: {},
    CORGIB: {},
    PWAR: {}
  },
  // pbrStake: {},
  // biteStake: {},
  // corgibStake: {},
  pool: {
    PBR: {},
    BITE: {},
    CORGIB: {},
    PWAR: {}
  },
  // pbrPoolData: {},
  // bitePoolData: {},
  // corgibPoolData: {},
  poolLoading: false,
};

export default function (state = initalState, action) {
  switch (action.type) {
    case LOAD_PPOL_INFO:
      return {
        ...state,
        pool : {
          ...state.pool,
          PBR: action.payload.pbr,
          BITE: action.payload.bite
        }
        // pbrPoolData: action.payload.pbr,
        // bitePoolData: action.payload.bite,
      };
    case LOAD_BSC_POOL:
      return {
        ...state,
        pool : {
          ...state.pool,
          CORGIB: action.payload.corgib,
          PWAR: action.payload.pwar
        }
      };
    case APPROVE_PBR_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          PBR: true
        }
      };
    case RESET_PBR_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          PBR: false
        }
      };
    case APPROVE_BITE_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          BITE: true
        }
      };
    case RESET_BITE_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          BITE: false
        }
      };
    case APPROVE_CORGIB_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          CORGIB: true
        }
      };
    case RESET_CORGIB_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          CORGIB: false
        }
      };
    case APPROVE_PWAR_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          PWAR: true
        }
      };     
    case RESET_PWAR_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          PWAR: false
        }
      };   
    case RESET_USER_STAKE:
      return {
        ...state,
        approved: {
          ...state.approved,
          PBR: false,
          BITE: false,
          CORGIB: false,
          PWAR: false
        },
        stake: {
          ...state.stake,
          PBR: {},
          BITE: {},
          CORGIB: {},
          PWAR: {},
        }
      };
    case STAKE_PBR_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          PBR: action.payload
        }
      };
    // case UNSTAKE_PBR_TOKENS:
    //   return {
    //    ...state,
    //     stake: {
    //       ...state.stake,
    //       PBR: action.payload
    //     }
    //   };
    case STAKE_BITE_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          BITE: action.payload
        }
      };
    // case UNSTAKE_BITE_TOKENS:
    //   return {
    //     ...state,
    //     biteStake: action.payload,
    //   };
    case STAKE_CORGIB_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          CORGIB: action.payload
        }
      };
    case STAKE_PWAR_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          PWAR: action.payload
        }
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
