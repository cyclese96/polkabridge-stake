//mainnet contracts
export const pbrAddressMainnet = "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695";
export const biteAddressMainnet = "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d";
export const clf365AddressMainnet =
  "0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe";
export const stakingAddressMainnet =
  "0x1b46b72c5280f30Fbe8A958B4f3c348FD0fD2E55";

//koven contracts/
export const pbrAddressKoven = "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0";
export const biteAddressKoven = "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA";
export const clf365AddressKoven = "0x1F6fE20C82950F5139e8b31D5C32A73EE992e9E1";
export const stakingAddressKoven = "0x7678f0AF7304e01554E2D49D96E55C8de4975c66";
//Matic Network
export const pbrAddressMaticMainnet =
  "0x6024ca0b7c12846a396a5d860ff885233ef16dd0";
export const pbrAddressMaticTestnet =
  "0x6024ca0b7c12846a396a5d860ff885233ef16dd0";

export const pbrStakingMaticMainnet =
  "0x6335aF028e77B574423733443678aD4cb9e15B3D";
export const pbrStakingMaticTestnet =
  "0x55950cF279Ba5b43263f4Df54833b85F684B333F";

// corgib
export const corgibStakingTestent =
  "0xA5c2186CFb734828EE89a4087FD571F12Af1E895";
export const corgibStakingMainent =
  "0x064dE1e65df3F40Afd7fb9E8A1Af61bD4545f4a1";
export const corgibMemeCoinTestent =
  "0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24";
export const corgibMemeCoinMainnet =
  "0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55";

//pwar

export const pwarAddressTestnet = "0x16153214E683018D5aA318864c8e692b66E16778";
export const pwarAddressMainnet = "0x16153214E683018D5aA318864c8e692b66E16778";

export const PBR = "PBR";
export const BITE = "BITE";
export const CORGIB = "CORGIB";
export const PWAR = "PWAR";
export const CFL365 = "CFL365";

export const poolId = {
  PBR: 0,
  BITE: 1,
  CORGIB: 0,
  PWAR: 1,
  CFL365: 2,
};

export const NUMBER_BLOCKS_PER_YEAR = 2400000;
export const AVG_PBR_PER_BLOCK = 1.5;
export const AVG_BITE_PER_BLOCK = 2;

export const BITE_PRICE = 0.1;
export const PWAR_PRICE = 0.1;
export const CLF365_PRICE = 0.1;

//corgib
export const CORGIB_BLOCKS_PER_YEAR = 10000000;
export const AVG_CORGIB_PER_BLOCK = 285000;

//pwar
export const PWAR_BLOCKS_PER_YEAR = 10000000;
export const AVG_PWAR_PER_BLOCK = 0.35;

//CFL365
export const CL6365_BLOCKS_PER_YEAR = 2400000;
export const AVG_CL365_PER_BLOCK = 10;

export const infuraKovenApi = `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
export const infuraMainnetApi = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;

/**
 *
 *    'testnet'  BSC testnet testing
 *    'mainnet'  BSC/ETH mainent deployment
 */
export const currentConnection = "testnet";
// export const currentConnection = "mainnet";

export const etheriumNetwork = "ethereum";
export const bscNetwork = "bsc";
export const maticNetwork = "matic";

export const etherConfig = {
  network_id: {
    mainet: "1",
    koven: "42",
  },
};

export const bscConfig = {
  network_id: {
    mainnet: "56",
    testnet: "97",
  },
  network_rpc_mainnet: "https://bsc-dataseed.binance.org/",
  network_rpc_testnet: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};

export const maticConfig = {
  network_id: {
    mainnet: "137",
    testnet: "80001",
  },
  network_rpc_mainnet: "https://rpc-mumbai.matic.today",
  network_rpc_testnet: "https://mumbai-explorer.matic.today",
};

export const claimTokens = "1";

export const supportedNetworks = ["1", "56", "137"];

export const supportedStaking = {
  ethereum: ["PBR", "BITE", "CFL365"],
  bsc: ["CORGIB", "PWAR"],
  matic: ["PBR"],
};

export const minimumStakingAmount = {
  CORGIB: 100000000,
  BITE: 1,
  PBR: 1,
  PWAR: 1,
  CFL365: 1,
};
