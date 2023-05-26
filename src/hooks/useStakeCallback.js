import { useCallback, useEffect, useMemo, useState } from "react";
import { toWei } from "../utils/helper";
import useActiveWeb3React from "./useActiveWeb3React";
import config from "utils/config";
import STAKE_ABI from "../contracts/abi/PolkaBridgeStaking.json";
import { writeContract } from "@wagmi/core";
import { STAKE_ADDRESSES } from "../constants/index";
import { useWaitForTransaction } from "wagmi";

export function useStakeCallback(tokenSymbol) {
  const { chainId } = useActiveWeb3React();
  const [data, setData] = useState({ hash: "", status: "none" });

  const stakeTokens = useCallback(
    async (stakeAmount, poolId) => {
      try {
        const depositTokens = toWei(stakeAmount);
        setData({ ...data, status: "waiting" });

        let stakeRes;
        if (chainId === config.arbitrumChain) {
          stakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "deposit",
            args: [poolId, depositTokens],
            overrides: { gasLimit: 3050000 },
          });
        } else {
          stakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "deposit",
            args: [poolId, depositTokens],
          });
        }

        if (stakeRes) {
          setData({ ...data, hash: stakeRes?.hash, status: "pending" });
        } else {
          setData({ ...data, status: "failed" });
        }
      } catch (error) {
        setData({ ...data, status: "failed" });

        console.log("stake trx error from hook ", {
          error,
          poolId,
          stakeAmount,
        });
      }
    },
    [setData, chainId, data]
  );

  const unstakeTokens = useCallback(
    async (unstakeAmount, poolId, isEnded) => {
      const withdrawTokens = toWei(unstakeAmount);
      // console.log("calling  for ,", {
      //   unstakeAmount,
      //   poolId,
      //   isEnded,
      //   tokenSymbol,
      // });
      try {
        setData({ ...data, status: "waiting" });

        let unstakeRes = null;

        if (isEnded && tokenSymbol === "AOG") {
          unstakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "emergencyWithdraw",
            args: [poolId, withdrawTokens],
          });
        } else if (chainId === config.arbitrumChain) {
          unstakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "withdraw",
            args: [poolId, withdrawTokens],
            overrides: { gasLimit: 5950000 },
          });
        } else {
          // console.log("calling withdraw for ,", {
          //   unstakeAmount,
          //   poolId,
          //   isEnded,
          //   tokenSymbol,
          // });
          unstakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "withdraw",
            args: [poolId, withdrawTokens],
          });

          // unstakeRes = await stakeContract?.withdraw(poolId, withdrawTokens);
        }

        if (unstakeRes) {
          setData({ ...data, hash: unstakeRes?.hash, status: "pending" });
        } else {
          setData({ ...data, status: "failed" });
        }
      } catch (error) {
        setData({ ...data, status: "failed" });

        console.log("unstake error ", error);
      }
    },
    [setData, data, chainId, tokenSymbol]
  );

  const emergencyWithdrawTokens = useCallback(
    async (poolId) => {
      try {
        setData({ ...data, status: "waiting" });

        let unstakeRes = null;

        if (chainId === config.arbitrumChain) {
          unstakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "emergencyWithdraw",
            args: [poolId],
            overrides: { gasLimit: 5950000 },
          });
        } else {
          unstakeRes = await writeContract({
            address: STAKE_ADDRESSES[chainId || ""],
            abi: STAKE_ABI,
            functionName: "emergencyWithdraw",
            args: [poolId],
          });
        }

        if (unstakeRes) {
          setData({ ...data, hash: unstakeRes?.hash, status: "pending" });
        } else {
          setData({ ...data, status: "failed" });
        }
      } catch (error) {
        setData({ ...data, status: "failed" });

        console.log("unstake error ", error);
      }
    },
    [setData, chainId, data]
  );

  const {
    data: trxWatchData,
    isError,
    isLoading: trxWatchLoading,
  } = useWaitForTransaction({
    hash: !data?.hash ? "" : data?.hash,
  });

  useEffect(() => {
    if (!trxWatchData && !trxWatchLoading) {
      return;
    }

    if (trxWatchData && !trxWatchLoading) {
      // trx success
      setData({
        hash: trxWatchData?.hash,
        status: "completed",
      });
    }
  }, [trxWatchData, trxWatchLoading, isError]);

  const transactionStatus = useMemo(() => {
    return { status: data?.status, hash: data?.hash };
  }, [data]);

  return [
    transactionStatus,
    stakeTokens,
    unstakeTokens,
    emergencyWithdrawTokens,
  ];
}
