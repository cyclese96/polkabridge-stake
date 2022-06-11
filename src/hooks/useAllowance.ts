import { useCallback, useEffect, useMemo, useState } from "react";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useTokenContract } from "./useContract";
import { Token, TransactionStatus } from "../utils/interface";
import BigNumber from "bignumber.js";
import { STAKE_ADDRESSES, TOKEN_ALLOWANCE_ALLOWANCE } from "../constants/index";
import useActiveWeb3React from "./useActiveWeb3React";
// import { useTransactionAdder } from "state/transactions/hooks";
import useBlockNumber from "./useBlockNumber";

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): [boolean, (balance: string) => {}, TransactionStatus] {
  const tokenContract = useTokenContract(token?.address);
  const { library, chainId } = useActiveWeb3React();
  const [data, setData] = useState({ hash: "", status: "" });
  const blockNumber = useBlockNumber();

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
        console.log("transaction  response ", response);
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
    if (!currentAllowance || !token) {
      return false;
    }

    return new BigNumber(currentAllowance).gte(TOKEN_ALLOWANCE_ALLOWANCE);
  }, [token, allowance]);

  return [approved, confirmAllowance, transactionStatus];
}
