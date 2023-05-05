import { useCallback, useEffect, useMemo, useState } from "react";
// import { Token, TransactionStatus } from "../utils/interface";
import BigNumber from "bignumber.js";
import { STAKE_ADDRESSES } from "../constants/index";
import useActiveWeb3React from "./useActiveWeb3React";
import useTokenBalance from "./useTokenBalance";
import { erc20ABI, readContract, writeContract } from "@wagmi/core";

import { useWaitForTransaction } from "wagmi";
import useBlockNumber from "./useBlockNumber";

export function useTokenAllowance(token, owner, spender) {
  const { chainId } = useActiveWeb3React();
  const [data, setData] = useState({ hash: "", status: "" });
  const [approved, setApproved] = useState(false);

  const tokenBalance = useTokenBalance(token?.address);
  const blockNumber = useBlockNumber();

  const checkApproval = useCallback(
    async (_tokenBalance, _token, _owner, _spender) => {
      try {
        const data = await readContract({
          address: _token?.address?.toString(),
          abi: erc20ABI,
          functionName: "allowance",
          args: [_owner, _spender],
        });
        // console.log("allowance test ", {
        //   allowance: data?.toString(),
        //   _tokenBalance,
        // });
        if (
          new BigNumber(data?.toString()).gte(_tokenBalance) &&
          !new BigNumber(data?.toString()).lte(0)
        ) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      } catch (error) {
        console.log("checkApproval error : ", error);
      }
    },
    [setApproved]
  );

  useEffect(() => {
    if (!token?.address || !owner || !spender) {
      return;
    }

    checkApproval(tokenBalance, token, owner, spender);
  }, [tokenBalance, token, owner, spender, checkApproval, blockNumber]);

  const confirmAllowance = useCallback(
    async (balance) => {
      try {
        const stakeContractAddress = STAKE_ADDRESSES?.[chainId || 1];

        setData({ ...data, status: "waiting" });

        const response = await writeContract({
          address: token?.address,
          abi: erc20ABI,
          functionName: "approve",
          args: [stakeContractAddress, balance],
        });

        // console.log("transaction  response ", response);
        if (response) {
          setData({ ...data, hash: response?.hash, status: "pending" });
        } else {
          setData({ ...data, status: "failed" });
        }
      } catch (error) {
        setData({ ...data, status: "failed" });

        console.log("approve error ", { error });
      }
    },
    [chainId, token, setData, data]
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
        state: 3,
      });
    }
  }, [trxWatchData, trxWatchLoading, isError]);

  // useEffect(() => {
  //   if (!data?.hash) {
  //     return;
  //   }

  //   if (data?.status === "completed" || data?.status === "failed") {
  //     return;
  //   }

  //   library
  //     ?.getTransactionReceipt(data?.hash)
  //     .then((res) => {
  //       if (res?.blockHash && res?.blockNumber) {
  //         setData({ ...data, status: "completed" });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("transaction failed ", err);
  //       setData({ ...data, status: "failed" });
  //     });
  // }, [blockNumber]);

  const transactionStatus = useMemo(() => {
    return { status: data?.status, hash: data?.hash };
  }, [data]);

  // const approved = useMemo(() => {
  //   let tokenWeiAmountToApprove = TOKEN_ALLOWANCE_ALLOWANCE;
  //   if (token?.symbol === CORGIB) {
  //     tokenWeiAmountToApprove = CORGIB_ALLOWANCE_ALLOWANCE;
  //   } else if (token?.symbol === AIBB) {
  //     tokenWeiAmountToApprove = AIBB_ALLOWANCE;
  //   }

  //   if (!currentAllowance || !token) {
  //     return false;
  //   }

  //   // console.log("allowance test ", {
  //   //   currentAllowance,
  //   //   tokenWeiAmountToApprove,
  //   //   tokenBalance,
  //   // });

  //   if (new BigNumber(currentAllowance).lte(0)) {
  //     return false;
  //   }

  //   return new BigNumber(currentAllowance).gte(tokenBalance?.toString() || "1");
  // }, [token, currentAllowance, tokenBalance]);

  return {
    approved: approved,
    confirmAllowance: confirmAllowance,
    transactionStatus: transactionStatus,
  };
}
