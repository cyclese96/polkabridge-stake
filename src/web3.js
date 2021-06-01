import Web3 from "web3";

var web3;
if (typeof window.web3 !== "undefined") {
  // Use Mist/MetaMask's provider.
  web3 = new Web3(window.web3.currentProvider);
} else {
  const infura = `https://mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
  console.log("infura", process.env.REACT_APP_API_KEY);
  web3 = new Web3(new Web3.providers.HttpProvider(infura));
}
export default web3;
