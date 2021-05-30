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
import pbrContract from "../utils/pbrConnection";
import { updateAcountData } from "./stakeActions";
import { getCurrentAccount } from "./helper";
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
export const connectWallet = () => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  if (web3 !== undefined) {
    if (checkNetwork()) {
      try {
        const accountAddress = await getCurrentAccount();
        dispatch({
          type: CONNECT_WALLET,
        });
        dispatch({
          type: SET_ACCOUNT,
          payload: accountAddress,
        });

        if (
          accountAddress == localStorage.getItem("loggedOut", accountAddress)
        ) {
          dispatch({
            type: DISCONNECT_WALLET,
          });
        } else {
          const pbrWei = await pbrContract.methods
            .balanceOf(accountAddress)
            .call();

          dispatch({
            type: LOAD_BALANCE,
            payload: pbrWei,
          });
        }

        // await updateAcountData();
      } catch (error) {
        dispatch({
          type: ERROR,
          payload: "Failed to connect Meta Mask!",
        });
      }
    } else {
      dispatch({
        type: ERROR,
        payload: "Wrong network!",
      });
    }
  } else {
    dispatch({
      type: ERROR,
      payload: "Please Install Meta Mask first!",
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
