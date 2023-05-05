import { useEffect, useState } from "react";
import { getApy, getCurrentNetworkName } from "../utils/helper";
import useActiveWeb3React from "./useActiveWeb3React";
import useBlockNumber from "./useBlockNumber";
import { readContract } from "@wagmi/core";

import STAKE_ABI from "../contracts/abi/PolkaBridgeStaking.json";
import { STAKE_ADDRESSES } from "../constants/index";

export function usePoolStakedInfo(poolId, poolToken, selectedChain) {
  const { account } = useActiveWeb3React();
  const [poolInfo, setPoolInfo] = useState({
    staked: "0",
    claimed: "0",
    apy: "0",
  });

  const blockNumber = useBlockNumber();

  useEffect(() => {
    async function fetchData() {
      if (!selectedChain || poolId === null) {
        return;
      }
      // console.log("pool info check ", { selectedChain, poolId });
      let _poolInfo;
      try {
        _poolInfo = await readContract({
          address: STAKE_ADDRESSES[selectedChain]?.toString(),
          abi: STAKE_ABI,
          functionName: "getPoolInfo",
          args: [poolId],
          chainId: parseInt(selectedChain),
        });
      } catch (error) {
        console.log("pool info error ", {
          error,
          stakeAddress: STAKE_ADDRESSES[selectedChain],
          poolId,
          selectedChain,
        });
      }
      // console.log("pool info test ", _poolInfo?.toString());

      const poolObj = {
        accTokenPerShare: _poolInfo?.[0]?.toString(),
        lastRewardBlock: _poolInfo?.[1].toString(),
        rewardPerBlock: _poolInfo?.[2]?.toString(),
        totalTokenStaked: _poolInfo?.[3]?.toString(),
        totalTokenClaimed: _poolInfo?.[4]?.toString(),
      };
      // console.log("pool info test ", poolObj);
      const _apy = getApy(
        poolToken.symbol,
        poolObj,
        getCurrentNetworkName(selectedChain)
      )?.toString();

      setPoolInfo({
        staked: _poolInfo?.[3]?.toString(),
        claimed: _poolInfo?.[4]?.toString(),
        apy: _apy,
      });
    }

    fetchData();
  }, [blockNumber, poolToken, selectedChain, account, poolId]);

  return { ...poolInfo };
}
