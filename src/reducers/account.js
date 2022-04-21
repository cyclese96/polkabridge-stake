import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  LOAD_BALANCE,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACCOUNT,
  CHANGE_NETWORK,
} from "../actions/types";
import { etheriumNetwork } from "../constants";

const initalState = {
  connected: false,
  currentAccount: "",
  balance: {},
  error: null,
  loading: {},
  currentNetwork: etheriumNetwork,
  currentChain: null,
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
          ...action.payload,
        },
      };
    case SHOW_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.payload.network,
        currentChain: action.payload.chain,
      };
    case HIDE_LOADING:
      return {
        ...state,
        loading: initalState.loading,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
        balance: initalState.balance,
      };
    default:
      return state;
  }
}
