import Web3 from "web3";
import Bite from "../abi/Bite.json";
import { biteAddressKoven, biteAddressMainnet } from "../../constants";

const address = biteAddressKoven;
// process.env.NODE_ENV === "development" ? pbrAddressKoven : ;
//"0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695";
const abi = Bite;
const web3 = new Web3(window.ethereum);
export default new web3.eth.Contract(abi, address);
