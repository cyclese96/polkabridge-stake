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
} from "../actions/types";
import { etheriumNetwork } from "../constants";

const initalState = {
  connected: false,
  currentAccount: "",
  balance: {
    BITE:null,
    PBR:null,
    CORGIB:null,
    PWAR:null
  },
  error: null,
  loading: {
    BITE:false,
    PBR:false,
    CORGIB:false,
    PWAR:false
  },
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
        balance: {
          ...state.balance,
          PBR: action.payload.pbr,
          BITE: action.payload.bite
        }
      };
    case LOAD_PBR_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          PBR: action.payload
        }
      };
    case LOAD_BITE_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          BITE: action.payload
        }
      };
    case LOAD_CORGIB_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          CORGIB: action.payload
        }
      };
    case LOAD_PWAR_BALANCE:
      return {
        ...state,
        balance: {
          ...state.balance,
          PWAR: action.payload
        }
      };
    case SHOW_LOADING:
      if (action.payload === 'BITE') {
        return {
          ...state,
          loading:{
            ...state.loading,
            BITE:true
          },
          error: {}
        }
      } else if (action.payload === 'PBR') {
        return {
          ...state,
          loading: {
            ...state.loading,
            PBR: true
          },
          error: {}
        }
      }
      else if (action.payload === 'CORGIB') {
        return {
          ...state,
          loading : {
            ...state.loading,
            CORGIB: true
          },
          error: {}
        }
      }
      else if (action.payload === 'PWAR') {
        return {
          ...state,
          loading : {
            ...state.loading,
            PWAR: true
          },
          error: {}
        }
      }else{
        return {
          ...state,
          loading : {
            ...state.loading,
            PBR: true,
            BITE: true,
            CORGIB: true,
            PWAR: true
          },
          error: {}
        }
      }  
    case CHANGE_NETWORK:
      return {
        ...state,
        currentNetwork: action.payload
      }
    case HIDE_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          PBR: false,
          BITE: false,
          CORGIB: false,
          PWAR: false
        }
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
