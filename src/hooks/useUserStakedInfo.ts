import { useMemo } from "react";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useStakeContract } from "./useContract";
import { UserStakedInfo } from "../utils/interface";

export function useUserStakedInfo(
  poolId?: number,
  account?: string
): UserStakedInfo | null {
  const stakeContract = useStakeContract();

  const inputs = [poolId, account];

  const userInfo = useSingleCallResult(
    stakeContract,
    "userInfo",
    inputs
  ).result;
  const pendingReward = useSingleCallResult(
    stakeContract,
    "pendingReward",
    inputs
  ).result;

  return useMemo(
    () =>
      userInfo && pendingReward
        ? {
            staked: userInfo?.[0]?.toString(),
            claimed: userInfo?.[1]?.toString(),
            pending: pendingReward?.toString(),
          }
        : null,
    [userInfo]
  );
}
