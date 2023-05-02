import { useCallback, useEffect, useMemo, useState } from "react";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useTokenContract } from "./useContract";
import { Token, TransactionStatus } from "../utils/interface";
import BigNumber from "bignumber.js";
import {
  AIBB,
  AIBB_ALLOWANCE,
  CORGIB,
  CORGIB_ALLOWANCE_ALLOWANCE,
  STAKE_ADDRESSES,
  TOKEN_ALLOWANCE_ALLOWANCE,
} from "../constants/index";
import useActiveWeb3React from "./useActiveWeb3React";

import useBlockNumber from "./useBlockNumber";
import { useCurrencyBalance } from "./useBalance";

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): [boolean, (balance: string) => {}, TransactionStatus] {
  const tokenContract = useTokenContract(token?.address);
  const { library, chainId } = useActiveWeb3React();
  const [data, setData] = useState({ hash: "", status: "" });
  const blockNumber = useBlockNumber();

  const tokenBalance = useCurrencyBalance(owner, token);

  const inputs = useMemo(
    () => [owner?.toLowerCase(), spender?.toLowerCase()],
    [owner, spender]
  );
  const allowance = useSingleCallResult(
    tokenContract,
    "allowance",
    inputs
  ).result;

  const currentAllowance = !allowance ? null : allowance?.[0]?.toString();

  // console.log("allowance test ", {
  //   currentAllowance,
  //   TOKEN_ALLOWANCE_ALLOWANCE,
  //   token,
  // });

  // const addTransaction = useTransactionAdder();
  const confirmAllowance = useCallback(
    async (balance: string) => {
      try {
        const stakeContractAddress = STAKE_ADDRESSES?.[chainId || 1];

        setData({ ...data, status: "waiting" });
        const response = await tokenContract?.approve(
          stakeContractAddress,
          balance
        );
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
    [chainId, tokenContract]
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

  const approved = useMemo(() => {
    let tokenWeiAmountToApprove = TOKEN_ALLOWANCE_ALLOWANCE;
    if (token?.symbol === CORGIB) {
      tokenWeiAmountToApprove = CORGIB_ALLOWANCE_ALLOWANCE;
    } else if (token?.symbol === AIBB) {
      tokenWeiAmountToApprove = AIBB_ALLOWANCE;
    }

    if (!currentAllowance || !token) {
      return false;
    }

    // console.log("allowance test ", {
    //   currentAllowance,
    //   tokenWeiAmountToApprove,
    //   tokenBalance,
    // });

    if (new BigNumber(currentAllowance).lte(0)) {
      return false;
    }

    return new BigNumber(currentAllowance).gte(tokenBalance?.toString() || "1");
  }, [token, currentAllowance, tokenBalance]);

  return [approved, confirmAllowance, transactionStatus];
}
