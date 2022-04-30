import { useMemo } from "react";
import {
  useMultipleContractSingleData,
  useSingleContractMultipleData,
} from "../state/multicall/hooks";
import { isAddress } from "../utils/contractUtils";
import { useInterfaceMulticall } from "./useContract";
import ERC20_ABI from "../contracts/abi/erc20.json";
import { Interface } from "@ethersproject/abi";
import useActiveWeb3React from "./useActiveWeb3React";
import { Token } from "../utils/interface";
import { NATIVE_TOKEN } from "../constants/chains";

const ERC20_INTERFACE = new Interface(ERC20_ABI);

export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: string | undefined;
} {
  const multicallContract = useInterfaceMulticall();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(() => {
    return addresses.reduce<{ [address: string]: string }>(
      (memo, address, i) => {
        const value = results?.[i]?.result?.[0];

        if (value) {
          memo[address] = value.toString();
        }
        return memo;
      },
      {}
    );
  }, [addresses, results]);
}

export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: string | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    [address]
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: string | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? value.toString() : undefined;
              if (amount) {
                memo[token.address] = amount;
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: string | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(
  account?: string,
  token?: Token
): string | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Token | undefined)[]
): (string | undefined)[] {
  const { chainId } = useActiveWeb3React();

  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => true) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);

  const containsETH: boolean = useMemo(
    () =>
      currencies?.some(
        (currency) => chainId && currency?.symbol === NATIVE_TOKEN?.[chainId]
      ) ?? false,
    [currencies, chainId]
  );

  const ethBalance = useETHBalances(containsETH ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (chainId && currency?.symbol === NATIVE_TOKEN?.[chainId || 1])
          return ethBalance[account];
        return tokenBalances[currency.address];
      }) ?? [],
    [account, currencies, ethBalance, chainId, tokenBalances]
  );
}

export function useCurrencyBalance(
  account?: string,
  currency?: Token
): string | undefined {
  return useCurrencyBalances(account, [currency])[0];
}
