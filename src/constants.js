// stake contract addresses

export const stakeContractAdrresses = {
  ethereum: {
    testnet: "0x7678f0AF7304e01554E2D49D96E55C8de4975c66",
    mainnet: "0x1b46b72c5280f30Fbe8A958B4f3c348FD0fD2E55",
  },
  polygon: {
    testnet: "0x55950cF279Ba5b43263f4Df54833b85F684B333F",
    mainnet: "0x6335aF028e77B574423733443678aD4cb9e15B3D",
  },
  harmony: {
    testnet: "0x7a1238cba81de51158c150ffb48a2dba14b987bd",
    mainnet: "0x7a1238cba81de51158c150ffb48a2dba14b987bd",
  },
  bsc: {
    testnet: "0xA5c2186CFb734828EE89a4087FD571F12Af1E895",
    mainnet: "0x064dE1e65df3F40Afd7fb9E8A1Af61bD4545f4a1",
  },
};

export const tokenContarctAddresses = {
  PBR: {
    ethereum: {
      testnet: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
      mainnet: "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695",
    },
    polygon: {
      testnet: "0x6024ca0b7c12846a396a5d860ff885233ef16dd0",
      mainnet: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
    },
    harmony: {
      testnet: "0xfc649ce83d2b25086bf645ca88a9621b5e8a36fa",
      mainnet: "0xfc649ce83d2b25086bf645ca88a9621b5e8a36fa",
    },
  },
  BITE: {
    ethereum: {
      testnet: "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA",
      mainnet: "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d",
    },
  },
  CFL365: {
    ethereum: {
      testnet: "0x1F6fE20C82950F5139e8b31D5C32A73EE992e9E1",
      mainnet: "0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe",
    },
  },
  PWAR: {
    bsc: {
      testnet: "0x16153214E683018D5aA318864c8e692b66E16778",
      mainnet: "0x16153214E683018D5aA318864c8e692b66E16778",
    },
  },
  GRAV: {
    bsc: {
      testnet: "0x16153214E683018D5aA318864c8e692b66E16778",
      mainnet: "0xa6168c7e5eb7c5c379f3a1d7cf1073e09b2f031e",
    },
  },
  DEFLY: {
    bsc: {
      testnet: "0x16153214e683018d5aa318864c8e692b66e16778",
      mainnet: "0x0fe6a599c280853621a11c12e1a68e6949cbd08a",
    },
  },
  CORGIB: {
    bsc: {
      testnet: "0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24",
      mainnet: "0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55",
    },
  },
  PUN: {
    ethereum: {
      testnet: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
      mainnet: "0x31903e333809897ee57af57567f4377a1a78756c",
    },
  },
  SHOE: {
    ethereum: {
      testnet: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
      mainnet: "0x0fd67b4ceb9b607ef206904ec73459c4880132c9",
    },
  },
  WELT: {
    polygon: {
      testnet: "0x6024ca0b7c12846a396a5d860ff885233ef16dd0",
      mainnet: "0x23E8B6A3f6891254988B84Da3738D2bfe5E703b9",
    },
  },
};

export const PBR = "PBR";
export const BITE = "BITE";
export const CORGIB = "CORGIB";
export const PWAR = "PWAR";
export const CFL365 = "CFL365";
export const PUN = "PUN";
export const SHOE = "SHOE";
export const WELT = "WELT";
export const GRAV = "GRAV";
export const DEFLY = "DEFLY";

//given token name and network, --> poolId
export const poolId = {
  PBR: 0,
  BITE: 1,
  CORGIB: 0,
  PWAR: 1,
  CFL365: 2,
  PUN: 4,
  SHOE: 3,
  WELT: 1,
  GRAV: 2,
  DEFLY: 3,
};

export const apyConstants = {
  ethereum: {
    PBR: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 1,//0.7
    },
    BITE: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 2,
    },
    CFL365: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0,
    },
    SHOE: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0.5,
    },
    PUN: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0,
    },
  },
  polygon: {
    PBR: {
      NUMBER_BLOCKS_PER_YEAR: 43200 * 365,
      AVG_REWARD_PER_BLOCK: 0.07,
    },
    WELT: {
      NUMBER_BLOCKS_PER_YEAR: 43200 * 365,
      AVG_REWARD_PER_BLOCK: 0.46,
    },
  },
  harmony: {
    PBR: {
      NUMBER_BLOCKS_PER_YEAR: 43200 * 365,
      AVG_REWARD_PER_BLOCK: 0.25,
    },
  },
  bsc: {
    PWAR: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 0.15,
    },
    GRAV: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 0.19,
    },
    DEFLY: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 0.59,
    },
    CORGIB: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 285000,
    },
  },
};

// export const NUMBER_BLOCKS_PER_YEAR = 2400000;
// export const AVG_PBR_PER_BLOCK = 0.65;

// export const NUMBER_BLOCKS_PER_YEAR_MATIC = 43200 * 365;
// export const AVG_PBR_PER_BLOCK_MATIC = 0.04;

// export const AVG_BITE_PER_BLOCK = 2;

export const BITE_PRICE = 0.1;
export const PWAR_PRICE = 0.1;
export const CLF365_PRICE = 0.1;
export const FABWELT_PRICE = 0.028;

// //corgib
// export const CORGIB_BLOCKS_PER_YEAR = 10000000;
// export const AVG_CORGIB_PER_BLOCK = 285000;

// //pwar
// export const PWAR_BLOCKS_PER_YEAR = 10000000;
// export const AVG_PWAR_PER_BLOCK = 0.07;

// //CFL365
// export const CL6365_BLOCKS_PER_YEAR = 2400000;
// export const AVG_CL365_PER_BLOCK = 0;

export const infuraKovenApi = `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split(
  ""
)
  .reverse()
  .join("")}`;
export const infuraMainnetApi = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split(
  ""
)
  .reverse()
  .join("")}`;

/**
 *
 *    'testnet'  BSC testnet testing
 *    'mainnet'  BSC/ETH mainent deployment
 */
const testing = false;
export const currentConnection = testing ? "testnet" : "mainnet";

export const etheriumNetwork = "ethereum";
export const bscNetwork = "bsc";
export const maticNetwork = "matic";
export const harmonyNetwork = "harmony";

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
  network_rpc_mainnet: `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY.split(
    ""
  )
    .reverse()
    .join("")}`,
  network_rpc_testnet: "https://mumbai-explorer.matic.today",
};

export const harmonyConfig = {
  chainId: {
    mainnet: "1666600000",
    testnet: "1666700000",
  },
};
export const claimTokens = "1";

export const supportedNetworks = ["1", "56", "137"];

export const supportedStaking = {
  ethereum: ["PBR"],
  bsc: ["CORGIB", "PWAR", "GRAV", "DEFLY"],
  matic: ["PBR", "WELT"],
  harmony: [],
};

export const unsupportedStaking = {
  ethereum: ["PUN", "CFL365", "SHOE", "BITE"],
  bsc: [],
  matic: [],
  harmony: [],
};

export const minimumStakingAmount = {
  CORGIB: 100000000,
  BITE: 1,
  PBR: 1,
  PWAR: 1,
  CFL365: 1,
  PUN: 1,
  SHOE: 1,
  WELT: 1,
  GRAV: 1,
  DEFLY: 1,
};
