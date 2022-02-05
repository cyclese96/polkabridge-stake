import Web3 from "web3";
import PolkaBridge from "../abi/PolkaBridge.json";

import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";
import PolkaBridgeStakingMatic from "../abi/polkabridgeStakingMatic.json";
import CorgibStaking from "../abi/CorgibStaking.json";
import {
  ankrRpc,
  bscNetwork,
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
    return null;
  }
};

const getCurrentConnection = (blockChainNetwork, abi, contractAddress) => {
  // console.log('initializing   matic instance', blockChainNetwork)
  // const infura =
  //   currentConnection === "testnet"
  //     ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split(
  //         ""
  //       )
  //         .reverse()
  //         .join("")}`
  //     : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split(
  //         ""
  //       )
  //         .reverse()
  //         .join("")}`;
  const _ankrRpc = ankrRpc?.[blockChainNetwork];

  const web3 = isMetaMaskInstalled()
    ? new Web3(window.ethereum)
    : new Web3(
        new Web3.providers.HttpProvider(_ankrRpc ? _ankrRpc : ankrRpc.ethereum)
      );
  return new web3.eth.Contract(abi, contractAddress);
};
