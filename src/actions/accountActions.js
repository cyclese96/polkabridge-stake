import axios from "axios";
// import baseUrl from "./baseUrl";
import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  CHANGE_ACCOUNT,
  LOAD_BALANCE,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACCOUNT,
} from "./types";
import web3 from "../web3";
import pbrContract from "../contracts/connections/pbrConnection";
import { updateAcountData } from "./stakeActions";
import { getCurrentAccount } from "../utils/helper";
const checkNetwork = () => {
  // console.log("web3 provider", web3.currentProvider.networkVersion);
  // if (web3.currentProvider.networkVersion === "42") {
  //   return true;
  // } else {
  //   return false;
  // }
  return true;
};

//GET user authenticated
export const connectWallet =
  (connect = false) =>
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
      });

      const pbrWei = await pbrContract.methods.balanceOf(accountAddress).call();

      dispatch({
        type: LOAD_BALANCE,
        payload: pbrWei,
      });

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

export const getAccountBalance = (address) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  try {
    const pbrWei = await pbrContract.methods.balanceOf(address).call();

    dispatch({
      type: LOAD_BALANCE,
      payload: pbrWei,
    });
  } catch (error) {
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
