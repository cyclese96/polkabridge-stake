import axios from "axios";
import {
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  LOAD_BALANCE,
  LOAD_PBR_MARKET_DATA,
  LOAD_STAKE_POOL,
  ALLOWANCE_UPDATE,
  GET_USER_STAKE_DATA,
} from "./types";

import { stakeContract, erc20TokenContract } from "../contracts/connections";
import { toWei, getCurrentAccount, getApy } from "../utils/helper";
import BigNumber from "bignumber.js";
import config from "../config";
import {
  AOG,
  poolId,
  tokenContarctAddresses,
  stakeContractAdrresses,
  STAKE_ADDRESSES,
} from "../constants";

// Note: these functions has been depricated
export const fetchPbrMarketData = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      config.coingecko +
        "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=true"
    );

    const pbrObj = {};

    pbrObj.tokenPrice = data.polkabridge ? data.polkabridge.usd : "---";
    pbrObj.mCap = data.polkabridge ? data.polkabridge.usd_market_cap : "---";
    pbrObj.change = data.polkabridge ? data.polkabridge.usd_24h_change : "---";

    dispatch({
      type: LOAD_PBR_MARKET_DATA,
      payload: pbrObj,
    });
  } catch (error) {
    console.log("fetchPbrMarketData", { error });
  }
};

const getTokenBalance = async (tokenContract, account) => {
  try {
    const balance = await tokenContract.methods.balanceOf(account).call();
    return balance;
  } catch (error) {
    console.log("getTokenBalance ", error);
    return 0;
  }
};

export const getPoolInfo =
  (tokenSymbol, pid, account, network) => async (dispatch) => {
    try {
      if (!tokenSymbol) {
        return;
      }

      const currStakingContract = stakeContract(network);
      const tokenAddress = tokenContarctAddresses?.[network]?.[tokenSymbol];
      const tokenContract = erc20TokenContract(network, tokenAddress);

      const [poolInfo, tokenPrice, tokenBalance] = await Promise.all([
        currStakingContract.methods.getPoolInfo(pid).call(),
        // fetchTokenPrice(tokenSymbol),
        getTokenBalance(tokenContract, account),
      ]);
      const poolObj = {
        accTokenPerShare: poolInfo[0],
        lastRewardBlock: poolInfo[1],
        rewardPerBlock: poolInfo[2],
        totalTokenStaked: poolInfo[3],
        totalTokenClaimed: poolInfo[4],
      };

      poolObj.tokenPrice = tokenPrice;
      const apy = getApy(tokenSymbol, poolObj, network);
      poolObj.apy = apy;

      const poolState = {};
      poolState[tokenSymbol] = poolObj;

      dispatch({
        type: LOAD_STAKE_POOL,
        payload: poolState,
      });

      const balanceObject = {};
      balanceObject[tokenSymbol] = tokenBalance;
      dispatch({
        type: LOAD_BALANCE,
        payload: balanceObject,
      });
    } catch (error) {
      console.log("getPoolInfo  ", { error, tokenSymbol, network, pid });
    }
  };

export const checkAllowance =
  (tokenSymbol, account, network) => async (dispatch) => {
    try {
      if (!account) {
        return;
      }

      const stakeContractAddress = stakeContractAdrresses?.[network];

      const tokenAddress = tokenContarctAddresses?.[network]?.[tokenSymbol];
      const currTokenContract = erc20TokenContract(network, tokenAddress);

      const allowance = await currTokenContract.methods
        .allowance(account, stakeContractAddress)
        .call();

      const apprObj = {};
      if (new BigNumber(allowance).gt(0)) {
        apprObj[tokenSymbol] = true;
      } else {
        apprObj[tokenSymbol] = false;
      }

      dispatch({
        type: ALLOWANCE_UPDATE,
        payload: apprObj,
      });
    } catch (error) {
      dispatch({
        type: ERROR,
        payload: "Alowance Error!",
      });
    }
  };

export const confirmAllowance =
  (balance, tokenType, tokenContract, account, chainId) => async (dispatch) => {
    try {
      const loadingObj = {};
      loadingObj[`${tokenType}`] = true;
      dispatch({
        type: SHOW_LOADING,
        payload: loadingObj,
      });

      const stakeContractAddress = STAKE_ADDRESSES?.[chainId];

      await tokenContract.approve(stakeContractAddress, balance);

      const apprObj = {};
      apprObj[tokenType] = true;
      dispatch({
        type: ALLOWANCE_UPDATE,
        payload: apprObj,
      });
    } catch (error) {
      console.log("confirmAllowance ", { error, tokenType });
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };

export const getUserStakedData =
  (tokenType, network, library) => async (dispatch) => {
    const loadingObj = {};
    loadingObj[`${tokenType}`] = true;
    dispatch({
      type: SHOW_LOADING,
      payload: loadingObj,
    });

    try {
      const account = await getCurrentAccount();

      const tokenAddress = tokenContarctAddresses?.[network]?.[tokenType];
      const tokenContract = erc20TokenContract(network, tokenAddress, library);

      const pool = poolId[tokenType];
      const currStakeContract = stakeContract(network, library);

      const allowance = await tokenContract
        .allowance(account, currStakeContract._address)
        .call();

      const apprObj = {};
      if (new BigNumber(allowance).gt(0)) {
        apprObj[tokenType] = true;
      } else {
        apprObj[tokenType] = false;
      }

      dispatch({
        type: ALLOWANCE_UPDATE,
        payload: apprObj,
      });

      const [stakedData, pendingReward] = await Promise.all([
        currStakeContract?.estimateGas.userInfo(pool, account),
        currStakeContract?.estimateGas?.pendingReward(pool, account),
      ]);

      const stakeObj = {};

      stakeObj[tokenType] = {
        amount: stakedData.amount,
        rewardClaimed: stakedData.rewardClaimed,
        pendingReward: pendingReward,
      };

      dispatch({
        type: GET_USER_STAKE_DATA,
        payload: stakeObj,
      });
    } catch (error) {
      dispatch({
        type: ERROR,
        payload: "Failed to update balance",
      });
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };

export const stakeTokens =
  (tokens, account, tokenType, chainId, stakeContract) => async (dispatch) => {
    const loadingObj = {};
    loadingObj[`${tokenType}`] = true;
    dispatch({
      type: SHOW_LOADING,
      payload: loadingObj,
    });
    const depositTokens = toWei(tokens, "ether");

    const pool = poolId[tokenType];

    try {
      // const tokenAddress = tokenContarctAddresses?.[network]?.[tokenType];
      // const currTokenContract = erc20TokenContract(network, tokenAddress);
      // const currStakeContract = stakeContract(network);
      let callback;
      if (chainId?.toString() === "137") {
        // set gas for polygon
        callback = await stakeContract.deposit(pool, depositTokens);
        // .send({ from: account, gasPrice: 100000000000 });
      } else {
        callback = await stakeContract.deposit(pool, depositTokens);
        // .send({ from: account });
      }

      // const [balanceWei, stakedData, pendingReward] = await Promise.all([
      //   currTokenContract.methods.balanceOf(account).call(),
      //   currStakeContract.methods.userInfo(pool, account).call(),
      //   currStakeContract.methods.pendingReward(pool, account).call(),
      // ]);

      // const balanceObj = {};
      // balanceObj[`${tokenType}`] = balanceWei;
      // dispatch({
      //   type: LOAD_BALANCE,
      //   payload: balanceObj,
      // });

      // const stakeObj = {};
      // stakeObj[tokenType] = {
      //   amount: stakedData.amount,
      //   rewardClaimed: stakedData.rewardClaimed,
      //   pendingReward: pendingReward,
      // };
      // dispatch({
      //   type: GET_USER_STAKE_DATA,
      //   payload: stakeObj,
      // });
    } catch (error) {
      console.log("stake error ", error);
      // dispatch({
      //   type: ERROR,
      //   payload: network === bscNetwork ? error.message : error,
      // });
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };

export const unstakeTokens =
  (tokens, account, tokenType, chainId, stakeContract) => async (dispatch) => {
    const loadingObj = {};
    loadingObj[`${tokenType}`] = true;
    dispatch({
      type: SHOW_LOADING,
      payload: loadingObj,
    });

    const depositTokens = toWei(tokens, "ether");
    const pool = poolId[tokenType];
    let stakeCallback;
    try {
      if (chainId?.toString() === "137") {
        stakeCallback = await stakeContract.withdraw(pool, depositTokens);
        // .send({ from: account, gasPrice: 100000000000 });
      } else {
        if (tokenType === AOG) {
          stakeCallback = await stakeContract.emergencyWithdraw(pool);
          // .send({ from: account });
        } else {
          stakeCallback = await stakeContract.withdraw(pool, depositTokens);
          // .send({ from: account });
        }
      }
    } catch (error) {
      console.log("unstake error ", error);
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };
