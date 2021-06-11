import { stakingAddressKoven, stakingAddressMainnet } from "../../constants";
import Web3 from "web3";
import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";

const address = stakingAddressKoven;
// process.env.NODE_ENV === "development"
//   ? stakingAddressKoven
//   : stakingAddressMainnet;

const abi = PolkaBridgeStaking;

const web3 = new Web3(window.ethereum);
export default new web3.eth.Contract(abi, address);
