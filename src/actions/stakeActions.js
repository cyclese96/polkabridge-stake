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
  APPROVE_CORGIB_TOKENS,
  RESET_CORGIB_TOKEN,
  STAKE_CORGIB_TOKENS,
  LOAD_CORGIB_BALANCE,
  LOAD_BSC_POOL,
  APPROVE_PWAR_TOKENS,
  LOAD_PWAR_BALANCE,
  STAKE_PWAR_TOKENS,
  RESET_PWAR_TOKEN,
  APPROVE_CLF365_TOKENS,
  RESET_CLF365_TOKEN,
  STAKE_CLF365_TOKENS,
  LOAD_CLF365_BALANCE,
} from "./types";

import {
  biteContract,
  corgibCoinContract,
  pbrContract,
  stakeContract,
  pwarCoinContract,
  clf365Contract,
} from "../contracts/connections";
import {
  toWei,
  getCurrentAccount,
  getApy,
  getNetworkBalance,
} from "../utils/helper";
import BigNumber from "bignumber.js";
import config from "../config";
import {
  BITE,
  BITE_PRICE,
  bscNetwork,
  CLF365,
  CORGIB,
  etheriumNetwork,
  PBR,
  poolId,
  PWAR,
  PWAR_PRICE,
} from "../constants";

// current token contract
const getTokenContract = (network, tokenType) => {
  switch (tokenType) {
    case PBR:
      return pbrContract(network);
    case BITE:
      return biteContract(network);
    case CORGIB:
      return corgibCoinContract(network);
    case PWAR:
      return pwarCoinContract(network);
    case CLF365:
      return clf365Contract(network);
    default:
      return clf365Contract(network);
  }
};

const tokenToApprove = (tokenType) => {
  switch (tokenType) {
    case PBR:
      return APPROVE_PBR_TOKENS;
    case BITE:
      return APPROVE_BITE_TOKENS;
    case CORGIB:
      return APPROVE_CORGIB_TOKENS;
    case PWAR:
      return APPROVE_PWAR_TOKENS;
    case CLF365:
      return APPROVE_CLF365_TOKENS;
    default:
      return APPROVE_CLF365_TOKENS;
  }
};

const tokenToReset = (tokenType) => {
  switch (tokenType) {
    case PBR:
      return RESET_PBR_TOKEN;
    case BITE:
      return RESET_BITE_TOKEN;
    case CORGIB:
      return RESET_CORGIB_TOKEN;
    case PWAR:
      return RESET_PWAR_TOKEN;
    case CLF365:
      return RESET_CLF365_TOKEN;
    default:
      return RESET_CLF365_TOKEN;
  }
};

const tokenToStake = (tokenType) => {
  switch (tokenType) {
    case PBR:
      return STAKE_PBR_TOKENS;
    case BITE:
      return STAKE_BITE_TOKENS;
    case CORGIB:
      return STAKE_CORGIB_TOKENS;
    case PWAR:
      return STAKE_PWAR_TOKENS;
    case CLF365:
      return STAKE_CLF365_TOKENS;
    default:
      return STAKE_CLF365_TOKENS;
  }
};

const tokenToLoad = (tokenType) => {
  switch (tokenType) {
    case PBR:
      return LOAD_PBR_BALANCE;
    case BITE:
      return LOAD_BITE_BALANCE;
    case CORGIB:
      return LOAD_CORGIB_BALANCE;
    case PWAR:
      return LOAD_PWAR_BALANCE;
    case CLF365:
      return LOAD_CLF365_BALANCE;
    default:
      return LOAD_CLF365_BALANCE;
  }
};

//GET all characters
export const getPoolInfo = (network) => async (dispatch) => {
  dispatch({
    type: SHOW_POOL_LOADING,
  });
  try {
    const currStakingContract = stakeContract(network);

    if (network === etheriumNetwork) {
      // console.log('g')
      const [pbrPool, bitePool] = await Promise.all([
        currStakingContract.methods.getPoolInfo(poolId.PBR).call(),
        currStakingContract.methods.getPoolInfo(poolId.BITE).call(),
        //todo :set pool
      ]);

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

      const pbrApy = getApy("PBR", pbrPoolObj);
      pbrPoolObj.pbrApy = pbrApy;

      // bite pool calculations
      const bitePoolObj = {
        accTokenPerShare: bitePool[0],
        lastRewardBlock: bitePool[1],
        rewardPerBlock: bitePool[2],
        totalTokenStaked: bitePool[3],
        totalTokenClaimed: bitePool[4],
      };
      bitePoolObj.tokenPrice = BITE_PRICE;
      bitePoolObj.biteApy = getApy("BITE", bitePoolObj);

      dispatch({
        type: LOAD_PPOL_INFO,
        payload: { pbr: pbrPoolObj, bite: bitePoolObj },
      });
    } else {
      // fetch pool for corgib on bsc
      const [corgibPoolData, pwarPoolData] = await Promise.all([
        currStakingContract.methods.getPoolInfo(poolId.CORGIB).call(),
        currStakingContract.methods.getPoolInfo(poolId.PWAR).call(),
      ]);

      // console.log('pool data', corgibPool)
      //prepare corgib Pool
      const poolObj = {
        accTokenPerShare: corgibPoolData[0],
        lastRewardBlock: corgibPoolData[1],
        rewardPerBlock: corgibPoolData[2],
        totalTokenStaked: corgibPoolData[3],
        totalTokenClaimed: corgibPoolData[4],
      };
      const { data } = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=the-corgi-of-polkabridge&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );

      poolObj.tokenPrice = data["the-corgi-of-polkabridge"]
        ? data["the-corgi-of-polkabridge"].usd
        : "---";
      const corgibApy = getApy("CORGIB", poolObj);
      poolObj.corgibApy = corgibApy;

      //prepare pwar Pool
      const pwarPoolObj = {
        accTokenPerShare: pwarPoolData[0],
        lastRewardBlock: pwarPoolData[1],
        rewardPerBlock: pwarPoolData[2],
        totalTokenStaked: pwarPoolData[3],
        totalTokenClaimed: pwarPoolData[4],
      };

      pwarPoolObj.tokenPrice = PWAR_PRICE;
      const pwarApy = getApy("PWAR", pwarPoolObj);
      console.log("pwarapy", pwarApy);
      pwarPoolObj.pwarApy = pwarApy;

      console.log("final PWAR pool data", pwarPoolObj);
      dispatch({
        type: LOAD_BSC_POOL,
        payload: { corgib: poolObj, pwar: pwarPoolObj },
      });
    }
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

export const checkAllowance = (account, network) => async (dispatch) => {
  try {
    if (!account) {
      return;
    }

    const currStakingContract = stakeContract(network);

    if (network === etheriumNetwork) {
      const [pbrAllowance, biteAllowance, cl365Allowance] = await Promise.all([
        pbrContract(network)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        biteContract(network)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        clf365Contract(network)
          .methods.allowance(account, currStakingContract._address)
          .call(),
      ]);

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
      if (new BigNumber(cl365Allowance).gt(0)) {
        dispatch({
          type: APPROVE_CLF365_TOKENS,
        });
      }
    } else {
      // bsc network
      const [corgibAllowance, pwarAllowance] = await Promise.all([
        corgibCoinContract(network)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        pwarCoinContract(network)
          .methods.allowance(account, currStakingContract._address)
          .call(),
      ]);

      if (new BigNumber(corgibAllowance).gt(0)) {
        dispatch({
          type: APPROVE_CORGIB_TOKENS,
        });
      } else if (new BigNumber(pwarAllowance).gt(0)) {
        dispatch({
          type: APPROVE_CORGIB_TOKENS,
        });
      }
    }
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Alowance Error!",
    });
  }
};

export const confirmAllowance =
  (balance, tokenType, network, account) => async (dispatch) => {
    try {
      dispatch({
        type: SHOW_LOADING,
        payload: tokenType,
      });
      // const account = await getCurrentAccount();
      const tokenContract = getTokenContract(network, tokenType);
      const stakingContract = stakeContract(network);

      const res = await tokenContract.methods
        .approve(stakingContract._address, balance)
        .send({ from: account });

      dispatch({
        type: tokenToApprove(tokenType),
      });

      // console.log('allowance confirmed ', res)
    } catch (error) {
      // console.log("confirmAllowance ", error);
      dispatch({
        type: ERROR,
        payload: network === bscNetwork ? error.message : error,
      });
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };

export const getUserStakedData = (tokenType, network) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
    payload: tokenType,
  });

  try {
    const account = await getCurrentAccount();

    const tokenContract = getTokenContract(network, tokenType);
    const pool = poolId[tokenType];
    const currStakeContract = stakeContract(network);

    const allowance = await tokenContract.methods
      .allowance(account, currStakeContract._address)
      .call();

    console.log({ tokenType, allowance });
    if (new BigNumber(allowance).gt(0)) {
      console.log({ approving: tokenType });
      dispatch({
        type: tokenToApprove(tokenType),
      });
    } else {
      dispatch({
        type: tokenToReset(tokenType),
      });
      dispatch({
        type: HIDE_LOADING,
      });
      return;
    }

    const [stakedData, pendingReward] = await Promise.all([
      currStakeContract.methods.userInfo(pool, account).call(),
      currStakeContract.methods.pendingReward(pool, account).call(),
    ]);

    const stakeObj = {
      amount: stakedData.amount,
      rewardClaimed: stakedData.rewardClaimed,
      pendingReward: pendingReward,
    };
    dispatch({
      type: tokenToStake(tokenType),
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
  (tokens, account, tokenType, network) => async (dispatch) => {
    dispatch({
      type: SHOW_LOADING,
      payload: tokenType,
    });
    const depositTokens = toWei(tokens, "ether");

    const pool = poolId[tokenType];

    try {
      const currTokenContract = getTokenContract(network, tokenType);
      const currStakeContract = stakeContract(network);

      const res = await currStakeContract.methods
        .deposit(pool, depositTokens)
        .send({ from: account });

      const [balanceWei, stakedData, pendingReward] = await Promise.all([
        currTokenContract.methods.balanceOf(account).call(),
        currStakeContract.methods.userInfo(pool, account).call(),
        currStakeContract.methods.pendingReward(pool, account).call(),
      ]);

      dispatch({
        type: tokenToLoad(tokenType),
        payload: balanceWei,
      });

      const stakeObj = {
        amount: stakedData.amount,
        rewardClaimed: stakedData.rewardClaimed,
        pendingReward: pendingReward,
      };
      dispatch({
        type: tokenToStake(tokenType),
        payload: stakeObj,
      });
    } catch (error) {
      dispatch({
        type: ERROR,
        payload: network === bscNetwork ? error.message : error,
      });
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };

export const unstakeTokens =
  (tokens, account, tokenType, network) => async (dispatch) => {
    dispatch({
      type: SHOW_LOADING,
      payload: tokenType,
    });

    const depositTokens = toWei(tokens, "ether");
    const pool = poolId[tokenType];
    const currStakeContract = stakeContract(network);
    const currTokenContract = getTokenContract(network, tokenType);

    try {
      const res = await currStakeContract.methods
        .withdraw(pool, depositTokens)
        .send({ from: account });

      const [balanceWei, stakedData, pendingReward] = await Promise.all([
        currTokenContract.methods.balanceOf(account).call(),
        currStakeContract.methods.userInfo(pool, account).call(),
        currStakeContract.methods.pendingReward(pool, account).call(),
      ]);

      dispatch({
        type: tokenToLoad(tokenType),
        payload: balanceWei,
      });

      const stakeObj = {
        amount: stakedData.amount,
        rewardClaimed: stakedData.rewardClaimed,
        pendingReward: pendingReward,
      };

      dispatch({
        type: tokenToStake(tokenType),
        payload: stakeObj,
      });
    } catch (error) {
      dispatch({
        type: ERROR,
        payload: network === bscNetwork ? error.message : error,
      });
    }
    dispatch({
      type: HIDE_LOADING,
      payload: tokenType,
    });
  };
