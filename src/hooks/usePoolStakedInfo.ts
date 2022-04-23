import { useEffect, useMemo, useState } from "react";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useStakeContract } from "./useContract";
import { PoolInfo, Token } from "../utils/interface";
import { getApy, getCurrentNetworkName } from "../utils/helper";
import useActiveWeb3React from "./useActiveWeb3React";
import { stakeContract } from "../contracts/connections/index";

export function usePoolStakedInfo(
  poolId?: number,
  poolToken?: Token,
  selectedChain?: number
): PoolInfo | null {
  const { active } = useActiveWeb3React();
  const currSTakeContract = useStakeContract();
  const [poolInfo2, setPoolData] = useState(null);

  const _stakeContract = stakeContract(selectedChain);
  const poolInfoInputs = [poolId];

  const poolInfo = useSingleCallResult(
    currSTakeContract,
    "getPoolInfo",
    poolInfoInputs
  ).result;

  async function fetchData() {
    try {
      let res = await _stakeContract.methods.getPoolInfo(poolId).call();
      setPoolData(res);
    } catch (error) {
      setPoolData(null);
    }
  }

  useEffect(() => {
    if (!active && selectedChain) {
      fetchData();
    }
  }, [selectedChain]);

  const poolObj = {
    accTokenPerShare: active ? poolInfo?.[0]?.toString() : poolInfo2?.[0],
    lastRewardBlock: active ? poolInfo?.[1].toString() : poolInfo2?.[1],
    rewardPerBlock: active ? poolInfo?.[2]?.toString() : poolInfo2?.[2],
    totalTokenStaked: active ? poolInfo?.[3]?.toString() : poolInfo2?.[3],
    totalTokenClaimed: active ? poolInfo?.[4]?.toString() : poolInfo2?.[4],
  };

  return useMemo(
    () =>
      poolToken && poolObj
        ? {
            staked: poolObj.totalTokenStaked,
            claimed: poolObj.totalTokenClaimed,
            apy: getApy(
              poolToken.symbol,
              poolObj,
              getCurrentNetworkName(selectedChain)
            )?.toString(),
          }
        : null,
    [poolToken, active ? poolInfo : poolInfo2, selectedChain]
  );
}
