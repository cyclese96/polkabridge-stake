import "./App.css";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Fragment } from "react";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store";
import { WagmiConfig } from "wagmi";
import {
  ethereumClient,
  projectId,
  wagmiClient,
} from "./web3Connection/wagmiClient";
import { Web3Modal } from "@web3modal/react";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <Fragment>
            <Home />
          </Fragment>
        </WagmiConfig>
        <Web3Modal
          projectId={projectId}
          ethereumClient={ethereumClient}
          themeVariables={{
            "--w3m-background-color": "#000000",
            "--w3m-z-index": 12,
            "--w3m-accent-fill-color": "#ffffff",
            "--w3m-text-big-bold-size": 18,
            "--w3m-accent-color": "#121827",
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
