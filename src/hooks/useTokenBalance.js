import { useMemo } from "react";
import { useBalance } from "wagmi";
import useActiveWeb3React from "./useActiveWeb3React";

const useTokenBalance = (tokenAddress) => {
  const { account, chainId } = useActiveWeb3React();
  const { data } = useBalance({
    address: account,
    token: tokenAddress,
    chainId: chainId,
    formatUnits: "wei",
  });
  // erc20 token balance
  const balance = useMemo(() => data?.formatted, [data]);

  return balance;
};

export default useTokenBalance;
