import { useCallback, useEffect, useMemo, useState } from "react";
import { toWei } from "../utils/helper";
import { TransactionStatus } from "../utils/interface";
import useActiveWeb3React from "./useActiveWeb3React";
import useBlockNumber from "./useBlockNumber";
import { useStakeContract } from "./useContract";
import config from "utils/config";

export function useStakeCallback(
  tokenSymbol?: string
): [TransactionStatus, () => {}, () => {}, () => {}] {
  const { library, chainId } = useActiveWeb3React();
  const stakeContract = useStakeContract();
  const [data, setData] = useState({ hash: "", status: "none" });
  const blockNumber = useBlockNumber();

  let stakeRes: any = null;

  const stakeTokens = useCallback(
    async (stakeAmount?: string, poolId?: number) => {
      try {
        const depositTokens = toWei(stakeAmount);
        setData({ ...data, status: "waiting" });

        // console.log("stake test ", { depositTokens, poolId });
        if (chainId === config.arbitrumChain) {
          stakeRes = await stakeContract?.deposit(poolId, depositTokens, {
            gasLimit: 5950000,
          });
        } else {
          stakeRes = await stakeContract?.deposit(poolId, depositTokens);
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
    [stakeContract, setData, chainId]
  );

  const unstakeTokens = useCallback(
    async (unstakeAmount?: string, poolId?: number, isEnded?: boolean) => {
      const withdrawTokens = toWei(unstakeAmount);

      try {
        setData({ ...data, status: "waiting" });

        let unstakeRes: any = null;

        if (isEnded || tokenSymbol === "AOG") {
          unstakeRes = await stakeContract?.emergencyWithdraw(poolId);
        } else if (chainId === config.arbitrumChain) {
          unstakeRes = await stakeContract?.withdraw(poolId, withdrawTokens, {
            gasLimit: 5950000,
          });
        } else {
          unstakeRes = await stakeContract?.withdraw(poolId, withdrawTokens);
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
    [stakeContract, setData, data, chainId, tokenSymbol]
  );

  const emergencyWithdrawTokens = useCallback(
    async (poolId?: number) => {
      try {
        setData({ ...data, status: "waiting" });

        let unstakeRes: any = null;

        if (chainId === config.arbitrumChain) {
          unstakeRes = await stakeContract?.emergencyWithdraw(
            poolId,

            {
              gasLimit: 5950000,
            }
          );
        } else {
          unstakeRes = await stakeContract?.emergencyWithdraw(poolId);
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
    [stakeContract, setData, chainId, data, tokenSymbol]
  );

  useEffect(() => {
    if (!data?.hash) {
      return;
    }

    if (data?.status === "completed" || data?.status === "failed") {
      return;
    }

    library
      ?.getTransactionReceipt(data?.hash)
      .then((res) => {
        if (res?.blockHash && res?.blockNumber) {
          setData({ ...data, status: "completed" });
        }
      })
      .catch((err) => {
        console.log("transaction failed ", err);
        setData({ ...data, status: "failed" });
      });
  }, [blockNumber]);

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
