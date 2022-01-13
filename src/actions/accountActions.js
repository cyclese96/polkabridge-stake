import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  LOAD_BALANCE,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
} from "./types";
import { getCurrentAccount } from "../utils/helper";
import { erc20TokenContract } from "../contracts/connections";
import { tokenContarctAddresses } from "../constants";

//GET user authenticated
export const connectWallet =
  (connect = false, network) =>
  async (dispatch) => {
    try {
      const accountAddress = await getCurrentAccount();
      // console.log("connect wallet", accountAddress);
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
        // console.log("removing logged out user");
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

export const getAccountBalance =
  (tokenSymbol, account, network) => async (dispatch) => {
    dispatch({
      type: SHOW_LOADING,
    });
    try {
      const tokenAddress = tokenContarctAddresses?.[network]?.[tokenSymbol];
      const tokenContract = erc20TokenContract(network, tokenAddress);
      const bal = await tokenContract.methods.balanceOf(account).call();

      const balObj = {};
      balObj[tokenSymbol] = bal;

      dispatch({
        type: LOAD_BALANCE,
        payload: balObj,
      });
    } catch (error) {
      // console.log("getAccountBalance", { error, address, network });
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
