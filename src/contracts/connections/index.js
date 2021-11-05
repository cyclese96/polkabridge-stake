import Web3 from "web3";
import Bite from "../abi/Bite.json";
import PolkaBridge from "../abi/PolkaBridge.json";
import PolkaBridgeMatic from "../abi/pbrMatic.json";
import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";
import PolkaBridgeStakingMatic from "../abi/polkabridgeStakingMatic.json";
import CorgibStaking from "../abi/CorgibStaking.json";
import PolkaBridgeMemeToken from "../abi/PolkaBridgeMemeToken.json";
import pwarCoin from "../abi/Pwar.json";
import cl365 from "../abi/Cl365.json";
import erc20TokenAbi from '../abi/erc20.json';

import {
  biteAddressKoven,
  biteAddressMainnet,
  bscConfig,
  bscNetwork,
  clf365AddressKoven,
  clf365AddressMainnet,
  corgibMemeCoinMainnet,
  corgibMemeCoinTestent,
  corgibStakingMainent,
  corgibStakingTestent,
  currentConnection,
  etheriumNetwork,
  harmonyNetwork,
  maticConfig,
  maticNetwork,
  pbrAddressKoven,
  pbrAddressMainnet,
  pbrAddressMaticMainnet,
  pbrAddressMaticTestnet,
  pbrStakingMaticMainnet,
  pbrStakingMaticTestnet,
  pwarAddressMainnet,
  pwarAddressTestnet,
  stakeContractAdrresses,
  stakingAddressKoven,
  stakingAddressMainnet,
  tokenContarctAddresses,
} from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";

export const biteContract = (network) => {
  const address =
    currentConnection === "testnet" ? biteAddressKoven : biteAddressMainnet;

  const abi = Bite;

  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pbrContract = (network) => {
  let address;
  const abi = erc20TokenAbi;
  if (network === maticNetwork) {
    address =
      currentConnection === "testnet"
        ? pbrAddressMaticTestnet
        : pbrAddressMaticMainnet;
  } else if (network === harmonyNetwork) {
    address =
      currentConnection === "testnet"
        ? tokenContarctAddresses.PBR.harmony.testnet
        : tokenContarctAddresses.PBR.harmony.mainnet;
  } else {
    address =
      currentConnection === "testnet" ? pbrAddressKoven : pbrAddressMainnet;
  }

  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const clf365Contract = (network) => {
  const address =
    currentConnection === "testnet" ? clf365AddressKoven : clf365AddressMainnet;

  const abi = cl365;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const corgibCoinContract = (network) => {
  const address =
    currentConnection === "testnet"
      ? corgibMemeCoinTestent
      : corgibMemeCoinMainnet;

  const abi = PolkaBridgeMemeToken;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const pwarCoinContract = (network) => {
  const address =
    currentConnection === "testnet" ? pwarAddressTestnet : pwarAddressMainnet;

  const abi = pwarCoin;
  const connection = getCurrentConnection(network, abi, address);
  return connection;
};

export const erc20TokenContract = (network, tokenAddress) => {
  const abi = PolkaBridge
  const connection = getCurrentConnection(network, abi, tokenAddress);
  return connection;
}

export const stakeContract = (network) => {
  if (network === bscNetwork) {
    const address =
      currentConnection === "testnet"
        ? corgibStakingTestent
        : corgibStakingMainent;

    const abi = CorgibStaking;
    const connection = getCurrentConnection(network, abi, address);
    return connection;
  } else if (network === maticNetwork) {
    const address =
      currentConnection === "testnet"
        ? pbrStakingMaticTestnet
        : pbrStakingMaticMainnet;

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
        ? stakingAddressKoven
        : stakingAddressMainnet;

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
