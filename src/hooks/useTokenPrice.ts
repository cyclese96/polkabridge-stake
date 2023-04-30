import { useEffect, useMemo, useState } from "react";
import { fetchTokenPrice } from "../utils/helper";
import { Token } from "../utils/interface";
import useActiveWeb3React from "./useActiveWeb3React";

export function useTokenPrice(poolToken?: Token): string | null {
  const { active } = useActiveWeb3React();
  const [tokenPrice, setTokenPrice] = useState(null);
  
  async function fetchData() {
    try {
      console.log("price test fetching price ", poolToken);
      let res = await fetchTokenPrice(poolToken?.symbol);
      setTokenPrice(res);
    } catch (error) {
      setTokenPrice(null);
    }
  }

    
    if (!active) {
      fetchData();
    }
  
  return useMemo(
    () => (poolToken && tokenPrice ? tokenPrice : null),
    [tokenPrice, poolToken]
  );
}
