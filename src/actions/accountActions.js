import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  LOAD_BALANCE,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  LOAD_CORGIB_BALANCE,
  LOAD_PWAR_BALANCE,
} from "./types";
// import pbrContract from "../contracts/connections/pbrConnection";
// import biteContract from "../contracts/connections/biteConnection";
import { getCurrentAccount } from "../utils/helper";
import {
  pbrContract,
  biteContract,
  corgibCoinContract,
  pwarCoinContract,
  clf365Contract,
} from "../contracts/connections";
import { bscNetwork, etheriumNetwork, maticNetwork } from "../constants";

//GET user authenticated
export const connectWallet =
  (connect = false, network) =>
  async (dispatch) => {
    try {
      const accountAddress = await getCurrentAccount();
      console.log("connect wallet", accountAddress);
      if (
        localStorage.getItem(`logout${accountAddress}`) == accountAddress &&
        !connect
      ) {
        dispatch({
          type: DISCONNECT_WALLET,
        });
        return;
      } else if (
        localStorage.getItem(`logout${accountAddress}`) == accountAddress &&
        connect
      ) {
        localStorage.removeItem(`logout${accountAddress}`);
        console.log("removing logged out user");
      }

      if (!accountAddress) {
        dispatch({
          type: DISCONNECT_WALLET,
        });
        return;
      }
      dispatch({
        type: CONNECT_WALLET,
        payload: accountAddress,
      });
      dispatch({
        type: SHOW_LOADING,
        payload: "BITE",
      });

      if (network === etheriumNetwork) {
        console.log("connectWallet: fetching from", network);
        const [pbrWei, biteWei, cl365Wei] = await Promise.all([
          pbrContract(network).methods.balanceOf(accountAddress).call(),
          biteContract(network).methods.balanceOf(accountAddress).call(),
          clf365Contract(network).methods.balanceOf(accountAddress).call(),
        ]);
        dispatch({
          type: LOAD_BALANCE,
          payload: { pbr: pbrWei, bite: biteWei, clf365: cl365Wei },
        });
      } else if (network === maticNetwork) {
        console.log("connectWallet: fetching from", network);
        const [pbrWei] = await Promise.all([
          pbrContract(network).methods.balanceOf(accountAddress).call(),
        ]);
        dispatch({
          type: LOAD_BALANCE,
          payload: { pbr: pbrWei },
        });
      } else {
        const [corgibWei, pwarWei] = await Promise.all([
          corgibCoinContract(network).methods.balanceOf(accountAddress).call(),
          pwarCoinContract(network).methods.balanceOf(accountAddress).call(),
        ]);

        dispatch({
          type: LOAD_CORGIB_BALANCE,
          payload: corgibWei,
        });
        dispatch({
          type: LOAD_PWAR_BALANCE,
          payload: pwarWei,
        });
      }

      // await updateAcountData();
    } catch (error) {
      console.log("connectWallet ", error);
      dispatch({
        type: ERROR,
        payload: "Failed to connect Meta Mask!",
      });
    }

    dispatch({
      type: HIDE_LOADING,
    });
  };

export const getAccountBalance = (network) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  try {
    const address = await getCurrentAccount();
    if (network === etheriumNetwork) {
      const [pbrWei, biteWei, cl365Wei] = await Promise.all([
        pbrContract(network).methods.balanceOf(address).call(),
        biteContract(network).methods.balanceOf(address).call(),
        clf365Contract(network).methods.balanceOf(address).call(),
      ]);

      dispatch({
        type: LOAD_BALANCE,
        payload: { pbr: pbrWei, bite: biteWei, clf365: cl365Wei },
      });
    } else if (network === maticNetwork) {
      console.log("getAccountBalance: fetching from", network);
      const [pbrWei] = await Promise.all([
        pbrContract(network).methods.balanceOf(address).call(),
      ]);
      dispatch({
        type: LOAD_BALANCE,
        payload: { pbr: pbrWei },
      });
    } else if (network === bscNetwork) {
      // console.log('account', address)
      // console.log('network', network)
      const [corgibWei, pwarWei] = await Promise.all([
        corgibCoinContract(network).methods.balanceOf(address).call(),
        pwarCoinContract(network).methods.balanceOf(address).call(),
      ]);

      dispatch({
        type: LOAD_CORGIB_BALANCE,
        payload: corgibWei,
      });
      dispatch({
        type: LOAD_PWAR_BALANCE,
        payload: pwarWei,
      });
    } else {
      const [pbrWei] = await Promise.all([
        pbrContract(network).methods.balanceOf(address).call(),
      ]);

      dispatch({
        type: LOAD_BALANCE,
        payload: { pbr: pbrWei },
      });
    }
  } catch (error) {
    console.log("getAccountBalance", error);
    dispatch({
      type: ERROR,
      payload: "Failed to load balance!",
    });
  }
  dispatch({
    type: HIDE_LOADING,
  });
};

export const logout = () => (dispatch) => {
  try {
    localStorage.setItem("userAddress", "");
    dispatch({
      type: DISCONNECT_WALLET,
    });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Something went wrong!",
    });
  }
};
