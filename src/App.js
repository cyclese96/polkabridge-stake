import "./App.css";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Navbar from "./components/common/Navbar";
import { Fragment } from "react";
import Home from "./components/Home";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Fragment>
        <Home />
      </Fragment>
    </ThemeProvider>
  );
}

export default App;
