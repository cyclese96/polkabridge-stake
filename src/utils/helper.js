import BigNumber from "bignumber.js";
import { AVG_BITE_PER_BLOCK, AVG_CORGIB_PER_BLOCK, AVG_PBR_PER_BLOCK, AVG_PWAR_PER_BLOCK, CORGIB_BLOCKS_PER_YEAR, NUMBER_BLOCKS_PER_YEAR, PWAR_BLOCKS_PER_YEAR } from "../constants";
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
  
  try {
    
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    // accounts = await web3.eth.getAccounts();
    // console.log('accounts', accounts)
    const accountAddress = accounts.length > 0 ? accounts[0] : null;
    return accountAddress
  } catch (error) {
    console.log('getAccounts', error)
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
    const id =  await window.ethereum.networkVersion;

    if (id) {
      return id
    }else{
      return await web3.eth.getChainId()
    }
  }else{
    return await web3.eth.getChainId()
  }
};

export const formatCurrency = (value, usd = false, fractionDigits = 1, currencyFormat = false) => {
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
  const netId = window.ethereum.networkVersion
  if (['97', '56'].includes(netId) && !currencyFormat ) {  // for bsc network only
    return convertToInternationalCurrencySystem(value ? value : 0, formatter)
  }
  return formatter.format(value ? value : 0).slice(1);

};

function convertToInternationalCurrencySystem(labelValue, formatter) {

  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9

    ? formatter.format((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)).slice(1)  + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

      ? formatter.format((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)).slice(1)  + "M"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3

        ? formatter.format( (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) ).slice(1)  + "K"

        : formatter.format(Math.abs(Number(labelValue))).slice(1) ;

}

export const resetCurrencyFormatting = (value) => {
  return value.split(',').join('')
}

export const isNumber = (value) => {
  return !isNaN(parseInt(value)) 
}

export const isMetaMaskInstalled = () => {
  return typeof window.web3 !== "undefined";
};

export const getApy = (tokenType, poolObj) => {
  // const NUMBER_BLOCKS_PER_YEAR = 2400000;

  let tokenPrice = new BigNumber(poolObj.tokenPrice);

  if (tokenType === 'CORGIB') {

    const total_value_locked_usd = tokenPrice.times(
      new BigNumber(fromWei(poolObj.totalTokenStaked))
    );
    const apy = tokenPrice
      .times(new BigNumber(CORGIB_BLOCKS_PER_YEAR))
      .times(new BigNumber(AVG_CORGIB_PER_BLOCK))
      .div(total_value_locked_usd)
      .times(100)
      .toFixed(1)
      .toString();
    return apy

  }else if(tokenType === 'PWAR'){

    const total_value_locked_usd = tokenPrice.times(
      new BigNumber(fromWei(poolObj.totalTokenStaked))
    );
    const apy = tokenPrice
      .times(new BigNumber(PWAR_BLOCKS_PER_YEAR))
      .times(new BigNumber(AVG_PWAR_PER_BLOCK))
      .div(total_value_locked_usd)
      .times(100)
      .toFixed(1)
      .toString();
    return apy
  }

  const avg_tokens_perblock = tokenType === 'PBR' ? AVG_PBR_PER_BLOCK : AVG_BITE_PER_BLOCK;
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