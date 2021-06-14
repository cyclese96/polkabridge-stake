
import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  LOAD_BALANCE,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
} from "./types";
// import pbrContract from "../contracts/connections/pbrConnection";
// import biteContract from "../contracts/connections/biteConnection";
import { getCurrentAccount } from "../utils/helper";
import { pbrContract, biteContract } from '../contracts/connections'
import { etheriumNetwork } from "../constants";

//GET user authenticated
export const connectWallet =
  (connect = false, network = etheriumNetwork) =>
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

        const [pbrWei, biteWei] = await Promise.all([
          pbrContract(network).methods.balanceOf(accountAddress).call(),
          biteContract(network).methods.balanceOf(accountAddress).call()
        ])
        dispatch({
          type: LOAD_BALANCE,
          payload: { pbr: pbrWei, bite: biteWei },
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

export const getAccountBalance = (address, network = etheriumNetwork) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  try {
    const [pbrWei, biteWei] = await Promise.all([
      pbrContract(network).methods.balanceOf(address).call(),
      biteContract(network).methods.balanceOf(address).call()
    ])

    dispatch({
      type: LOAD_BALANCE,
      payload: { pbr: pbrWei, bite: biteWei },
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
