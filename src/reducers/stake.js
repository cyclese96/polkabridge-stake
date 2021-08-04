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
  STAKE_BITE_TOKENS,
  APPROVE_CORGIB_TOKENS,
  RESET_CORGIB_TOKEN,
  STAKE_CORGIB_TOKENS,
  APPROVE_PWAR_TOKENS,
  STAKE_PWAR_TOKENS,
  LOAD_BSC_POOL,
  RESET_PWAR_TOKEN,
  APPROVE_CL365_TOKENS,
  RESET_CL365_TOKEN,
  STAKE_CL365_TOKENS,
  APPROVE_CLF365_TOKENS,
  RESET_CLF365_TOKEN,
  STAKE_CLF365_TOKENS,
} from "../actions/types";

const initalState = {
  approved: {
    PBR: false,
    BITE: false,
    CORGIB: false,
    PWAR: false,
    CLF365: false,
  },
  stake: {
    PBR: {},
    BITE: {},
    CORGIB: {},
    PWAR: {},
    CLF365: {},
  },
  pool: {
    PBR: {},
    BITE: {},
    CORGIB: {},
    PWAR: {},
    CLF365: {},
  },
  poolLoading: false,
};

export default function (state = initalState, action) {
  switch (action.type) {
    case LOAD_PPOL_INFO:
      return {
        ...state,
        pool: {
          ...state.pool,
          PBR: action.payload.pbr,
          BITE: action.payload.bite,
          CLF365: action.payload.clf365,
        },
        // pbrPoolData: action.payload.pbr,
        // bitePoolData: action.payload.bite,
      };
    case LOAD_BSC_POOL:
      return {
        ...state,
        pool: {
          ...state.pool,
          CORGIB: action.payload.corgib,
          PWAR: action.payload.pwar,
        },
      };
    case APPROVE_PBR_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          PBR: true,
        },
      };
    case RESET_PBR_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          PBR: false,
        },
      };
    case APPROVE_BITE_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          BITE: true,
        },
      };
    case RESET_BITE_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          BITE: false,
        },
      };
    case APPROVE_CLF365_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          CLF365: true,
        },
      };
    case RESET_CLF365_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          CLF365: false,
        },
      };
    case APPROVE_CORGIB_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          CORGIB: true,
        },
      };
    case RESET_CORGIB_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          CORGIB: false,
        },
      };
    case APPROVE_PWAR_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          PWAR: true,
        },
      };
    case RESET_PWAR_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          PWAR: false,
        },
      };
    case RESET_USER_STAKE:
      return {
        ...state,
        approved: {
          ...state.approved,
          PBR: false,
          BITE: false,
          CORGIB: false,
          PWAR: false,
          CLF365: false,
        },
        stake: {
          ...state.stake,
          PBR: {},
          BITE: {},
          CORGIB: {},
          PWAR: {},
          CLF365: {},
        },
      };
    case STAKE_PBR_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          PBR: action.payload,
        },
      };
    case STAKE_BITE_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          BITE: action.payload,
        },
      };
    case STAKE_CLF365_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          CLF365: action.payload,
        },
      };
    case STAKE_CORGIB_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          CORGIB: action.payload,
        },
      };
    case STAKE_PWAR_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          PWAR: action.payload,
        },
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
