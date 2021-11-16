import Web3 from "web3";
import PolkaBridge from "../abi/PolkaBridge.json";

import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";
import PolkaBridgeStakingMatic from "../abi/polkabridgeStakingMatic.json";
import CorgibStaking from "../abi/CorgibStaking.json";


import {
  bscConfig,
  bscNetwork,
  currentConnection,
  etheriumNetwork,
  harmonyNetwork,
  maticConfig,
  maticNetwork,
  stakeContractAdrresses,
} from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";


export const erc20TokenContract = (network, tokenAddress) => {
  const abi = PolkaBridge;
  const connection = getCurrentConnection(network, abi, tokenAddress);
  return connection;
};

export const stakeContract = (network) => {
  if (network === bscNetwork) {
    const address =
      currentConnection === "testnet"
        ? stakeContractAdrresses.bsc.testnet
        : stakeContractAdrresses.bsc.mainnet;

    const abi = CorgibStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else if (network === maticNetwork) {
    const address =
      currentConnection === "testnet"
        ? stakeContractAdrresses.polygon.testnet
        : stakeContractAdrresses.polygon.mainnet;

    const abi = PolkaBridgeStakingMatic;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else if (network === harmonyNetwork) {
    const address =
      currentConnection === "testnet"
        ? stakeContractAdrresses.harmony.testnet
        : stakeContractAdrresses.harmony.mainnet;

    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    const address =
      currentConnection === "testnet"
        ? stakeContractAdrresses.ethereum.testnet
        : stakeContractAdrresses.ethereum.mainnet;

    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  }
};

const getCurrentConnection = (blockChainNetwork, abi, contractAddress) => {
  if (blockChainNetwork === etheriumNetwork) {
    if (isMetaMaskInstalled()) {
      const web3 = new Web3(window.ethereum);
      return new web3.eth.Contract(abi, contractAddress);
    } else {
      const infura =
        currentConnection === "testnet"
          ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split('').reverse().join('')}`
          : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split('').reverse().join('')}`;

      const web3 = new Web3(new Web3.providers.HttpProvider(infura));
      return new web3.eth.Contract(abi, contractAddress);
    }
  } else if (blockChainNetwork === maticNetwork) {
    // const rpc =
    //   currentConnection === "testnet"
    //     ? maticConfig.network_rpc_testnet
    //     : maticConfig.network_rpc_mainnet;
    console.log('matic instance')
    const web3 = new Web3(window.ethereum);

    return new web3.eth.Contract(abi, contractAddress);
  } else if (blockChainNetwork === harmonyNetwork) {
    // const rpc =
    //   currentConnection === "testnet"
    //     ? maticConfig.network_rpc_testnet
    //     : maticConfig.network_rpc_mainnet;
    const web3 = new Web3(window.ethereum);

    return new web3.eth.Contract(abi, contractAddress);
  } else {
    // const web3 = new Web3(new Web3.providers.HttpProvider(bscConfig.network_rpc_testnet));
    // const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(abi, contractAddress);
  }
};
