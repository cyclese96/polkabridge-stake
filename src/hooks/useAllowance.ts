import { useCallback, useMemo } from "react";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useTokenContract } from "./useContract";
import { Token } from "../utils/interface";
import BigNumber from "bignumber.js";
import { STAKE_ADDRESSES, TOKEN_ALLOWANCE_ALLOWANCE } from "../constants/index";
import useActiveWeb3React from "./useActiveWeb3React";
import { useTransactionAdder } from "state/transactions/hooks";

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): [boolean, (balance: string) => {}] {
  const tokenContract = useTokenContract(token?.address);
  const { chainId } = useActiveWeb3React();

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

  const addTransaction = useTransactionAdder();
  const confirmAllowance = useCallback(
    async (balance: string) => {
      try {
        const stakeContractAddress = STAKE_ADDRESSES?.[chainId || 1];

        console.log("allowance trx ", { balance, stakeContractAddress });
        const response = await tokenContract?.approve(
          stakeContractAddress,
          balance
        );

        if (token?.address && spender) {
          addTransaction(response, {
            summary: "Approve " + token?.symbol,
            approval: { tokenAddress: token?.address, spender: spender },
          });
        }
      } catch (error) {
        console.log("approve error ", { error });
      }
    },
    [chainId, tokenContract, addTransaction]
  );

  const approved = useMemo(() => {
    if (!currentAllowance || !token) {
      return false;
    }

    return new BigNumber(currentAllowance).gte(TOKEN_ALLOWANCE_ALLOWANCE);
  }, [token, allowance]);

  return [approved, confirmAllowance];
}
