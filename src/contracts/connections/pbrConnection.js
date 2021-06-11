import Web3 from "web3";
import PolkaBridge from "../abi/PolkaBridge.json";
import { currentConnection, pbrAddressKoven, pbrAddressMainnet } from "../../constants";

const address = currentConnection === 'koven' ? pbrAddressKoven : pbrAddressMainnet;
// process.env.NODE_ENV === "development" ? pbrAddressKoven : ;
//"0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695";
const abi = PolkaBridge;
const web3 = new Web3(window.ethereum);
export default new web3.eth.Contract(abi, address);
