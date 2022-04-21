import axios from "axios";
import BigNumber from "bignumber.js";
import {
  apyConstants,
  bscNetwork,
  coingeckoTokenId,
  etheriumNetwork,
  harmonyNetwork,
  maticNetwork,
  tokenPriceConstants,
} from "../constants";
import config from "./config";

export const fromWei = (tokens, decimals = 18) => {
  try {
    if (!tokens) {
      return new BigNumber(0).toString();
    }

    return new BigNumber(tokens)
      .div(new BigNumber(10).exponentiatedBy(decimals))
      .toString();
  } catch (error) {
    console.log("exeption in fromWei ", error);
    return null;
  }
};

export const toWei = (tokens, decimals = 18) => {
  try {
    if (!tokens) {
      return new BigNumber(0).toString();
    }
    return new BigNumber(tokens)
      .multipliedBy(new BigNumber(10).exponentiatedBy(decimals))
      .toFixed(0)
      .toString();
  } catch (error) {
    console.log("exeption in toWei , ", error);
    return null;
  }
};

export const getCurrentAccount = async () => {
  let accounts = [];

  try {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    const accountAddress = accounts.length > 0 ? accounts[0] : null;
    return accountAddress;
  } catch (error) {
    console.log("getAccounts", error);
    return error;
  }
};

export const formatLargeNumber = (value, precision = 2) => {
  const _value = !value ? "0" : value;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: precision,
  });

  const formattedValue = convertToInternationalCurrencySystem(
    _value,
    formatter
  );

  return formattedValue;
};

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
const getCalculatedApy = (blocksPerYear, rewardPerBlock, totalTokenStaked) => {
  const apy = new BigNumber(blocksPerYear)
    .times(new BigNumber(rewardPerBlock))
    .div(totalTokenStaked)
    .times(100)
    .toFixed(1)
    .toString();
  return apy;
};

export const getApy = (tokenType, poolObj, network) => {
  try {
    const totalTokenLocked = new BigNumber(fromWei(poolObj?.totalTokenStaked));
    const blocksPerYear =
      apyConstants?.[network]?.[tokenType]?.NUMBER_BLOCKS_PER_YEAR;
    const rewardPerBlock =
      apyConstants?.[network]?.[tokenType]?.AVG_REWARD_PER_BLOCK;
    if (!rewardPerBlock || !blocksPerYear) {
      return "0";
    }
    const apy = getCalculatedApy(
      blocksPerYear,
      rewardPerBlock,
      totalTokenLocked
    );

    return apy;
  } catch (error) {
    console.log("getApy ", { tokenType, network, error });
    return 0;
  }
};

//input  { chainId, chainName, currency: {name, symbol, decimals }, rpcUrls, blockExplorer }
export const setupNetwork = async (networkObject) => {
  const provider = window.ethereum;
  if (provider) {
    // const _chainId = parseInt(networkObject.chainId, 10)
    try {
      if (
        networkObject.chainId === `0x${config.chainId.toString(16)}` ||
        networkObject.chainId === `0x${config.chainIdTestnet.toString(16)}`
      ) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkObject.chainId }],
        });
      }
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [networkObject],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

export const getCurrentNetworkName = (networkId) => {
  const _id = parseInt(networkId);
  if ([config.bscChain, config.bscChainTestent].includes(_id)) {
    return bscNetwork;
  } else if (
    [config.polygon_chain_mainnet, config.polygon_chain_testnet].includes(_id)
  ) {
    return maticNetwork;
  } else if ([config.hmyChainMainnet, config.hmyChainMainnet].includes(_id)) {
    return harmonyNetwork;
  } else {
    return etheriumNetwork;
  }
};

export const fetchTokenPrice = async (tokenSymbol) => {
  try {
    if (!tokenSymbol) {
      return null;
    }

    if (Object.keys(tokenPriceConstants).includes(tokenSymbol)) {
      return tokenPriceConstants[tokenSymbol];
    }

    const token_id = coingeckoTokenId?.[tokenSymbol];

    const priceRes = await axios.get(
      config.coingecko +
        `/v3/simple/price?ids=${token_id}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`
    );
    const priceData = priceRes.data;
    const tokenPrice = priceData?.[token_id] ? priceData[token_id].usd : "---";

    return tokenPrice;
  } catch (error) {
    console.log("fetchTokenPrice ", { tokenSymbol, error });
    return 0;
  }
};
