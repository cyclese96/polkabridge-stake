const testing = false;
export const currentConnection = testing ? "testnet" : "mainnet";

export const STAKE_ADDRESSES: { [index: number]: string } = {
  1: "0x1b46b72c5280f30Fbe8A958B4f3c348FD0fD2E55",
  42: "0x7678f0AF7304e01554E2D49D96E55C8de4975c66",
  137: "0x6335aF028e77B574423733443678aD4cb9e15B3D",
  80001: "0x55950cF279Ba5b43263f4Df54833b85F684B333F",
  1666600000: "0x7a1238cba81de51158c150ffb48a2dba14b987bd", //harmony mainnet
  1666700000: "0x7a1238cba81de51158c150ffb48a2dba14b987bd", // harmony testnet,
  56: "0x064dE1e65df3F40Afd7fb9E8A1Af61bD4545f4a1", // bsc mainnet
  97: "0xA5c2186CFb734828EE89a4087FD571F12Af1E895", // bsc testnet
};

// stake contract addresses
export const stakeContractAdrresses = {
  ethereum:
    currentConnection === "mainnet"
      ? "0x1b46b72c5280f30Fbe8A958B4f3c348FD0fD2E55"
      : "0x7678f0AF7304e01554E2D49D96E55C8de4975c66",
  matic:
    currentConnection === "mainnet"
      ? "0x6335aF028e77B574423733443678aD4cb9e15B3D"
      : "0x55950cF279Ba5b43263f4Df54833b85F684B333F",
  harmony:
    currentConnection === "mainnet"
      ? "0x7a1238cba81de51158c150ffb48a2dba14b987bd"
      : "0x7a1238cba81de51158c150ffb48a2dba14b987bd",
  bsc:
    currentConnection === "mainnet"
      ? "0x064dE1e65df3F40Afd7fb9E8A1Af61bD4545f4a1"
      : "0xA5c2186CFb734828EE89a4087FD571F12Af1E895",
};

export const tokenAddresses = {
  PBR: {
    1: "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695", // mainnet
    42: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0", // koven
    137: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0", //  polygon mainnet
    80001: "0x6024ca0b7c12846a396a5d860ff885233ef16dd0", // polygon testnet
  },
  BITE: {
    1: "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d",
    42: "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA",
  },
  CFL365: {
    1: "0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe",
    42: "0x1F6fE20C82950F5139e8b31D5C32A73EE992e9E1",
  },
  PUN: {
    1: "0x31903e333809897ee57af57567f4377a1a78756c",
    42: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
  },
  SHOE: {
    1: "0x0fd67b4ceb9b607ef206904ec73459c4880132c9",
    42: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
  },
  LABS: {
    1: "0x8b0e42f366ba502d787bb134478adfae966c8798",
    42: "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
  },
  WELT: {
    1: "0x23E8B6A3f6891254988B84Da3738D2bfe5E703b9",
    42: "0x6024ca0b7c12846a396a5d860ff885233ef16dd0",
  },
  PWAR: {
    56: "0x16153214E683018D5aA318864c8e692b66E16778",
    97: "0x16153214E683018D5aA318864c8e692b66E16778",
  },
  CORGIB: {
    56: "0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55",
    97: "0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24",
  },
  DEFLY: {
    56: "0x0fe6a599c280853621a11c12e1a68e6949cbd08a",
    97: "0x16153214E683018D5aA318864c8e692b66E16778",
  },
  AOG: {
    56: "0x40c8225329bd3e28a043b029e0d07a5344d2c27c",
    97: "0x16153214E683018D5aA318864c8e692b66E16778",
  },
  GRAV: {
    56: "0xa6168c7e5eb7c5c379f3a1d7cf1073e09b2f031e",
    97: "0x16153214E683018D5aA318864c8e692b66E16778",
  },
};

export const tokenContarctAddresses = {
  ethereum: {
    PBR:
      currentConnection === "mainnet"
        ? "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695"
        : "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
    BITE:
      currentConnection === "mainnet"
        ? "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d"
        : "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA",
    CFL365:
      currentConnection === "mainnet"
        ? "0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe"
        : "0x1F6fE20C82950F5139e8b31D5C32A73EE992e9E1",
    PUN:
      currentConnection === "mainnet"
        ? "0x31903e333809897ee57af57567f4377a1a78756c"
        : "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
    SHOE:
      currentConnection === "mainnet"
        ? "0x0fd67b4ceb9b607ef206904ec73459c4880132c9"
        : "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
    LABS:
      currentConnection === "mainnet"
        ? "0x8b0e42f366ba502d787bb134478adfae966c8798"
        : "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
  },
  matic: {
    PBR:
      currentConnection === "mainnet"
        ? "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0"
        : "0x6024ca0b7c12846a396a5d860ff885233ef16dd0",
    WELT:
      currentConnection === "mainnet"
        ? "0x23E8B6A3f6891254988B84Da3738D2bfe5E703b9"
        : "0x6024ca0b7c12846a396a5d860ff885233ef16dd0",
  },
  harmony: {
    PBR:
      currentConnection === "mainnet"
        ? "0xfc649ce83d2b25086bf645ca88a9621b5e8a36fa"
        : "0xfc649ce83d2b25086bf645ca88a9621b5e8a36fa",
  },
  bsc: {
    PWAR:
      currentConnection === "mainnet"
        ? "0x16153214E683018D5aA318864c8e692b66E16778"
        : "0x16153214E683018D5aA318864c8e692b66E16778",
    CORGIB:
      currentConnection === "mainnet"
        ? "0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55"
        : "0xE428Cc8A06Cdba0ad5074180f8E80ec6D4083b24",
    GRAV:
      currentConnection === "mainnet"
        ? "0xa6168c7e5eb7c5c379f3a1d7cf1073e09b2f031e"
        : "0x16153214E683018D5aA318864c8e692b66E16778",
    DEFLY:
      currentConnection === "mainnet"
        ? "0x0fe6a599c280853621a11c12e1a68e6949cbd08a"
        : "0x16153214E683018D5aA318864c8e692b66E16778",
    AOG:
      currentConnection === "mainnet"
        ? "0x40c8225329bd3e28a043b029e0d07a5344d2c27c"
        : "0x16153214E683018D5aA318864c8e692b66E16778",
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
export const AOG = "AOG";
export const LABS = "LABS";

export const tokenLogo = {
  PBR: "img/symbol.png",
  BITE: "img/bite.png",
  CORGIB: "img/corgi.png",
  PWAR: "img/pwar.png",
  CFL365: "img/clf365.png",
  PUN: "img/punt.png",
  SHOE: "img/shoefy.png",
  WELT: "img/welt.png",
  GRAV: "img/grv.png",
  DEFLY: "img/defly.png",
  AOG: "img/aog.png",
  LABS: "img/labs.png",
};

export const tokenName = {
  PBR: "PolkaBridge",
  BITE: "DragonBite",
  CORGIB: "Corgi Of PolkaBridge",
  PWAR: "PolkaWar",
  CFL365: "CFL 365",
  PUN: "CryptoPunt",
  SHOE: "Shoefy",
  WELT: "FabWelt",
  GRAV: "Graviton Zero",
  DEFLY: "DeflyBall",
  AOG: "Age of Gods",
  LABS: "LABS Group",
};

export const tokenInfo = {
  PBR: {
    1: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x298d492e8c1d909d3f63bc4a36c66c64acb3d695",
      info: "https://www.coingecko.com/en/coins/polkabridge",
    },
    42: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x298d492e8c1d909d3f63bc4a36c66c64acb3d695",
      info: "https://www.coingecko.com/en/coins/polkabridge",
    },
    137: {
      buy: "https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
      info: "https://www.coingecko.com/en/coins/polkabridge",
    },
    80001: {
      buy: "https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
      info: "https://www.coingecko.com/en/coins/polkabridge",
    },
  },
  BITE: {
    1: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d",
      info: "https://www.coingecko.com/en/coins/dragonbite",
    },
    42: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d",
      info: "https://www.coingecko.com/en/coins/dragonbite",
    },
  },
  CORGIB: {
    56: {
      buy: "https://pancakeswap.finance/swap#/swap?outputCurrency=0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55&inputCurrency=BNB",
      info: "https://www.coingecko.com/en/coins/the-corgi-of-polkabridge",
    },
    97: {
      buy: "https://pancakeswap.finance/swap#/swap?outputCurrency=0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55&inputCurrency=BNB",
      info: "https://www.coingecko.com/en/coins/the-corgi-of-polkabridge",
    },
  },
  PWAR: {
    56: {
      buy: "https://pancakeswap.finance/swap#/swap?outputCurrency=0x16153214e683018d5aa318864c8e692b66e16778&inputCurrency=BNB",
      info: "https://www.coingecko.com/en/coins/polkawar",
    },
    97: {
      buy: "https://pancakeswap.finance/swap#/swap?outputCurrency=0x16153214e683018d5aa318864c8e692b66e16778&inputCurrency=BNB",
      info: "https://www.coingecko.com/en/coins/polkawar",
    },
  },
  GRAV: {
    56: {
      buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.bsc.GRAV}&inputCurrency=BNB`,
      info: "https://www.coingecko.com/en/coins/graviton-zero",
    },
    97: {
      buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.bsc.GRAV}&inputCurrency=BNB`,
      info: "https://www.coingecko.com/en/coins/graviton-zero",
    },
  },
  DEFLY: {
    56: {
      buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.bsc.DEFLY}&inputCurrency=BNB`,
      info: "https://coinmarketcap.com/currencies/deflyball/",
    },
    97: {
      buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.bsc.DEFLY}&inputCurrency=BNB`,
      info: "https://coinmarketcap.com/currencies/deflyball/",
    },
  },
  AOG: {
    56: {
      buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.bsc.AOG}&inputCurrency=BNB`,
      info: "https://coinmarketcap.com/currencies/age-of-gods/",
    },
    97: {
      buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.bsc.AOG}&inputCurrency=BNB`,
      info: "https://coinmarketcap.com/currencies/age-of-gods/",
    },
  },
  CFL365: {
    1: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe",
      info: "https://www.coingecko.com/en/coins/cfl365-finance",
    },
    42: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe",
      info: "https://www.coingecko.com/en/coins/cfl365-finance",
    },
  },
  PUN: {
    1: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x31903e333809897ee57af57567f4377a1a78756c",
      info: "https://www.dextools.io/app/ether/pair-explorer/0xed1ba5252f94e029f41506adeaf90c459c0aca69",
    },
    42: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x31903e333809897ee57af57567f4377a1a78756c",
      info: "https://www.dextools.io/app/ether/pair-explorer/0xed1ba5252f94e029f41506adeaf90c459c0aca69",
    },
  },
  SHOE: {
    1: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0fd67b4ceb9b607ef206904ec73459c4880132c9",
      info: "https://coinmarketcap.com/currencies/shoefy/ico/",
    },
    42: {
      buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0fd67b4ceb9b607ef206904ec73459c4880132c9",
      info: "https://coinmarketcap.com/currencies/shoefy/ico/",
    },
  },
  LABS: {
    1: {
      buy: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${tokenContarctAddresses.ethereum.LABS}`,
      info: "https://coinmarketcap.com/currencies/labs-group/",
    },
    42: {
      buy: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${tokenContarctAddresses.ethereum.LABS}`,
      info: "https://coinmarketcap.com/currencies/labs-group/",
    },
  },
  WELT: {
    137: {
      buy: `https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=${tokenContarctAddresses.matic.WELT}`,
      info: "https://www.dextools.io/app/polygon/pair-explorer/0x55e49f32fbba12aa360eec55200dafd1ac47aaed",
    },
    80001: {
      buy: `https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=${tokenContarctAddresses.matic.WELT}`,
      info: "https://www.dextools.io/app/polygon/pair-explorer/0x55e49f32fbba12aa360eec55200dafd1ac47aaed",
    },
  },
};

//given token name and network, --> poolId
export const poolId: { [index: string]: number } = {
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
  AOG: 4,
  LABS: 5,
};

export const apyConstants = {
  ethereum: {
    PBR: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 1, //0.7
    },
    BITE: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0,
    },
    CFL365: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0,
    },
    SHOE: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0,
    },
    PUN: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 0,
    },
    LABS: {
      NUMBER_BLOCKS_PER_YEAR: 2400000,
      AVG_REWARD_PER_BLOCK: 10.7,
    },
  },
  matic: {
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
      AVG_REWARD_PER_BLOCK: 0, //0.19,
    },
    DEFLY: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 0, //0.59,
    },
    AOG: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 0,
    },
    CORGIB: {
      NUMBER_BLOCKS_PER_YEAR: 10000000,
      AVG_REWARD_PER_BLOCK: 285000,
    },
  },
};

export const tokenPriceConstants = {
  DEFLY: 0.06,
  AOG: 0.3,
};

export const coingeckoTokenId = {
  PBR: "polkabridge",
  BITE: "dragonbite",
  CFL365: "cfl365-finance",
  PUN: "cryptopunt",
  SHOE: "shoefy",
  WELT: "fabwelt",
  CORGIB: "the-corgi-of-polkabridge",
  PWAR: "polkawar",
  GRAV: "graviton-zero",
  LABS: "labs-group",
};

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

export const supportedChainIds = [
  1,
  42,
  56,
  97,
  137,
  80001,
  1666600000, //harmony mainnet
  1666700000, // harmony testnet,
  5,
];

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
  1: [PBR, LABS],
  42: [PBR, LABS],
  56: [CORGIB, PWAR],
  97: [CORGIB, PWAR],
  137: [PBR],
  80001: [PBR],
};

export const unsupportedStaking = {
  1: ["PUN", "CFL365", "SHOE", "BITE"],
  43: ["PUN", "CFL365", "SHOE", "BITE"],
  56: ["AOG", GRAV, DEFLY],
  97: ["AOG", GRAV, DEFLY],
  137: [WELT],
  80001: [WELT],
  1666600000: [],
  1666700000: [],
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
  AOG: 1,
};

export const ankrRpc = {
  1: "https://rpc.ankr.com/eth",
  137: "https://rpc.ankr.com/polygon",
  56: "https://rpc.ankr.com/bsc",
};

export const NetworkContextName = "NETWORK";

export const TOKEN_ALLOWANCE_ALLOWANCE = "999999999";
export const CORGIB_ALLOWANCE_ALLOWANCE =
  "999999999999999999999999999999999999";
