import axios from "axios";
import {
  LOAD_PPOL_INFO,
  APPROVE_BITE_TOKENS,
  APPROVE_PBR_TOKENS,
  ERROR,
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_POOL_LOADING,
  HIDE_POOL_LOADING,
  RESET_PBR_TOKEN,
  STAKE_PBR_TOKENS,
  RESET_BITE_TOKEN,
  STAKE_BITE_TOKENS,
  LOAD_PBR_BALANCE,
  LOAD_BITE_BALANCE,

} from "./types";

import { biteContract, pbrContract, stakeContract } from '../contracts/connections'
import { toWei, getCurrentAccount, getApy } from "../utils/helper";
import BigNumber from "bignumber.js";
import config from "../config";
import { BITE_PRICE, etheriumNetwork, poolId } from "../constants";


//GET all characters
export const getPoolInfo = (network = etheriumNetwork) => async (dispatch) => {
  dispatch({
    type: SHOW_POOL_LOADING,
  });
  try {
    // console.log('g')
    const [pbrPool, bitePool] = await Promise.all([
      stakeContract(network).methods.getPoolInfo(0).call(),
      stakeContract(network).methods.getPoolInfo(1).call()
    ])

    const pbrPoolObj = {
      accTokenPerShare: pbrPool[0],
      lastRewardBlock: pbrPool[1],
      rewardPerBlock: pbrPool[2],
      totalTokenStaked: pbrPool[3],
      totalTokenClaimed: pbrPool[4],
    };
    const { data } = await axios.get(
      config.coingecko +
      "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
    );

    pbrPoolObj.tokenPrice = data.polkabridge ? data.polkabridge.usd : "---";


    const pbrApy = getApy('PBR', pbrPoolObj)
    pbrPoolObj.pbrApy = pbrApy;

    // bite pool calculations
    const bitePoolObj = {
      accTokenPerShare: bitePool[0],
      lastRewardBlock: bitePool[1],
      rewardPerBlock: bitePool[2],
      totalTokenStaked: bitePool[3],
      totalTokenClaimed: bitePool[4],
    }
    bitePoolObj.tokenPrice = BITE_PRICE
    bitePoolObj.biteApy = getApy('BITE', bitePoolObj)


    dispatch({
      type: LOAD_PPOL_INFO,
      payload: { pbr: pbrPoolObj, bite: bitePoolObj },
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

export const checkAllowance = (account, network = etheriumNetwork) => async (dispatch) => {
  try {
    if (!account) {
      return;
    }

    const [pbrAllowance, biteAllowance] = await Promise.all([
      pbrContract(network).methods
        .allowance(account, stakeContract(network)._address)
        .call(),
      biteContract(network).methods
        .allowance(account, stakeContract(network)._address)
        .call()
    ])


    if (new BigNumber(pbrAllowance).gt(0)) {
      dispatch({
        type: APPROVE_PBR_TOKENS,
      });
    }
    if (new BigNumber(biteAllowance).gt(0)) {
      dispatch({
        type: APPROVE_BITE_TOKENS,
      });
    }
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Alowance Error!",
    });
  }
};

export const confirmAllowance = (balance, tokenType, network = etheriumNetwork) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: tokenType
    });
    const account = await getCurrentAccount();
    const contract = tokenType === 'PBR' ? pbrContract(network) : biteContract(network)
    const res = await contract.methods
      .approve(stakeContract(network)._address, balance)
      .send({ from: account });

    dispatch({
      type: tokenType === 'PBR' ? APPROVE_PBR_TOKENS : APPROVE_BITE_TOKENS,
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
    payload: tokenType
  });
};

export const getUserStakedData = (tokenType, network = etheriumNetwork) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
    payload: tokenType
  });

  try {
    const account = await getCurrentAccount();

    const contract = tokenType === 'PBR' ? pbrContract(network) : biteContract(network);
    const pool = poolId[tokenType]

    const allowance = await contract.methods
      .allowance(account, stakeContract(network)._address)
      .call();

    if (new BigNumber(allowance).gt(0)) {
      dispatch({
        type: tokenType === 'PBR' ? APPROVE_PBR_TOKENS : APPROVE_BITE_TOKENS,
      });
    } else {
      dispatch({
        type: tokenType === 'PBR' ? RESET_PBR_TOKEN : RESET_BITE_TOKEN
      });
      dispatch({
        type: HIDE_LOADING,
      });
      return;
    }

    const [stakedData, pendingReward] = await Promise.all([
      stakeContract(network).methods.userInfo(pool, account).call(),
      stakeContract(network).methods.pendingReward(pool, account).call()
    ])


    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };
    dispatch({
      type: tokenType === 'PBR' ? STAKE_PBR_TOKENS : STAKE_BITE_TOKENS,
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
    payload: tokenType
  });
};

export const stakeTokens = (tokens, account, tokenType, network = etheriumNetwork) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
    payload: tokenType
  });
  const depositTokens = toWei(tokens, "ether");

  const pool = poolId[tokenType]

  try {
    const res = await stakeContract(network).methods
      .deposit(pool, depositTokens)
      .send({ from: account });

    const currTokenContract = tokenType === 'PBR' ? pbrContract(network) : biteContract(network);

    const [balanceWei, stakedData, pendingReward] = await Promise.all([
      currTokenContract.methods.balanceOf(account).call(),
      stakeContract(network).methods.userInfo(pool, account).call(),
      stakeContract(network).methods.pendingReward(pool, account).call()
    ])


    dispatch({
      type: tokenType === 'PBR' ? LOAD_PBR_BALANCE : LOAD_BITE_BALANCE,
      payload: balanceWei
    });


    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };
    dispatch({
      type: tokenType === 'PBR' ? STAKE_PBR_TOKENS : STAKE_BITE_TOKENS,
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
    payload: tokenType
  });
};

export const unstakeTokens = (tokens, account, tokenType, network = etheriumNetwork) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
    payload: tokenType
  });

  const depositTokens = toWei(tokens, "ether");
  const pool = poolId[tokenType]
  const currStakeContract = stakeContract(network)
  const currTokenContract = tokenType === 'PBR' ? pbrContract(network) : biteContract(network);


  try {
    const res = await currStakeContract.methods
      .withdraw(pool, depositTokens)
      .send({ from: account });

    const [balanceWei, stakedData, pendingReward] = await Promise.all([
      currTokenContract.methods.balanceOf(account).call(),
      currStakeContract.methods.userInfo(pool, account).call(),
      currStakeContract.methods.pendingReward(pool, account).call()
    ])

    dispatch({
      type: tokenType === 'PBR' ? LOAD_PBR_BALANCE : LOAD_BITE_BALANCE,
      payload: balanceWei,
    });

    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };

    dispatch({
      type: tokenType === 'PBR' ? STAKE_PBR_TOKENS : STAKE_BITE_TOKENS,
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
    payload: tokenType
  });
};
