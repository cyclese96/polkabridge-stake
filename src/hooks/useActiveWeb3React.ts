// /* eslint-disable react-hooks/rules-of-hooks */
// import { useWeb3React } from "@web3-react/core";

// export default function useActiveWeb3React() {
//   const interfaceContext = useWeb3React();

//   return interfaceContext;
// }

/* eslint-disable react-hooks/rules-of-hooks */
// import { useWeb3React } from "@web3-react/core";

import { useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";

export default function useActiveWeb3React() {
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();

  const interfaceContext = useMemo(() => {
    return {
      account: address,
      isActive: isConnected,
      connector: connector,
      chainId: chain?.id,
    };
  }, [address, isConnected, connector, chain]);
  return interfaceContext;
}
