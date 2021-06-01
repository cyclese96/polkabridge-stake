import "./App.css";
import React, { useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Fragment } from "react";
import Home from "./components/Home";
import { Provider } from "react-redux";
import store from "./store";
// import loadWeb3 from "./loadWeb3";

function App() {
  // useEffect(async () => {
  //   await loadWeb3();
  // }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Fragment>
          <Home />
        </Fragment>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
