import Web3 from "web3";
import Bite from "../abi/Bite.json";
import PolkaBridge from "../abi/PolkaBridge.json";
import PolkaBridgeStaking from "../abi/PolkaBridgeStaking.json";
import { biteAddressKoven, biteAddressMainnet, bscConfig, currentConnection, etheriumNetwork, pbrAddressKoven, pbrAddressMainnet, stakingAddressKoven, stakingAddressMainnet } from "../../constants";


export const biteContract = (network) => {

    const address = currentConnection === 'koven' ? biteAddressKoven : biteAddressMainnet;

    const abi = Bite;

    const connection = getCurrentConnection(network, abi, address)
    return connection;
}

export const pbrContract = (network) => {

    const address = currentConnection === 'koven' ? pbrAddressKoven : pbrAddressMainnet;

    const abi = PolkaBridge;
    const connection = getCurrentConnection(network, abi, address)
    return connection;

}

export const stakeContract = (network) => {

    const address = currentConnection === 'koven' ? stakingAddressKoven : stakingAddressMainnet;

    const abi = PolkaBridgeStaking;
    const connection = getCurrentConnection(network, abi, address)
    return connection;
}

const getCurrentConnection = (network, abi, contractAddress) => {
    if (network === etheriumNetwork) {

        const web3 = new Web3(window.ethereum);
        return new web3.eth.Contract(abi, contractAddress);

    } else {
        const web3 = new Web3(new Web3.providers.HttpProvider(bscConfig.network_address));
        return new web3.eth.Contract(abi, contractAddress);
    }
}