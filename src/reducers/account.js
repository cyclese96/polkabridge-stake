import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  LOAD_BALANCE,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACCOUNT,
  LOAD_PBR_BALANCE,
  LOAD_BITE_BALANCE,
  CHANGE_NETWORK,
  LOAD_CORGIB_BALANCE,
  LOAD_PWAR_BALANCE,
  LOAD_CLF365_BALANCE,
  LOAD_PUN_BALANCE,
  LOAD_SHOE_BALANCE,
} from "../actions/types";
import { CFL365, etheriumNetwork, PUN, SHOE } from "../constants";

const initalState = {
  connected: false,
  currentAccount: "",
  balance: {
    BITE: null,
    PBR: null,
    CORGIB: null,
    PWAR: null,
    CFL365: null,
    PUN: null,
    SHOE: null
  },
  error: null,
  loading: {
    BITE: false,
    PBR: false,
    CORGIB: false,
    PWAR: false,
    CFL365: false,
    PUN: false,
    SHOE: false
  },
  currentNetwork: etheriumNetwork,
};

export default function (state = initalState, action) {
  switch (action.type) {
    case CONNECT_WALLET:
      return {
        ...state,
        connected: true,
        currentAccount: action.payload,
      };
    case DISCONNECT_WALLET:
      return {
        ...state,
        connected: false,
        currentAccount: "",
      };
    case SET_ACCOUNT:
      return {
        ...state,
        currentAccount: action.payload,
      };
    case LOAD_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          ...action.payload
        },
      };
    case LOAD_PBR_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          PBR: action.payload,
        },
      };
    case LOAD_BITE_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          BITE: action.payload,
        },
      };
    case LOAD_CORGIB_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          CORGIB: action.payload,
        },
      };
    case LOAD_PWAR_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          PWAR: action.payload,
        },
      };
    case LOAD_CLF365_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          CFL365: action.payload,
        },
      };
    case LOAD_PUN_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          PUN: action.payload,
        },
      };
    case LOAD_SHOE_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          SHOE: action.payload,
        },
      };
    case SHOW_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload
        }
      }

    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.payload,
      };
    case HIDE_LOADING:
      return {
        ...state,
        loading: initalState.loading
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
