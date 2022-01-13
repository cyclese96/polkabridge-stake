import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  bscNetworkDetail,
  ethereumNetworkDetail,
  harmonyNetworkDetail,
  polygonNetworkDetail,
} from "../utils/networkConstants";
import { setupNetwork } from "../utils/helper";
import config from "../utils/config";
import { currentConnection } from "../constants";

import etherIcon from "../assets/ether.png";
import binanceIcon from "../assets/binance.png";
import harmonyIcon from "../assets/one.png";
import polygonIcon from "../assets/polygon.png";
import { useWeb3React } from "@web3-react/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
  },
  imgIcon: {
    marginLeft: 10,
    height: 23,
  },
  buttonDrop: {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "grey",
      color: "#100525",
    },
  },
  main: {
    color: "white",
    backgroundColor: "#100525",
    border: "1px solid rgba(224, 7, 125, 0.7)",
    borderRadius: 60,
    paddingLeft: 15,
    height: 40,
    width: "full-width",
    marginRight: 7,
    paddingTop: 3,
  },
}));
export default function NetworkSelect({ selectedNetwork }) {
  const classes = useStyles();
  const [network, setNetwork] = React.useState(
    parseInt(localStorage.getItem("currentNetwork") || config.chainId)
  );

  const { chainId } = useWeb3React();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    // handleChange(chainId);
    setNetwork(chainId);
  }, [chainId]);

  const handleChange = (_selected) => {
    if (network === _selected) {
      return;
    }
    localStorage.setItem("currentNetwork", _selected);
    // setNetwork(_selected);
    if ([56, 97].includes(_selected)) {
      setupNetwork(
        currentConnection === "mainnet"
          ? bscNetworkDetail.mainnet
          : bscNetworkDetail.testnet
      );
    } else if ([137, 80001].includes(_selected)) {
      setupNetwork(
        currentConnection === "mainnet"
          ? polygonNetworkDetail.mainnet
          : polygonNetworkDetail.testnet
      );
    } else if ([1666600000, 1666700000].includes(_selected)) {
      setupNetwork(
        currentConnection === "mainnet"
          ? harmonyNetworkDetail.mainnet
          : harmonyNetworkDetail.testnet
      );
    } else {
      setupNetwork(
        currentConnection === "mainnet"
          ? ethereumNetworkDetail.mainnet
          : ethereumNetworkDetail.testnet
      );
    }
  };
  return (
    <div>
      <FormControl className={classes.root}>
        <Select
          className={classes.main}
          value={network}
          disableUnderline={true}
          notched={true}
          id="adornment-weight"
          onChange={({ target: { value } }) => handleChange(value)}
        >
          <MenuItem
            value={currentConnection === "testnet" ? 42 : 1}
            className={classes.buttonDrop}
          >
            <span>Ethereum</span>
            <img className={classes.imgIcon} src={etherIcon} />
          </MenuItem>
          <MenuItem
            value={currentConnection === "testnet" ? 97 : 56}
            className={classes.buttonDrop}
          >
            <span>BSC</span>
            <img className={classes.imgIcon} src={binanceIcon} />
          </MenuItem>
          <MenuItem
            value={currentConnection === "testnet" ? 80001 : 137}
            className={classes.buttonDrop}
          >
            <span>Polygon</span>
            <img className={classes.imgIcon} src={polygonIcon} />
          </MenuItem>
          <MenuItem
            value={currentConnection === "testnet" ? 1666700000 : 1666600000}
            className={classes.buttonDrop}
          >
            <span>Harmony</span>
            <img className={classes.imgIcon} src={harmonyIcon} />
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
