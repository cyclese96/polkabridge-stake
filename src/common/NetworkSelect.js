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
import { getCurrentNetworkName, setupNetwork } from "../utils/helper";
import config from "../utils/config";
import { currentConnection } from "../constants";
import etherIcon from "../assets/ether.png";
import binanceIcon from "../assets/binance.png";
import polygonIcon from "../assets/polygon.png";
import { CHANGE_NETWORK } from "../actions/types";
import store from "../store";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { connect } from "react-redux";

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
  networkName: {},
}));

const NetworkSelect = ({ account: { currentChain } }) => {
  const classes = useStyles();

  const [network, setNetwork] = React.useState(
    parseInt(localStorage.getItem("currentNetwork") || config.chainId)
  );

  const { active } = useActiveWeb3React();

  useEffect(() => {
    if (!currentChain) {
      return;
    }

    setNetwork(currentChain);
  }, [currentChain]);

  const handleChangeNetwork = (_selected) => {
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: {
        network: getCurrentNetworkName(_selected),
        chain: _selected,
      },
    });
    setNetwork(_selected);
  };

  const handleChange = (_selected) => {
    if (network === _selected) {
      return;
    }
    localStorage.setItem("currentNetwork", _selected);

    // handle network stated when metamask in not available
    if (!active) {
      handleChangeNetwork(_selected);
    }

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
            <span className={classes.networkName}>Ethereum</span>
            <img className={classes.imgIcon} src={etherIcon} />
          </MenuItem>
          <MenuItem
            value={currentConnection === "testnet" ? 97 : 56}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>BSC</span>
            <img className={classes.imgIcon} src={binanceIcon} />
          </MenuItem>
          <MenuItem
            value={currentConnection === "testnet" ? 80001 : 137}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>Polygon</span>
            <img className={classes.imgIcon} src={polygonIcon} />
          </MenuItem>
          {/* <MenuItem
            value={currentConnection === "testnet" ? 1666700000 : 1666600000}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>Harmony</span>
            <img className={classes.imgIcon} src={harmonyIcon} />
          </MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(NetworkSelect);
