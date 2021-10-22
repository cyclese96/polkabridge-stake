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
import { getCurrentAccount } from "../utils/helper";
import {
  pbrContract,
  biteContract,
  corgibCoinContract,
  pwarCoinContract,
  clf365Contract,
  erc20TokenContract,
} from "../contracts/connections";
import { bscNetwork, currentConnection, etheriumNetwork, harmonyNetwork, maticNetwork, tokenContarctAddresses } from "../constants";
import account from "../reducers/account";

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
          payload: "BITE",
        });

        if (network === etheriumNetwork) {
          // console.log("connectWallet: fetching from", network);
          const [pbrWei, biteWei, cl365Wei, punWei, shoeWei] = await Promise.all([
            erc20TokenContract(
              network,
              currentConnection === 'testnet'
                ? tokenContarctAddresses.PBR.ethereum.testnet
                : tokenContarctAddresses.PBR.ethereum.mainnet
            ).methods.balanceOf(accountAddress).call(),
            erc20TokenContract(
              network,
              currentConnection === 'testnet'
                ? tokenContarctAddresses.BITE.ethereum.testnet
                : tokenContarctAddresses.BITE.ethereum.mainnet
            ).methods.balanceOf(accountAddress).call(),
            erc20TokenContract(
              network,
              currentConnection === 'testnet'
                ? tokenContarctAddresses.CFL365.ethereum.testnet
                : tokenContarctAddresses.CFL365.ethereum.mainnet
            ).methods.balanceOf(accountAddress).call(),
            erc20TokenContract(
              network,
              currentConnection === 'testnet'
                ? tokenContarctAddresses.PUN.ethereum.testnet
                : tokenContarctAddresses.PUN.ethereum.mainnet
            ).methods.balanceOf(accountAddress).call(),
            erc20TokenContract(
              network,
              currentConnection === 'testnet'
                ? tokenContarctAddresses.SHOE.ethereum.testnet
                : tokenContarctAddresses.SHOE.ethereum.mainnet
            ).methods.balanceOf(accountAddress).call()

          ]);
          dispatch({
            type: LOAD_BALANCE,
            payload: { pbr: pbrWei, bite: biteWei, clf365: cl365Wei, pun: punWei, shoe: shoeWei },
          });
        } else if (network === maticNetwork) {
          // console.log("connectWallet: fetching from", network);
          const [pbrWei] = await Promise.all([
            pbrContract(network).methods.balanceOf(accountAddress).call(),
          ]);
          dispatch({
            type: LOAD_BALANCE,
            payload: { pbr: pbrWei },
          });
        } else if (network === harmonyNetwork) {
          // console.log("connectWallet: fetching from", network);
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

export const getAccountBalance = (address, network) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  try {
    // const address = await getCurrentAccount();
    if (network === etheriumNetwork) {
      // console.log("getAccountBalance: fetching from ethereum network", network);
      const [pbrWei, biteWei, cl365Wei, punWei, shoeWei] = await Promise.all([
        erc20TokenContract(
          network,
          currentConnection === 'testnet'
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PBR.ethereum.mainnet
        ).methods.balanceOf(account).call(),
        erc20TokenContract(
          network,
          currentConnection === 'testnet'
            ? tokenContarctAddresses.BITE.ethereum.testnet
            : tokenContarctAddresses.BITE.ethereum.mainnet
        ).methods.balanceOf(account).call(),
        erc20TokenContract(
          network,
          currentConnection === 'testnet'
            ? tokenContarctAddresses.CFL365.ethereum.testnet
            : tokenContarctAddresses.CFL365.ethereum.mainnet
        ).methods.balanceOf(account).call(),
        erc20TokenContract(
          network,
          currentConnection === 'testnet'
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PUN.ethereum.mainnet
        ).methods.balanceOf(account).call(),
        erc20TokenContract(
          network,
          currentConnection === 'testnet'
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.SHOE.ethereum.mainnet
        ).methods.balanceOf(account).call()
      ]);

      dispatch({
        type: LOAD_BALANCE,
        payload: { pbr: pbrWei, bite: biteWei, clf365: cl365Wei, pun: punWei, shoe: shoeWei },
      });
    } else if (network === maticNetwork) {
      // console.log("getAccountBalance: fetching from matic network", network);
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
    } else {// fetch only pbr balance on polygon and ethereum network
      const [pbrWei] = await Promise.all([
        pbrContract(network).methods.balanceOf(address).call(),
      ]);

      dispatch({
        type: LOAD_BALANCE,
        payload: { pbr: pbrWei },
      });
    }
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
