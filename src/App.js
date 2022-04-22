import "./App.css";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Fragment } from "react";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store";
import { createWeb3ReactRoot, Web3ReactProvider } from "web3-react-core";
import { NetworkContextName } from "./constants";
import getLibrary from "./utils/getLibrary";
import { BlockUpdater } from "./hooks/useBlockNumber";
import MulticallUpdater from "./state/multicall/updater";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function App() {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <ThemeProvider theme={theme}>
            <MulticallUpdater />
            <BlockUpdater />
            <Fragment>
              <Home />
            </Fragment>
          </ThemeProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </Provider>
  );
}

export default App;
