import web3 from "../web3";
import BigNumber from "bignumber.js";

export const fromWei = (tokens) => {
  if (!tokens) {
    return web3.utils.fromWei("0", "ether");
  }
  let amount = web3.utils.fromWei(tokens, "ether");
  return new BigNumber(amount).toFixed(1).toString();
};

export const toWei = (tokens) => {
  if (!tokens) {
    return web3.utils.toWei("0", "ether");
  }
  return web3.utils.toWei(tokens, "ether");
};

export const getCurrentAccount = async () => {
  const accounts = await web3.eth.requestAccounts();
  const accountAddress = accounts[0];
  return accountAddress;
};

export const formatCurrency = (value, usd = false) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 1,
  });
  if (usd) {
    return formatter.format(value ? value : 0);
  }
  return formatter.format(value ? value : 0).slice(1);
};
