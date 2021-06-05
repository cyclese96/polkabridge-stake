import web3 from "../../web3";
import PolkaBridge from "../PolkaBridge.json";
import { pbrAddressKoven, pbrAddressMainnet } from "../../constants";

const address =
  process.env.NODE_ENV == "development" ? pbrAddressKoven : pbrAddressMainnet;
//"0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695";
const abi = PolkaBridge;

export default new web3.eth.Contract(abi, address);
