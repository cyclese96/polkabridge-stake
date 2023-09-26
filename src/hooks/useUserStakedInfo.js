import { useEffect, useState } from "react";
import useBlockNumber from "./useBlockNumber";
import STAKE_ABI from "../contracts/abi/PolkaBridgeStaking.json";
import { STAKE_ADDRESSES } from "../constants/index";
import useActiveWeb3React from "./useActiveWeb3React";
import { readContracts } from "wagmi";

export function useUserStakedInfo(poolId) {
  const { chainId, account } = useActiveWeb3React();
  const [userInfo, setUserInfo] = useState({
    staked: "0",
    claimed: "0",
    pending: "",
  });

  const blockNumber = useBlockNumber();

  useEffect(() => {
    // console.log("user staked info fetch params  ", {
    //   chainId,
    //   account,
    //   poolId,
    // });
    async function fetchData() {
      if (!chainId || !account || poolId === undefined) {
        console.log("user staked info fetch params  ", {
          chainId,
          account,
          poolId,
        });
        return;
      }

      try {
        const [_userInfo, _pendingRewards] = await readContracts({
          contracts: [
            {
              address: STAKE_ADDRESSES?.[chainId]?.toString(),
              abi: STAKE_ABI,
              functionName: "userInfo",
              args: [poolId, account],
              chainId: parseInt(chainId),
            },
            {
              address: STAKE_ADDRESSES?.[chainId]?.toString(),
              abi: STAKE_ABI,
              functionName: "pendingReward",
              args: [poolId, account],
              chainId: parseInt(chainId),
            },
          ],
        });
        setUserInfo({
          pending: _pendingRewards?.result?.toString(),
          staked: _userInfo?.result?.[0]?.toString(),
          claimed: _userInfo?.result?.[2]?.toString(),
        });
      } catch (error) {
        console.log("user staked info fetch error ", error);
      }
    }

    fetchData();
  }, [chainId, account, poolId, blockNumber]);
  return { ...userInfo };
}
