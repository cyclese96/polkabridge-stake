import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { formatCurrency, fromWei } from "../utils/helper";
import biteImg from "../assets/bite.png";
import corgibImg from "../assets/corgi.png";
import clf365Img from "../assets/clf365.png";
import pwarImg from "../assets/pwar.png";
import punImg from "../assets/punt.png";
import {
  BITE,
  CFL365,
  etheriumNetwork,
  harmonyNetwork,
  maticNetwork,
  PBR,
  PUN,
  SHOE,
  WELT,
  WELT_USDC,
} from "../constants";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 340,
    width: "100%",
    padding: 20,
    borderRadius: 30,
    overflowY: "scroll",
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    [theme.breakpoints.down("sm")]: {
      minHeight: 200,
      height: "100%",
    },
  },
  title: {
    textAlign: "center",
    fontSize: 22,
  },
  logoWrapper: {
    height: 45,
    width: 45,
    backgroundColor: "#ffffff",
    border: "1px solid #bdbdbd",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 30,
    width: 30,
  },
  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#e5e5e5",
  },
  tokenSubtitle: {
    fontWeight: 300,
    padding: 0,
    paddingLeft: 10,
    fontSize: 12,
    color: "#bdbdbd",
  },
  tokenAmount: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
    color: "#f9f9f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
function BalanceCard(props) {
  const {
    account: { balance, currentNetwork },
  } = props;
  const classes = useStyles();

  const tokenLogo = {
    PBR: "img/symbol.png",
    BITE: biteImg,
    CORGIB: corgibImg,
    PWAR: pwarImg,
    CFL365: clf365Img,
    PUN: punImg,
    SHOE: "img/shoefy.png",
    WELT: "img/weltUsdc.png",
    WELT_USDC: "img/welt.png",
  };

  const tokenName = {
    PBR: "PolkaBridge",
    BITE: "DragonBite",
    CORGIB: "Corgi Of PolkaBridge",
    PWAR: "PolkaWar",
    CFL365: "CFL 365",
    PUN: "CryptoPunt",
    SHOE: "Shoefy Private",
    WELT: "FabWelt",
    WELT_USDC: "Welt USDC",
  };

  const getCoins = () => {
    if (currentNetwork === etheriumNetwork) {
      return [
        { coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) },
        { coin: PUN, balance: formatCurrency(fromWei(balance[PUN])) },
        { coin: SHOE, balance: formatCurrency(fromWei(balance[SHOE])) },
        { coin: BITE, balance: formatCurrency(fromWei(balance[BITE])) },
        { coin: CFL365, balance: formatCurrency(fromWei(balance[CFL365])) },
      ];
    } else {
      if (
        currentNetwork === maticNetwork ||
        currentNetwork === harmonyNetwork
      ) {
        return [
          { coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) },
          { coin: WELT, balance: formatCurrency(fromWei(balance[WELT])) },
          {
            coin: WELT_USDC,
            balance: formatCurrency(fromWei(balance[WELT_USDC])),
          },
        ];
      } else {
        return [
          {
            coin: "CORGIB",
            balance: formatCurrency(fromWei(balance["CORGIB"])),
          },
          {
            coin: "PWAR",
            balance: formatCurrency(fromWei(balance["PWAR"]), false, 1, true),
          },
        ];
      }
    }
  };

  return (
    <Card className={classes.card} elevation={10}>
      <h6 className={classes.title}>Your Balance</h6>
      <div className="mt-4">
        {getCoins().map(function (coinObj, index) {
          return (
            <div className="d-flex justify-content-between mt-4">
              <div className="d-flex justify-content-start">
                <div className={classes.logoWrapper}>
                  <img src={tokenLogo[coinObj.coin]} className={classes.logo} />
                </div>
                <div>
                  <div className={classes.tokenTitle}>{coinObj.coin}</div>
                  <div className={classes.tokenSubtitle}>
                    {tokenName[coinObj.coin]}
                  </div>
                </div>
              </div>
              <div className={classes.tokenAmount}>{coinObj.balance}</div>
            </div>
          );
          // }
        })}
      </div>
      {/* // )} */}
    </Card>
  );
}

BalanceCard.propTypes = {
  account: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(BalanceCard);
