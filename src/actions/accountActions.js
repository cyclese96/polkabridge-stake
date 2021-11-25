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
  // corgibCoinContract,
  // pwarCoinContract,
  erc20TokenContract,
} from "../contracts/connections";
import {
  bscNetwork,
  currentConnection,
  etheriumNetwork,
  harmonyNetwork,
  maticNetwork,
  tokenContarctAddresses,
} from "../constants";
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
              currentConnection === "testnet"
                ? tokenContarctAddresses.PBR.ethereum.testnet
                : tokenContarctAddresses.PBR.ethereum.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.BITE.ethereum.testnet
                : tokenContarctAddresses.BITE.ethereum.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.CFL365.ethereum.testnet
                : tokenContarctAddresses.CFL365.ethereum.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.PUN.ethereum.testnet
                : tokenContarctAddresses.PUN.ethereum.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.SHOE.ethereum.testnet
                : tokenContarctAddresses.SHOE.ethereum.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
          ]);
          const balanceObject = {};
          balanceObject.PBR = pbrWei;
          balanceObject.BITE = biteWei;
          balanceObject.CFL365 = cl365Wei;
          balanceObject.PUN = punWei;
          balanceObject.SHOE = shoeWei;

          dispatch({
            type: LOAD_BALANCE,
            payload: balanceObject,
          });
        } else if (network === maticNetwork) {
          // console.log("connectWallet: fetching from", network);
          const [pbrWei, weltWei] = await Promise.all([
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.PBR.polygon.testnet
                : tokenContarctAddresses.PBR.polygon.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.WELT.polygon.testnet
                : tokenContarctAddresses.WELT.polygon.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
          ]);
          const balanceObj = {};
          balanceObj.PBR = pbrWei;
          balanceObj.WELT = weltWei;
          dispatch({
            type: LOAD_BALANCE,
            payload: balanceObj,
          });
        } else if (network === harmonyNetwork) {
          // console.log("connectWallet: fetching from", network);
          const [pbrWei] = await Promise.all([
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.PBR.harmony.testnet
                : tokenContarctAddresses.PBR.harmony.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
          ]);
          const balObj = {};
          balObj.PBR = pbrWei;
          dispatch({
            type: LOAD_BALANCE,
            payload: balObj,
          });
        } else {
          const [corgibWei, pwarWei] = await Promise.all([
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.CORGIB.bsc.testnet
                : tokenContarctAddresses.CORGIB.bsc.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
            erc20TokenContract(
              network,
              currentConnection === "testnet"
                ? tokenContarctAddresses.PWAR.bsc.testnet
                : tokenContarctAddresses.PWAR.bsc.mainnet
            )
              .methods.balanceOf(accountAddress)
              .call(),
          ]);

          const balObj = {};
          balObj.PWAR = pwarWei;
          balObj.CORGIB = corgibWei;
          dispatch({
            type: LOAD_BALANCE,
            payload: balObj,
          });
          // dispatch({
          //   type: LOAD_CORGIB_BALANCE,
          //   payload: corgibWei,
          // });
          // dispatch({
          //   type: LOAD_PWAR_BALANCE,
          //   payload: pwarWei,
          // });
        }

        // await updateAcountData();
      } catch (error) {
        console.log("connectWallet ", error);
        dispatch({
          type: ERROR,
          payload: "Failed to connect Meta Mask!",
        });
        // dispatch({
        //   type: LOAD_CORGIB_BALANCE,
        //   payload: corgibWei,
        // });
        // dispatch({
        //   type: LOAD_PWAR_BALANCE,
        //   payload: pwarWei,
        // });
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
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PBR.ethereum.mainnet
        )
          .methods.balanceOf(account)
          .call(),
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.BITE.ethereum.testnet
            : tokenContarctAddresses.BITE.ethereum.mainnet
        )
          .methods.balanceOf(address)
          .call(),
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.CFL365.ethereum.testnet
            : tokenContarctAddresses.CFL365.ethereum.mainnet
        )
          .methods.balanceOf(address)
          .call(),
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PUN.ethereum.mainnet
        )
          .methods.balanceOf(address)
          .call(),
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.SHOE.ethereum.mainnet
        )
          .methods.balanceOf(address)
          .call(),
      ]);

      const balanceObject = {};
      balanceObject.PBR = pbrWei;
      balanceObject.BITE = biteWei;
      balanceObject.CFL365 = cl365Wei;
      balanceObject.PUN = punWei;
      balanceObject.SHOE = shoeWei;

      dispatch({
        type: LOAD_BALANCE,
        payload: balanceObject,
      });
    } else if (network === maticNetwork) {
      const [pbrWei, weltWei, welt_usdcWei] = await Promise.all([
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.polygon.testnet
            : tokenContarctAddresses.PBR.polygon.mainnet
        )
          .methods.balanceOf(address)
          .call(),
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.WELT.polygon.testnet
            : tokenContarctAddresses.WELT.polygon.mainnet
        )
          .methods.balanceOf(address)
          .call(),
      ]);
      const balanceObj = {};
      balanceObj.PBR = pbrWei;
      balanceObj.WELT = weltWei;
      balanceObj.WELT = welt_usdcWei;
      dispatch({
        type: LOAD_BALANCE,
        payload: balanceObj,
      });
    } else if (network === bscNetwork) {
      // console.log('account', address)
      // console.log('network', network)
      const [corgibWei, pwarWei] = await Promise.all([
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.CORGIB.bsc.testnet
            : tokenContarctAddresses.CORGIB.bsc.mainnet
        )
          .methods.balanceOf(address)
          .call(),

        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PWAR.bsc.testnet
            : tokenContarctAddresses.PWAR.bsc.mainnet
        )
          .methods.balanceOf(address)
          .call(),
      ]);

      const balObj = {};
      balObj.PWAR = pwarWei;
      balObj.CORGIB = corgibWei;
      dispatch({
        type: LOAD_BALANCE,
        payload: balObj,
      });

    } else {
      // fetch only pbr balance on polygon and ethereum network
      const [pbrWei] = await Promise.all([
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PBR.ethereum.mainnet
        )
          .methods.balanceOf(address)
          .call(),
      ]);
      const balanceObj = {};
      balanceObj.PBR = pbrWei;
      dispatch({
        type: LOAD_BALANCE,
        payload: balanceObj,
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
