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
  LOAD_CORGIB_POOL,

} from "./types";

import { biteContract, corgibCoinContract, pbrContract, stakeContract } from '../contracts/connections'
import { toWei, getCurrentAccount, getApy } from "../utils/helper";
import BigNumber from "bignumber.js";
import config from "../config";
import { BITE_PRICE, etheriumNetwork, poolId } from "../constants";


// current token contract
const getTokenContract = (network, tokenType) => {

  if (network === etheriumNetwork) {
    return tokenType === 'PBR' ? pbrContract(network) : biteContract(network)
  } else {
    return corgibCoinContract(network)
  }

}

const tokenToApprove = (tokenType) => {
  if (tokenType === 'CORGIB') {
    return APPROVE_CORGIB_TOKENS
  }
  else if (tokenType === 'PBR') {
    return APPROVE_PBR_TOKENS
  } else {
    return APPROVE_BITE_TOKENS
  }
}

const tokenToReset = (tokenType) => {
  if (tokenType === 'CORGIB') {
    return RESET_CORGIB_TOKEN
  }
  else if (tokenType === 'PBR') {
    return RESET_PBR_TOKEN
  } else {
    return RESET_BITE_TOKEN
  }
}

const tokenToStake = (tokenType) => {
  if (tokenType === 'CORGIB') {
    return STAKE_CORGIB_TOKENS
  }
  else if (tokenType === 'PBR') {
    return STAKE_PBR_TOKENS
  } else {
    return STAKE_BITE_TOKENS
  }
}

const tokenToLoad = (tokenType) => {
  if (tokenType === 'CORGIB') {
    return LOAD_CORGIB_BALANCE
  }
  else if (tokenType === 'PBR') {
    return LOAD_PBR_BALANCE
  } else {
    return LOAD_BITE_BALANCE
  }
}

//GET all characters
export const getPoolInfo = (network) => async (dispatch) => {
  dispatch({
    type: SHOW_POOL_LOADING,
  });
  try {
    const currStakingContract = stakeContract(network)


    if (network === etheriumNetwork) {
      // console.log('g')
      const [pbrPool, bitePool] = await Promise.all([
        currStakingContract.methods.getPoolInfo(0).call(),
        currStakingContract.methods.getPoolInfo(1).call()
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

    } else {

      // fetch pool for corgib on bsc
      const corgibPool = await currStakingContract.methods.getPoolInfo(0).call()

      // console.log('pool data', corgibPool)
      const poolObj = {
        accTokenPerShare: corgibPool[0],
        lastRewardBlock: corgibPool[1],
        rewardPerBlock: corgibPool[2],
        totalTokenStaked: corgibPool[3],
        totalTokenClaimed: corgibPool[4],
      };
      const { data } = await axios.get(
        config.coingecko +
        "/v3/simple/price?ids=the-corgi-of-polkabridge&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );

      poolObj.tokenPrice = data['the-corgi-of-polkabridge'] ? data['the-corgi-of-polkabridge'].usd : "---";
      const corgibApy = getApy('CORGIB', poolObj)
      poolObj.corgibApy = corgibApy;

      // console.log('final pool data', poolObj)
      dispatch({
        type: LOAD_CORGIB_POOL,
        payload: poolObj
      })

    }
  } catch (error) {
    // console.log("pool info: ", error);
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

    const currStakingContract = stakeContract(network)

    if (network === etheriumNetwork) {

      const [pbrAllowance, biteAllowance] = await Promise.all([
        pbrContract(network).methods
          .allowance(account, currStakingContract._address)
          .call(),
        biteContract(network).methods
          .allowance(account, currStakingContract._address)
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

    } else {
      // bsc network
      const [corgibAllowance] = await Promise.all([
        corgibCoinContract(network).methods
          .allowance(account, currStakingContract._address)
          .call()
      ])

      if (new BigNumber(corgibAllowance).gt(0)) {
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

export const confirmAllowance = (balance, tokenType, network) => async (dispatch) => {
  try {
    dispatch({
      type: SHOW_LOADING,
      payload: tokenType
    });
    const account = await getCurrentAccount();
    const tokenContract = getTokenContract(network, tokenType)
    const stakingContract = stakeContract(network);

    // console.log('confirmAllowance:   ', { account, tokenContract, stakingContract })
    const res = await tokenContract.methods
      .approve(stakingContract._address, balance)
      .send({ from: account })

    dispatch({
      type: tokenToApprove(tokenType),
    });

    // console.log('allowance confirmed ', res)
  } catch (error) {
    // console.log("confirmAllowance ", error);
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

export const getUserStakedData = (tokenType, network) => async (dispatch) => {

  dispatch({
    type: SHOW_LOADING,
    payload: tokenType
  });

  try {
    const account = await getCurrentAccount();

    const tokenContract = getTokenContract(network, tokenType) //tokenType === 'PBR' ? pbrContract(network) : biteContract(network);
    const pool = poolId[tokenType]
    const currStakeContract = stakeContract(network)

    const allowance = await tokenContract.methods
      .allowance(account, currStakeContract._address)
      .call();

    if (new BigNumber(allowance).gt(0)) {
      dispatch({
        type: tokenToApprove(tokenType),
      });
    } else {
      dispatch({
        type: tokenToReset(tokenType)
      });
      dispatch({
        type: HIDE_LOADING,
      });
      return;
    }

    const [stakedData, pendingReward] = await Promise.all([
      currStakeContract.methods.userInfo(pool, account).call(),
      currStakeContract.methods.pendingReward(pool, account).call()
    ])


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
    payload: tokenType
  });
};

export const stakeTokens = (tokens, account, tokenType, network) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
    payload: tokenType
  });
  const depositTokens = toWei(tokens, "ether");

  const pool = poolId[tokenType]

  try {
    const currTokenContract = getTokenContract(network, tokenType);
    const currStakeContract = stakeContract(network)

    const res = await currStakeContract.methods.deposit(pool, depositTokens).send({ from: account });

    // console.log(res)
    const [balanceWei, stakedData, pendingReward] = await Promise.all([
      currTokenContract.methods.balanceOf(account).call(),
      currStakeContract.methods.userInfo(pool, account).call(),
      currStakeContract.methods.pendingReward(pool, account).call()
    ])


    dispatch({
      type: tokenToLoad(tokenType),
      payload: balanceWei
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
      payload: "Failed to stake tokens",
    });
  }
  dispatch({
    type: HIDE_LOADING,
    payload: tokenType
  });
};

export const unstakeTokens = (tokens, account, tokenType, network) => async (dispatch) => {
  dispatch({
    type: SHOW_LOADING,
    payload: tokenType
  });

  const depositTokens = toWei(tokens, "ether");
  const pool = poolId[tokenType]
  const currStakeContract = stakeContract(network)
  const currTokenContract = getTokenContract(network, tokenType);


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
      payload: "Failed to stake tokens",
    });
  }
  dispatch({
    type: HIDE_LOADING,
    payload: tokenType
  });
};
