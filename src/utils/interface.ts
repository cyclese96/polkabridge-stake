export interface Token {
  //   name: string;
  //   decimals: number;
  symbol: string;
  address: string;
}

export interface PoolInfo {
  apy: string;
  staked: string;
  claimed: string;
}

export interface UserStakedInfo {
  staked: string;
  claimed: string;
  pending: string;
}

export interface TransactionStatus {
  status: string;
  hash: string | null;
}
