import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import {
  bsc,
  mainnet,
  polygon,
  arbitrum,
  bscTestnet,
  goerli,
  polygonMumbai,
  arbitrumGoerli,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
const chains = [
  mainnet,
  goerli,
  arbitrum,
  arbitrumGoerli,
  bsc,
  bscTestnet,
  polygon,
  polygonMumbai,
];
export const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
console.log("running");
const { publicClient } = configureChains(chains, [
  publicProvider(),
  w3mProvider({ projectId }),
]);
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
