//mainnet contracts
export const pbrAddressMainnet = "0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695";
export const biteAddressMainnet = "0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d";
export const stakingAddressMainnet =
  "0x1b46b72c5280f30Fbe8A958B4f3c348FD0fD2E55";

//koven contracts/
export const pbrAddressKoven = "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0";
export const biteAddressKoven = "0xA9Bf3904f7216B4cA2BA862Ac27b9469c030C0eA";
export const stakingAddressKoven = "0x7678f0AF7304e01554E2D49D96E55C8de4975c66";

export const poolId = {
  'PBR': 0,
  'BITE': 1
}

export const NUMBER_BLOCKS_PER_YEAR = 2400000;
export const AVG_PBR_PER_BLOCK = 1.5;
export const AVG_BITE_PER_BLOCK = 2;

export const BITE_PRICE = 0.1;

export const infuraKovenApi = `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
export const infuraMainnetApi = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`

export const currentConnection = 'koven' //mainnet

export const etheriumNetwork = 'etherium'
export const bscNetwork = 'bsc'

export const etherConfig = {
  network_id: {
    mainet: '1',
    koven: '42'
  }
}

export const bscConfig = {
  network_id: {
    mainnet: '97',
    testnet: '56'
  },
  network_address: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
};

export const claimTokens = '1'