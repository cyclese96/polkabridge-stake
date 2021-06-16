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
} from "../actions/types";
import { etheriumNetwork } from "../constants";

const initalState = {
  connected: false,
  currentAccount: "",
  pbrBalance: null,
  biteBalance: null,
  corgibBalance: null,
  error: null,
  loading: false,
  biteLoading: false,
  pbrLoading: false,
  corgibLoading: false,
  currentNetwork: etheriumNetwork
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
        pbrBalance: action.payload.pbr,
        biteBalance: action.payload.bite,
      };
    case LOAD_PBR_BALANCE:
      return {
        ...state,
        pbrBalance: action.payload,
      };
    case LOAD_BITE_BALANCE:
      return {
        ...state,
        biteBalance: action.payload,
      };
    case LOAD_CORGIB_BALANCE:
      return {
        ...state,
        corgibBalance: action.payload,
      };
    case SHOW_LOADING:
      if (action.payload === 'BITE') {
        return {
          ...state,
          biteLoading: true
        }
      } else if (action.payload === 'PBR') {
        return {
          ...state,
          pbrLoading: true
        }
      }
      else if (action.payload === 'CORGIB') {
        return {
          ...state,
          corgibLoading: true
        }
      }
      return {
        ...state,
        loading: true
      };
    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.payload
      }
    case HIDE_LOADING:
      return {
        ...state,
        loading: false,
        biteLoading: false,
        pbrLoading: false,
        corgibLoading: false
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
