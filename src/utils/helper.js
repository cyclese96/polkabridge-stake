import BigNumber from "bignumber.js";
import Web3 from "web3";
import {
  apyConstants,
} from "../constants";
import config from "./config";

export const fromWei = (tokens) => {
  const web3 = new Web3(window?.ethereum)
  if (!tokens) {
    return web3.utils.fromWei("0", "ether");
  }
  let amount = web3.utils.fromWei(tokens, "ether");
  return amount;
};

export const toWei = (tokens) => {
  const web3 = new Web3(window?.ethereum)
  if (!tokens) {
    return web3.utils.toWei("0", "ether");
  }
  return web3.utils.toWei(tokens, "ether");
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

export const getNetworkBalance = async (accountAddress) => {
  try {
    const web3 = new Web3(window?.ethereum)
    const bal = web3.eth.getBalance(accountAddress);
    return bal;
  } catch (error) {
    console.log("getAccountBalance", error);
    return null;
  }
};

export const getCurrentNetworkId = async () => {
  const web3 = new Web3(window.ethereum);
  if (window.ethereum) {
    const id = await web3.eth.getChainId();

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
    const blocksPerYear = apyConstants?.[network]?.[tokenType]?.NUMBER_BLOCKS_PER_YEAR;
    const rewardPerBlock = apyConstants?.[network]?.[tokenType]?.AVG_REWARD_PER_BLOCK;
    const apy = getCalculatedApy(blocksPerYear, rewardPerBlock, totalTokenLocked);

    return apy;

  } catch (error) {

    console.log("getApy ", { tokenType, network, error })
    return 0;

  }

}

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
