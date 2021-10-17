import BigNumber from "bignumber.js";
import Web3 from 'web3';
import {
  AVG_BITE_PER_BLOCK,
  AVG_CL365_PER_BLOCK,
  AVG_CORGIB_PER_BLOCK,
  AVG_PBR_PER_BLOCK,
  AVG_PBR_PER_BLOCK_MATIC,
  AVG_PWAR_PER_BLOCK,
  BITE,
  CFL365,
  CORGIB,
  CORGIB_BLOCKS_PER_YEAR,
  maticNetwork,
  NUMBER_BLOCKS_PER_YEAR,
  NUMBER_BLOCKS_PER_YEAR_MATIC,
  PBR,
  PWAR,
  PWAR_BLOCKS_PER_YEAR,
  apyConstants,
  harmonyNetwork
} from "../constants";
import web3 from "../web";
import config from "./config";

export const fromWei = (tokens) => {
  if (!tokens) {
    return web3.utils.fromWei("0", "ether");
  }
  let amount = web3.utils.fromWei(tokens, "ether");
  return amount;
};

export const toWei = (tokens) => {
  if (!tokens) {
    return web3.utils.toWei("0", "ether");
  }
  return web3.utils.toWei(tokens, "ether");
};

export const getCurrentAccount = async () => {
  let accounts = [];

  try {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    // accounts = await web3.eth.getAccounts();
    // console.log('accounts', accounts)
    const accountAddress = accounts.length > 0 ? accounts[0] : null;
    return accountAddress;
  } catch (error) {
    console.log("getAccounts", error);
    return error;
  }
};

export const getNetworkBalance = async (accountAddress) => {
  try {
    const bal = web3.eth.getBalance(accountAddress);
    return bal;
  } catch (error) {
    console.log("getAccountBalance", error);
    return null;
  }
};

export const getCurrentNetworkId = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum)
    const id = await web3.eth.getChainId()

    if (id) {
      return id;
    } else {
      return await web3.eth.getChainId();
    }
  } else {
    return await web3.eth.getChainId();
  }
};

export const formatLargeNumber = (value, precision = 2) => {
  const _value = !value ? '0' : value;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: precision,
  });

  const formattedValue = convertToInternationalCurrencySystem(_value, formatter);

  return formattedValue;

}

export const formatCurrency = (
  value,
  usd = false,
  fractionDigits = 1,
  currencyFormat = false
) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
  });

  //for currency format with $symbol
  if (usd) {
    return formatter.format(value ? value : 0);
  }

  if (typeof window.web3 === "undefined") {
    return formatter.format(value ? value : 0).slice(1);
  }
  const netId = window.ethereum.networkVersion;
  if (["97", "56"].includes(netId) && !currencyFormat) {
    // for bsc network only
    return convertToInternationalCurrencySystem(value ? value : 0, formatter);
  }
  return formatter.format(value ? value : 0).slice(1);
};

function convertToInternationalCurrencySystem(labelValue, formatter) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? formatter
      .format((Math.abs(Number(labelValue)) / 1.0e9).toFixed(2))
      .slice(1) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
      ? formatter
        .format((Math.abs(Number(labelValue)) / 1.0e6).toFixed(2))
        .slice(1) + "M"
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
        ? formatter
          .format((Math.abs(Number(labelValue)) / 1.0e3).toFixed(2))
          .slice(1) + "K"
        : formatter.format(Math.abs(Number(labelValue))).slice(1);
}

export const resetCurrencyFormatting = (value) => {
  return value.split(",").join("");
};

export const isNumber = (value) => {
  return !isNaN(parseInt(value));
};

export const isMetaMaskInstalled = () => {
  return typeof window.web3 !== "undefined";
};

//apy calculation
const getCalculatedApy = (
  tokenPrice,
  blocksPerYear,
  rewardPerBlock,
  totalValueLockedUsd
) => {
  console.log(
    'getPoolInfo: ', {
    tokenPrice,
    blocksPerYear,
    rewardPerBlock,
    totalValueLockedUsd
  })
  const apy = tokenPrice
    .times(new BigNumber(blocksPerYear))
    .times(new BigNumber(rewardPerBlock))
    .div(totalValueLockedUsd)
    .times(100)
    .toFixed(1)
    .toString();
  return apy;
};

export const getApy = (tokenType, poolObj, network) => {
  // const NUMBER_BLOCKS_PER_YEAR = 2400000;

  let tokenPrice = new BigNumber(poolObj.tokenPrice);
  const total_value_locked_usd = tokenPrice.times(
    new BigNumber(fromWei(poolObj.totalTokenStaked))
  );

  switch (tokenType) {
    case CORGIB:
      const corgibApy = getCalculatedApy(
        tokenPrice,
        CORGIB_BLOCKS_PER_YEAR,
        AVG_CORGIB_PER_BLOCK,
        total_value_locked_usd
      );
      return corgibApy;
    case PWAR:
      const pwarApy = getCalculatedApy(
        tokenPrice,
        PWAR_BLOCKS_PER_YEAR,
        AVG_PWAR_PER_BLOCK,
        total_value_locked_usd
      );
      return pwarApy;

    case PBR:
      if (network === maticNetwork) {
        const _apy = getCalculatedApy(
          tokenPrice,
          apyConstants.polygon.PBR.NUMBER_BLOCKS_PER_YEAR,
          apyConstants.polygon.PBR.AVG_REWARD_PER_BLOCK,
          total_value_locked_usd
        );
        return _apy
      } else if (network === harmonyNetwork) {
        console.log('getPoolInfo:  calculating apy in ', network)
        const _apy = getCalculatedApy(
          tokenPrice,
          apyConstants.harmony.PBR.NUMBER_BLOCKS_PER_YEAR,
          apyConstants.harmony.PBR.AVG_REWARD_PER_BLOCK,
          total_value_locked_usd
        );
        return _apy
      }
      const _apy = getCalculatedApy(
        tokenPrice,
        apyConstants.ethereum.PBR.NUMBER_BLOCKS_PER_YEAR,
        apyConstants.ethereum.PBR.AVG_REWARD_PER_BLOCK,
        total_value_locked_usd
      );
      return _apy
    case BITE:
      const biteApy = getCalculatedApy(
        tokenPrice,
        NUMBER_BLOCKS_PER_YEAR,
        AVG_BITE_PER_BLOCK,
        total_value_locked_usd
      );
      return biteApy;
    case CFL365:
      const clfApy = getCalculatedApy(
        tokenPrice,
        NUMBER_BLOCKS_PER_YEAR,
        AVG_CL365_PER_BLOCK,
        total_value_locked_usd
      );
      return clfApy;
    default:
      return 0;
  }

  // if (tokenType === "CORGIB") {
  //   const total_value_locked_usd = tokenPrice.times(
  //     new BigNumber(fromWei(poolObj.totalTokenStaked))
  //   );
  //   // const apy = tokenPrice
  //   //   .times(new BigNumber(CORGIB_BLOCKS_PER_YEAR))
  //   //   .times(new BigNumber(AVG_CORGIB_PER_BLOCK))
  //   //   .div(total_value_locked_usd)
  //   //   .times(100)
  //   //   .toFixed(1)
  //   //   .toString();
  //   const apy = getCalculatedApy(
  //     tokenPrice,
  //     CORGIB_BLOCKS_PER_YEAR,
  //     AVG_CORGIB_PER_BLOCK,
  //     total_value_locked_usd
  //   );
  //   return apy;
  // } else if (tokenType === "PWAR") {
  //   const total_value_locked_usd = tokenPrice.times(
  //     new BigNumber(fromWei(poolObj.totalTokenStaked))
  //   );
  //   // const apy = tokenPrice
  //   //   .times(new BigNumber(PWAR_BLOCKS_PER_YEAR))
  //   //   .times(new BigNumber(AVG_PWAR_PER_BLOCK))
  //   //   .div(total_value_locked_usd)
  //   //   .times(100)
  //   //   .toFixed(1)
  //   //   .toString();
  //   const apy = getCalculatedApy(
  //     tokenPrice,
  //     PWAR_BLOCKS_PER_YEAR,
  //     AVG_PWAR_PER_BLOCK,
  //     total_value_locked_usd
  //   );
  //   return apy;
  // }

  // const avg_tokens_perblock =
  //   tokenType === "PBR" ? AVG_PBR_PER_BLOCK : AVG_BITE_PER_BLOCK;
  // const total_value_locked_usd = tokenPrice.times(
  //   new BigNumber(fromWei(poolObj.totalTokenStaked))
  // );
  // const apy = tokenPrice
  //   .times(new BigNumber(NUMBER_BLOCKS_PER_YEAR))
  //   .times(new BigNumber(avg_tokens_perblock))
  //   .div(total_value_locked_usd)
  //   .times(100)
  //   .toFixed(1)
  //   .toString();
  // return apy;
};


//input  { chainId, chainName, currency: {name, symbol, decimals }, rpcUrls, blockExplorer }
export const setupNetwork = async (networkObject) => {
  const provider = window.ethereum
  if (provider) {
    // const _chainId = parseInt(networkObject.chainId, 10)
    try {
      if (networkObject.chainId === `0x${config.chainId.toString(16)}` || networkObject.chainId === `0x${config.chainIdTestnet.toString(16)}`) {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkObject.chainId }],
        })
      }
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          networkObject
        ]
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}