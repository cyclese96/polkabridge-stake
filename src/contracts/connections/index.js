import Web3 from "web3";
import PolkaBridge from "../abi/PolkaBridge.json";
import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";
import PolkaBridgeStakingMatic from "../abi/polkabridgeStakingMatic.json";
import CorgibStaking from "../abi/CorgibStaking.json";
import { ankrRpc, STAKE_ADDRESSES } from "../../constants";
import { isMetaMaskInstalled } from "../../utils/helper";
import config from "../../utils/config";

export const erc20TokenContract = (chainId, tokenAddress, library) => {
  const abi = PolkaBridge;
  const connection = getCurrentConnection(chainId, abi, tokenAddress);
  return connection;
};

export const stakeContract = (chainId) => {
  if (chainId?.toString() === "56") {
    const address = STAKE_ADDRESSES?.[chainId];

    const abi = CorgibStaking;
    const connection = getCurrentConnection(chainId, abi, address);
    return connection;
  } else if (chainId?.toString() === "137") {
    const address = STAKE_ADDRESSES?.[chainId];
    const abi = PolkaBridgeStakingMatic;
    const connection = getCurrentConnection(chainId, abi, address);
    return connection;
  } else if (chainId?.toString() === config.hmyChainMainnet?.toString()) {
    const address = STAKE_ADDRESSES?.[chainId];

    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(chainId, abi, address);
    return connection;
  } else if (chainId?.toString() === "1") {
    const address = STAKE_ADDRESSES?.[chainId];
    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(chainId, abi, address);
    return connection;
  } else {
    const address = STAKE_ADDRESSES?.[1];
    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(1, abi, address);
    return connection;
  }
};

const getCurrentConnection = (chainId, abi, contractAddress) => {
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
  const _ankrRpc = ankrRpc?.[chainId];

  const web3 = isMetaMaskInstalled()
    ? new Web3(window.ethereum)
    : new Web3(
        new Web3.providers.HttpProvider(_ankrRpc ? _ankrRpc : ankrRpc[1])
      );
  return new web3.eth.Contract(abi, contractAddress);
};
