import Web3 from "web3";
import PolkaBridge from "../abi/PolkaBridge.json";

import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";
import PolkaBridgeStakingMatic from "../abi/polkabridgeStakingMatic.json";
import CorgibStaking from "../abi/CorgibStaking.json";
import {
  bscNetwork,
  currentConnection,
  etheriumNetwork,
  harmonyNetwork,
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
  // console.log('initializing web3 connection on ', network)
  if (network === bscNetwork) {

    const address = stakeContractAdrresses?.[network];

    const abi = CorgibStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else if (network === maticNetwork) {

    const address = stakeContractAdrresses?.[network];
    const abi = PolkaBridgeStakingMatic;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else if (network === harmonyNetwork) {


    const address = stakeContractAdrresses?.[network];

    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else if (network === etheriumNetwork) {

    const address = stakeContractAdrresses?.[network];
    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else {
    return null
  }
};

const getCurrentConnection = (blockChainNetwork, abi, contractAddress) => {
  // console.log('initializing   matic instance', blockChainNetwork)
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
    // console.log('initializing   matic instance')
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
