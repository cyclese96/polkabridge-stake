import axios from "axios";
import {
  LOAD_PPOL_INFO,
  APPROVE_TOKENS,
  STAKE_TOKENS,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  LOAD_BALANCE,
  SHOW_POOL_LOADING,
  HIDE_POOL_LOADING,
  DISAPPROVE_TOKENS,
} from "./types";

import stakeContract from "../contracts/connections/stakeConnection";
import pbrContract from "../contracts/connections/pbrConnection";
import { fromWei, toWei, getCurrentAccount } from "../utils/helper";
import BigNumber from "bignumber.js";
import config from "../config";

const POOL_ID = 0;

//GET all characters
export const getPoolInfo = () => async (dispatch) => {
  dispatch({
    type: SHOW_POOL_LOADING,
  });
  try {
    // console.log('g')
    const pool = await stakeContract.methods.getPoolInfo(POOL_ID).call();
    // console.log(pool);
    const poolObj = {
      accTokenPerShare: pool[0],
      lastRewardBlock: pool[1],
      rewardPerBlock: pool[2],
      totalTokenStaked: pool[3],
      totalTokenClaimed: pool[4],
    };
    const { data } = await axios.get(
      config.coingecko +
        "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
    );

    poolObj.tokenPrice = data.polkabridge ? data.polkabridge.usd : "---";

    const NUMBER_BLOCKS_PER_YEAR = 2400000;
    const avg_pbr_perblock = 1.5;

    let tokenPrice = new BigNumber(poolObj.tokenPrice);
    const total_value_locked_usd = tokenPrice.times(
      new BigNumber(fromWei(poolObj.totalTokenStaked))
    );
    const apy = tokenPrice
      .times(new BigNumber(NUMBER_BLOCKS_PER_YEAR))
      .times(new BigNumber(avg_pbr_perblock))
      .div(total_value_locked_usd)
      .times(100)
      .toFixed(1)
      .toString();

    poolObj.apy = apy;

    dispatch({
      type: LOAD_PPOL_INFO,
      payload: poolObj,
    });
  } catch (error) {
    console.log("pool info: ", error);
    dispatch({
      type: ERROR,
      payload: "Failed to load Pool data!",
    });
  }
  dispatch({
    type: HIDE_POOL_LOADING,
  });
};

export const checkAllowance = (account) => async (dispatch) => {
  try {
    if (!account) {
      return;
    }

    const allowance = await pbrContract.methods
      .allowance(account, stakeContract._address)
      .call();

    if (new BigNumber(allowance).gt(0)) {
      dispatch({
        type: APPROVE_TOKENS,
      });
    }
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Alowance Error!",
    });
  }
};

export const confirmAllowance = (balance) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
    });
    const account = await getCurrentAccount();
    const res = await pbrContract.methods
      .approve(stakeContract._address, balance)
      .send({ from: account });

    dispatch({
      type: APPROVE_TOKENS,
    });
  } catch (error) {
    console.log("confirmAllowance ", error);
    dispatch({
      type: ERROR,
      payload: error.toString(),
    });
  }
  dispatch({
    type: HIDE_LOADING,
  });
};

export const getUserStakedData = () => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });

  try {
    const account = await getCurrentAccount();

    const allowance = await pbrContract.methods
      .allowance(account, stakeContract._address)
      .call();

    if (new BigNumber(allowance).gt(0)) {
      dispatch({
        type: APPROVE_TOKENS,
      });
    } else {
      dispatch({
        type: DISAPPROVE_TOKENS,
      });
      dispatch({
        type: HIDE_LOADING,
      });
      return;
    }

    const stakedData = await stakeContract.methods.userInfo(0, account).call();

    const pendingReward = await stakeContract.methods
      .pendingReward(0, account)
      .call();

    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };
    dispatch({
      type: STAKE_TOKENS,
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
  });
};

export const stakeTokens = (tokens, account) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });
  const depositTokens = toWei(tokens, "ether");

  try {
    const res = await stakeContract.methods
      .deposit(POOL_ID, depositTokens)
      .send({ from: account });

    const pbrWei = await pbrContract.methods.balanceOf(account).call();

    dispatch({
      type: LOAD_BALANCE,
      payload: pbrWei,
    });

    const stakedData = await stakeContract.methods.userInfo(0, account).call();

    const pendingReward = await stakeContract.methods
      .pendingReward(0, account)
      .call();

    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };
    dispatch({
      type: STAKE_TOKENS,
      payload: stakeObj,
    });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Failed to stake tokens",
    });
  }
  dispatch({
    type: HIDE_LOADING,
  });
};

export const unstakeTokens = (tokens, account) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
  });

  const depositTokens = toWei(tokens, "ether");

  try {
    const res = await stakeContract.methods
      .withdraw(POOL_ID, depositTokens)
      .send({ from: account });

    const pbrWei = await pbrContract.methods.balanceOf(account).call();

    dispatch({
      type: LOAD_BALANCE,
      payload: pbrWei,
    });

    const stakedData = await stakeContract.methods.userInfo(0, account).call();

    const pendingReward = await stakeContract.methods
      .pendingReward(0, account)
      .call();

    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };
    dispatch({
      type: STAKE_TOKENS,
      payload: stakeObj,
    });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Failed to stake tokens",
    });
  }
  dispatch({
    type: HIDE_LOADING,
  });
};
