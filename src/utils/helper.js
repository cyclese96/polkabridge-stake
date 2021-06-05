import web3 from "../web3";

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
