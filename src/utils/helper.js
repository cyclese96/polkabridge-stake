import BigNumber from "bignumber.js";
import { AVG_BITE_PER_BLOCK, AVG_PBR_PER_BLOCK, NUMBER_BLOCKS_PER_YEAR } from "../constants";
import web3 from "../web";

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
  accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const accountAddress = accounts.length > 0 ? accounts[0] : null;
  return accountAddress;
};

export const formatCurrency = (value, usd = false, fractionDigits = 1) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
  });
  if (usd) {
    return formatter.format(value ? value : 0);
  }
  return formatter.format(value ? value : 0).slice(1);
};

export const isMetaMaskInstalled = () => {
  return typeof window.web3 !== "undefined";
};

export const getApy = (tokenType, poolObj) => {
  // const NUMBER_BLOCKS_PER_YEAR = 2400000;
  const avg_tokens_perblock = tokenType === 'PBR' ? AVG_PBR_PER_BLOCK : AVG_BITE_PER_BLOCK;

  let tokenPrice = new BigNumber(poolObj.tokenPrice);
  const total_value_locked_usd = tokenPrice.times(
    new BigNumber(fromWei(poolObj.totalTokenStaked))
  );
  const apy = tokenPrice
    .times(new BigNumber(NUMBER_BLOCKS_PER_YEAR))
    .times(new BigNumber(avg_tokens_perblock))
    .div(total_value_locked_usd)
    .times(100)
    .toFixed(1)
    .toString();

  return apy
}