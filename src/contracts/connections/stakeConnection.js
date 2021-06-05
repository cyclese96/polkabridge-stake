import { stakingAddressKoven, stakingAddressMainnet } from "../../constants";
import web3 from "../../web3";
import PolkaBridgeStaking from "../PolkaBridgeStaking.json";

const address =
  process.env.NODE_ENV === "development"
    ? stakingAddressKoven
    : stakingAddressMainnet;

const abi = PolkaBridgeStaking;

export default new web3.eth.Contract(abi, address);
