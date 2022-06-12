import { useCallback } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { WalletConnectConnector } from "web3-react-walletconnect-connector";
import connectors from "../connection/connectors";
import { AbstractConnector } from "@web3-react/abstract-connector";

export function useWalletConnectCallback() {
  const { activate } = useActiveWeb3React();

  const createConnectHandler = useCallback(
    async (connector: AbstractConnector) => {
      try {
        // const connector = connectors.injected;
        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector

        if (connector instanceof WalletConnectConnector) {
          connector.walletConnectProvider = undefined;
        }

        await activate(connector);
        localStorage.connected = "yes";
      } catch (error) {
        console.error("createConnectHandler", error);
      }
    },
    [activate]
  );

  const connectWallet = useCallback(
    (connectorType: string) => {
      let connector;
      if (connectorType === "injected") {
        connector = connectors.injected;
      } else if (connectorType === "walletConnect") {
        connector = connectors.walletconnect;
      } else if (connectorType === "unstoppable") {
        connector = connectors.uauth;
      } else {
        connector = connectors.injected;
      }

      localStorage.connectorType = connectorType;

      createConnectHandler(connector);
    },
    [createConnectHandler]
  );

  return [connectWallet];
}
