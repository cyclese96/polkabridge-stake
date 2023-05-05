import { useMemo } from "react";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useBlockNumber as useWagmiBlockNumber } from "wagmi";

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();
  const { data } = useWagmiBlockNumber({
    watch: true,
    cacheTime: 3_000,
    chainId: chainId,
  });

  const block = useMemo(() => data?.toString(), [data]);

  return !block ? undefined : parseInt(block);
}
