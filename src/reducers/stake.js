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
  APPROVE_CLF365_TOKENS,
  RESET_CLF365_TOKEN,
  STAKE_CLF365_TOKENS,
  STAKE_PUN_TOKENS,
  RESET_PUN_TOKEN,
  APPROVE_PUN_TOKENS,
  APPROVE_SHOE_TOKENS,
  RESET_SHOE_TOKEN,
  STAKE_SHOE_TOKENS,
  APPROVE_WELT_TOKENS,
  RESET_WELT_TOKEN,
  STAKE_WELT_TOKENS,
} from "../actions/types";

const initalState = {
  approved: {
    PBR: false,
    BITE: false,
    CORGIB: false,
    PWAR: false,
    CFL365: false,
    PUN: false,
    SHE: false,
  },
  stake: {
    PBR: {},
    BITE: {},
    CORGIB: {},
    PWAR: {},
    CFL365: {},
    PUN: {},
    SHOE: {},
  },
  pool: {
    PBR: {},
    BITE: {},
    CORGIB: {},
    PWAR: {},
    CFL365: {},
    PUN: {},
    SHOE: {},
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
          CFL365: action.payload.clf365,
          PUN: action.payload.pun,
          SHOE: action.payload.shoe,
          WELT: action.payload.welt,
        },
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
          CFL365: true,
        },
      };
    case RESET_CLF365_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          CFL365: false,
        },
      };
    case APPROVE_PUN_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          PUN: true,
        },
      };
    case RESET_PUN_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          PUN: false,
        },
      };
    case APPROVE_SHOE_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          SHOE: true,
        },
      };
    case RESET_SHOE_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          SHOE: false,
        },
      };
    case APPROVE_WELT_TOKENS:
      return {
        ...state,
        approved: {
          ...state.approved,
          WELT: true,
        },
      };
    case RESET_WELT_TOKEN:
      return {
        ...state,
        approved: {
          ...state.approved,
          WELT: false,
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
        approved: initalState.approved,
        stake: initalState.stake,
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
          CFL365: action.payload,
        },
      };
    case STAKE_PUN_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          PUN: action.payload,
        },
      };
    case STAKE_SHOE_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          SHOE: action.payload,
        },
      };
    case STAKE_WELT_TOKENS:
      return {
        ...state,
        stake: {
          ...state.stake,
          WELT: action.payload,
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
