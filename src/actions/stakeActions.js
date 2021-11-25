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
  STAKE_PUN_TOKENS,
  RESET_PUN_TOKEN,
  APPROVE_PUN_TOKENS,
  LOAD_PUN_BALANCE,
  APPROVE_SHOE_TOKENS,
  RESET_SHOE_TOKEN,
  STAKE_SHOE_TOKENS,
  LOAD_SHOE_BALANCE,
  APPROVE_WELT_TOKENS,
  RESET_WELT_TOKEN,
  STAKE_WELT_TOKENS,
  LOAD_BALANCE,
} from "./types";

import { stakeContract, erc20TokenContract } from "../contracts/connections";
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
  CFL365,
  CLF365_PRICE,
  CORGIB,
  currentConnection,
  etheriumNetwork,
  harmonyNetwork,
  maticNetwork,
  PBR,
  poolId,
  PUN,
  PWAR,
  PWAR_PRICE,
  SHOE,
  tokenContarctAddresses,
  WELT,
} from "../constants";

// current token contract
const getTokenContract = (network, tokenType) => {
  switch (tokenType) {
    case PBR:
      if (network === etheriumNetwork) {
        return erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PBR.ethereum.mainnet
        );
      } else {
        return erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.polygon.testnet
            : tokenContarctAddresses.PBR.polygon.mainnet
        );
      }

    case BITE:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.BITE.ethereum.testnet
          : tokenContarctAddresses.BITE.ethereum.mainnet
      );
    case CORGIB:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.CORGIB.bsc.testnet
          : tokenContarctAddresses.CORGIB.bsc.mainnet
      );
    case PWAR:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.PWAR.bsc.testnet
          : tokenContarctAddresses.PWAR.bsc.mainnet
      );
    case CFL365:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.CFL365.ethereum.testnet
          : tokenContarctAddresses.CFL365.ethereum.mainnet
      );
    case PUN:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.PUN.ethereum.testnet
          : tokenContarctAddresses.PUN.ethereum.mainnet
      );
    case SHOE:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.SHOE.ethereum.testnet
          : tokenContarctAddresses.SHOE.ethereum.mainnet
      );
    case SHOE:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.SHOE.ethereum.testnet
          : tokenContarctAddresses.SHOE.ethereum.mainnet
      );
    case WELT:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.WELT.polygon.testnet
          : tokenContarctAddresses.WELT.polygon.mainnet
      );

    default:
      return erc20TokenContract(
        network,
        currentConnection === "testnet"
          ? tokenContarctAddresses.PBR.ethereum.testnet
          : tokenContarctAddresses.PBR.ethereum.mainnet
      );
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
    case CFL365:
      return APPROVE_CLF365_TOKENS;
    case PUN:
      return APPROVE_PUN_TOKENS;
    case SHOE:
      return APPROVE_SHOE_TOKENS;
    case WELT:
      return APPROVE_WELT_TOKENS;

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
    case CFL365:
      return RESET_CLF365_TOKEN;
    case PUN:
      return RESET_PUN_TOKEN;
    case SHOE:
      return RESET_SHOE_TOKEN;
    case WELT:
      return RESET_WELT_TOKEN;

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
    case CFL365:
      return STAKE_CLF365_TOKENS;
    case PUN:
      return STAKE_PUN_TOKENS;
    case SHOE:
      return STAKE_SHOE_TOKENS;
    case WELT:
      return STAKE_WELT_TOKENS;

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
    case CFL365:
      return LOAD_CLF365_BALANCE;
    case PUN:
      return LOAD_PUN_BALANCE;
    case SHOE:
      return LOAD_SHOE_BALANCE;

    default:
      return LOAD_CLF365_BALANCE;
  }
};

export const getPoolInfo = (network) => async (dispatch) => {
  dispatch({
    type: SHOW_POOL_LOADING,
  });
  try {
    const currStakingContract = stakeContract(network);
    // ethereum pool calculations
    if (network === etheriumNetwork) {
      // console.log('g')
      const [pbrPool, bitePool, clfPool, punPool, shoePool] = await Promise.all(
        [
          currStakingContract.methods.getPoolInfo(poolId.PBR).call(),
          currStakingContract.methods.getPoolInfo(poolId.BITE).call(),
          currStakingContract.methods.getPoolInfo(poolId.CFL365).call(),
          currStakingContract.methods.getPoolInfo(poolId.PUN).call(),
          currStakingContract.methods.getPoolInfo(poolId.SHOE).call(),
        ]
      );

      const pbrPoolObj = {
        accTokenPerShare: pbrPool[0],
        lastRewardBlock: pbrPool[1],
        rewardPerBlock: pbrPool[2],
        totalTokenStaked: pbrPool[3],
        totalTokenClaimed: pbrPool[4],
      };
      const { data } = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=true"
      );
      // console.log("data");
      // console.log(data);
      pbrPoolObj.tokenPrice = data.polkabridge ? data.polkabridge.usd : "---";
      pbrPoolObj.mCap = data.polkabridge
        ? data.polkabridge.usd_market_cap
        : "---";
      pbrPoolObj.change = data.polkabridge
        ? data.polkabridge.usd_24h_change
        : "---";

      const pbrApy = getApy("PBR", pbrPoolObj, network);
      pbrPoolObj.pbrApy = pbrApy;

      // bite pool calculations
      const bitePoolObj = {
        accTokenPerShare: bitePool[0],
        lastRewardBlock: bitePool[1],
        rewardPerBlock: bitePool[2],
        totalTokenStaked: bitePool[3],
        totalTokenClaimed: bitePool[4],
      };

      const bitePriceRes = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=dragonbite&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );
      const bitePrice = bitePriceRes.data;
      // console.log("bite price", bitePrice);
      bitePoolObj.tokenPrice = bitePrice["dragonbite"]
        ? bitePrice["dragonbite"].usd
        : "---";
      bitePoolObj.biteApy = getApy("BITE", bitePoolObj, network);

      // console.log({ bitePoolObj });
      // clf pool calculations
      const clfPoolObj = {
        accTokenPerShare: clfPool[0],
        lastRewardBlock: clfPool[1],
        rewardPerBlock: clfPool[2],
        totalTokenStaked: clfPool[3],
        totalTokenClaimed: clfPool[4],
      };
      // clfPoolObj.tokenPrice = CLF365_PRICE;
      const cflPriceRes = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=cfl365-finance&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );
      const cflPrice = cflPriceRes.data;
      // console.log("bite price", cfl);
      clfPoolObj.tokenPrice = cflPrice["cfl365-finance"]
        ? cflPrice["cfl365-finance"].usd
        : "---";
      // console.log({ clfPoolObj });

      clfPoolObj.clf365Apy = getApy(CFL365, clfPoolObj, network);

      // pun pool calculations:
      const punPoolObj = {
        accTokenPerShare: punPool[0],
        lastRewardBlock: punPool[1],
        rewardPerBlock: punPool[2],
        totalTokenStaked: punPool[3],
        totalTokenClaimed: punPool[4],
      };

      const punPriceRes = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=cryptopunt&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );
      const punPrice = punPriceRes.data;
      punPoolObj.tokenPrice = punPrice["cryptopunt"]
        ? punPrice["cryptopunt"].usd
        : "--";

      // punPoolObj.tokenPrice = 0.15;//todo: confirm and update
      punPoolObj.punApy = getApy(PUN, punPoolObj, network);
      // console.log('cryptopunt: ', punPoolObj)

      // shoefy pool calculations:
      const shoefyPoolObj = {
        accTokenPerShare: shoePool[0],
        lastRewardBlock: shoePool[1],
        rewardPerBlock: shoePool[2],
        totalTokenStaked: shoePool[3],
        totalTokenClaimed: shoePool[4],
      };
      const shoefyPriceRes = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=shoefy&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );
      const shoefyPrice = shoefyPriceRes.data;
      shoefyPoolObj.tokenPrice = shoefyPrice["shoefy"]
        ? shoefyPrice["shoefy"].usd
        : "--";

      // shoefyPoolObj.tokenPrice = 0.5;//todo: confirm and update
      shoefyPoolObj.shoeApy = getApy(SHOE, shoefyPoolObj, network);

      dispatch({
        type: LOAD_PPOL_INFO,
        payload: {
          pbr: pbrPoolObj,
          bite: bitePoolObj,
          clf365: clfPoolObj,
          pun: punPoolObj,
          shoe: shoefyPoolObj,
        },
      });
    } else if (network === maticNetwork) {
      // matic pool network calculations
      // const weltPool = {}

      console.log("fetching from matic");
      const [pbrPool, weltPool] = await Promise.all([

        currStakingContract.methods.getPoolInfo(poolId.PBR).call(),
      ]);
      let weltPool = {};
      try {
        weltPool = await currStakingContract.methods.getPoolInfo(poolId.WELT).call()
      } catch (error) {
      }

      const pbrPoolObj = {
        accTokenPerShare: pbrPool[0],
        lastRewardBlock: pbrPool[1],
        rewardPerBlock: pbrPool[2],
        totalTokenStaked: pbrPool[3],
        totalTokenClaimed: pbrPool[4],
      };
      const { data } = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false"
      );

      pbrPoolObj.tokenPrice = data.polkabridge ? data.polkabridge.usd : "---";
      pbrPoolObj.mCap = data.polkabridge
        ? data.polkabridge.usd_market_cap
        : "---";
      pbrPoolObj.change = data.polkabridge
        ? data.polkabridge.usd_24h_change
        : "---";

      const pbrApy = getApy("PBR", pbrPoolObj, network);
      pbrPoolObj.pbrApy = pbrApy;

      //welt pool prepration
      const weltPoolObj = {
        accTokenPerShare: weltPool[0],
        lastRewardBlock: weltPool[1],
        rewardPerBlock: weltPool[2],
        totalTokenStaked: weltPool[3],
        totalTokenClaimed: weltPool[4],
      };
      const weltPriceObj = await axios.get(
        config.coingecko +
        "/v3/simple/price?ids=fabwelt&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false"
      );

      weltPoolObj.tokenPrice = weltPriceObj.data.fabwelt ? weltPriceObj.data?.fabwelt?.usd : "---";
      // weltPoolObj.mCap = data.polkabridge
      //   ? data.polkabridge.usd_market_cap
      //   : "---";
      // weltPoolObj.change = data.polkabridge
      //   ? data.polkabridge.usd_24h_change
      //   : "---";


      const weltApy = getApy(WELT, weltPoolObj, network);
      weltPoolObj.weltApy = weltApy;


      dispatch({
        type: LOAD_PPOL_INFO,
        payload: {
          pbr: pbrPoolObj,
          welt: weltPoolObj,
        },
      });
    } else if (network === harmonyNetwork) {
      console.log("getPoolInfo:  fetching pool info ", network);
      // matic pool network calculations
      const [pbrPool] = await Promise.all([
        currStakingContract.methods.getPoolInfo(poolId.PBR).call(),
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
          "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false"
      );

      pbrPoolObj.tokenPrice = data.polkabridge ? data.polkabridge.usd : "---";
      pbrPoolObj.mCap = data.polkabridge
        ? data.polkabridge.usd_market_cap
        : "---";
      pbrPoolObj.change = data.polkabridge
        ? data.polkabridge.usd_24h_change
        : "---";

      const pbrApy = getApy("PBR", pbrPoolObj, network);
      // console.log('getPoolInfo:  apy', pbrApy)
      // console.log('getPoolInfo:  pirce data', pbrPoolObj)
      pbrPoolObj.pbrApy = pbrApy;

      dispatch({
        type: LOAD_PPOL_INFO,
        payload: { pbr: pbrPoolObj },
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

      // using corgib token price in tokenPriceCorgin key:
      const dataCorgib = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=the-corgi-of-polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false"
      );

      poolObj.tokenPriceCorgib = dataCorgib.data["the-corgi-of-polkabridge"]
        ? parseFloat(dataCorgib.data["the-corgi-of-polkabridge"].usd)
        : "---";

      //Note: using polkabridge pool information in corgibPool Object:
      const { data } = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false"
      );

      poolObj.tokenPrice = data.polkabridge
        ? parseFloat(data.polkabridge.usd).toFixed(2)
        : "---";

      poolObj.mCap = data.polkabridge
        ? parseFloat(data.polkabridge.usd_market_cap).toFixed(2)
        : "---";
      poolObj.change = data.polkabridge
        ? parseFloat(data.polkabridge.usd_24h_change).toFixed(2)
        : "---";

      const corgibApy = getApy("CORGIB", poolObj, network);
      poolObj.corgibApy = corgibApy;

      //prepare pwar Pool
      const pwarPoolObj = {
        accTokenPerShare: pwarPoolData[0],
        lastRewardBlock: pwarPoolData[1],
        rewardPerBlock: pwarPoolData[2],
        totalTokenStaked: pwarPoolData[3],
        totalTokenClaimed: pwarPoolData[4],
      };

      // pwarPoolObj.tokenPrice = PWAR_PRICE;
      const pwarPriceRes = await axios.get(
        config.coingecko +
          "/v3/simple/price?ids=polkawar&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
      );
      const pwarPrice = pwarPriceRes.data;
      // console.log("polkawar price", pwarData);
      pwarPoolObj.tokenPrice = pwarPrice["polkawar"]
        ? pwarPrice["polkawar"].usd
        : "---";
      const pwarApy = getApy("PWAR", pwarPoolObj, network);
      pwarPoolObj.pwarApy = pwarApy;
      // console.log({ pwarApy });

      // console.log({ pwarPoolObj });
      dispatch({
        type: LOAD_BSC_POOL,
        payload: { corgib: poolObj, pwar: pwarPoolObj },
      });
    }
  } catch (error) {
    console.log("getPoolInfo error ", { error, network, poolId: poolId.WELT });
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
      const [
        pbrAllowance,
        biteAllowance,
        cl365Allowance,
        punAllowance,
        shoeAllowance,
      ] = await Promise.all([
        getTokenContract(network, PBR)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        getTokenContract(network, BITE)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        getTokenContract(network, CFL365)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        ,
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.PUN.ethereum.mainnet
        )
          .methods.allowance(account, currStakingContract._address)
          .call(),
        erc20TokenContract(
          network,
          currentConnection === "testnet"
            ? tokenContarctAddresses.PBR.ethereum.testnet
            : tokenContarctAddresses.SHOE.ethereum.mainnet
        )
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

      if (new BigNumber(punAllowance).gt(0)) {
        dispatch({
          type: APPROVE_PUN_TOKENS,
        });
      }

      if (new BigNumber(shoeAllowance).gt(0)) {
        dispatch({
          type: APPROVE_SHOE_TOKENS,
        });
      }
    } else if (network === maticNetwork) {
      const [pbrAllowance, weltAllowance] = await Promise.all([
        getTokenContract(network, PBR)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        getTokenContract(network, WELT)
          .methods.allowance(account, currStakingContract._address)
          .call(),
      ]);

      if (new BigNumber(pbrAllowance).gt(0)) {
        dispatch({
          type: APPROVE_PBR_TOKENS,
        });
      }

      if (new BigNumber(weltAllowance).gt(0)) {
        dispatch({
          type: APPROVE_WELT_TOKENS,
        });
      }
    } else if (network === harmonyNetwork) {
      const [pbrAllowance] = await Promise.all([
        getTokenContract(network, PBR)
          .methods.allowance(account, currStakingContract._address)
          .call(),
      ]);

      if (new BigNumber(pbrAllowance).gt(0)) {
        dispatch({
          type: APPROVE_PBR_TOKENS,
        });
      }
    } else {
      // bsc network
      const [corgibAllowance, pwarAllowance] = await Promise.all([
        getTokenContract(network, CORGIB)
          .methods.allowance(account, currStakingContract._address)
          .call(),
        getTokenContract(network, PWAR)
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
      const loadingObj = {};
      loadingObj[`${tokenType}`] = true;
      dispatch({
        type: SHOW_LOADING,
        payload: loadingObj,
      });
      // const account = await getCurrentAccount();
      const tokenContract = getTokenContract(network, tokenType);
      const stakingContract = stakeContract(network);

      // console.log('allowance params:  ', { balance, tokenType, network, account })
      if (network === maticNetwork) {

        await tokenContract.methods
          .approve(stakingContract._address, balance)
          .send({ from: account, gasPrice: 100000000000 });

      } else {

        await tokenContract.methods
          .approve(stakingContract._address, balance)
          .send({ from: account });

      }


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
  const loadingObj = {};
  loadingObj[`${tokenType}`] = true;
  dispatch({
    type: SHOW_LOADING,
    payload: loadingObj,
  });

  try {
    const account = await getCurrentAccount();

    const tokenContract = getTokenContract(network, tokenType);
    const pool = poolId[tokenType];
    const currStakeContract = stakeContract(network);

    const allowance = await tokenContract.methods
      .allowance(account, currStakeContract._address)
      .call();

    // console.log({ tokenType, allowance });
    if (new BigNumber(allowance).gt(0)) {
      // console.log({ approving: tokenType });
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
    // console.log({ stakedData });
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
    const loadingObj = {};
    loadingObj[`${tokenType}`] = true;
    dispatch({
      type: SHOW_LOADING,
      payload: loadingObj,
    });
    const depositTokens = toWei(tokens, "ether");

    const pool = poolId[tokenType];

    try {
      const currTokenContract = getTokenContract(network, tokenType);
      const currStakeContract = stakeContract(network);

      if (network === maticNetwork) {
        await currStakeContract.methods
          .deposit(pool, depositTokens)
          .send({ from: account, gasPrice: 100000000000 });
      } else {
        await currStakeContract.methods
          .deposit(pool, depositTokens)
          .send({ from: account });
      }

      const [balanceWei, stakedData, pendingReward] = await Promise.all([
        currTokenContract.methods.balanceOf(account).call(),
        currStakeContract.methods.userInfo(pool, account).call(),
        currStakeContract.methods.pendingReward(pool, account).call(),
      ]);

      const balanceObj = {};
      balanceObj[`${tokenType}`] = balanceWei
      dispatch({
        type: LOAD_BALANCE,
        payload: balanceObj,
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
    const loadingObj = {};
    loadingObj[`${tokenType}`] = true;
    dispatch({
      type: SHOW_LOADING,
      payload: loadingObj,
    });

    const depositTokens = toWei(tokens, "ether");
    const pool = poolId[tokenType];
    const currStakeContract = stakeContract(network);
    const currTokenContract = getTokenContract(network, tokenType);

    try {
      if (network === maticNetwork) {
        await currStakeContract.methods
          .withdraw(pool, depositTokens)
          .send({ from: account, gasPrice: 100000000000 });
      } else {
        await currStakeContract.methods
          .withdraw(pool, depositTokens)
          .send({ from: account });
      }

      const [balanceWei, stakedData, pendingReward] = await Promise.all([
        currTokenContract.methods.balanceOf(account).call(),
        currStakeContract.methods.userInfo(pool, account).call(),
        currStakeContract.methods.pendingReward(pool, account).call(),
      ]);

      const balanceObj = {};
      balanceObj[`${tokenType}`] = balanceWei;

      dispatch({
        type: LOAD_BALANCE,
        payload: balanceObj,
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
