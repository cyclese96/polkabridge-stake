import "./App.css";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Fragment } from "react";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store";
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'


function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}


function App() {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={theme}>
          <Fragment>
            <Home />
          </Fragment>
        </ThemeProvider>
      </Web3ReactProvider>
    </Provider>
  );
}

export default App;
