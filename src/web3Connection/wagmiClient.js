import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createClient } from "wagmi";
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

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);
