import React, { useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { formatCurrency, fromWei } from "../utils/helper";
import {
  BITE,
  CFL365,
  etheriumNetwork,
  GRAV,
  DEFLY,
  harmonyNetwork,
  maticNetwork,
  PBR,
  PUN,
  SHOE,
  WELT,
  AOG,
  tokenLogo,
  tokenName,
  LABS,
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

  const getCoins = () => {
    if (currentNetwork === etheriumNetwork) {
      return [
        { coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) },
        { coin: LABS, balance: formatCurrency(fromWei(balance?.[LABS])) },
        // { coin: PUN, balance: formatCurrency(fromWei(balance[PUN])) },
        // { coin: SHOE, balance: formatCurrency(fromWei(balance[SHOE])) },
        // { coin: BITE, balance: formatCurrency(fromWei(balance[BITE])) },
        // { coin: CFL365, balance: formatCurrency(fromWei(balance[CFL365])) },
      ];
    } else if (currentNetwork === maticNetwork) {
      return [
        { coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) },
        { coin: WELT, balance: formatCurrency(fromWei(balance[WELT])) },
      ];
    } else if (currentNetwork === harmonyNetwork) {
      return [{ coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) }];
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
        // {
        //   coin: GRAV,
        //   balance: formatCurrency(fromWei(balance?.GRAV), false, 1, true),
        // },
        // {
        //   coin: DEFLY,
        //   balance: formatCurrency(fromWei(balance?.DEFLY), false, 1, true),
        // },
        // {
        //   coin: AOG,
        //   balance: formatCurrency(fromWei(balance?.AOG), false, 1, true),
        // },
      ];
    }
  };

  const balances = useMemo(
    () =>
      Object.keys(balance).map((_token) => {
        return {
          coin: _token,
          balance: formatCurrency(fromWei(balance?.[_token])),
        };
      }),
    [currentNetwork, balance]
  );

  return (
    <Card className={classes.card} elevation={10}>
      <h6 className={classes.title}>Your Balance</h6>

      <div className="mt-4">
        {getCoins()?.map(function (coinObj, index) {
          // if (
          //   account.balance[key] !== null &&
          //   account.balance[key] !== undefined
          // ) {
          return (
            <div className="d-flex justify-content-between mt-4">
              <div className="d-flex justify-content-start">
                <div className={classes.logoWrapper}>
                  <img
                    src={tokenLogo?.[coinObj.coin]}
                    className={classes.logo}
                  />
                </div>
                <div>
                  <div className={classes.tokenTitle}>{coinObj.coin}</div>
                  <div className={classes.tokenSubtitle}>
                    {tokenName?.[coinObj.coin]}
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

export default connect(mapStateToProps, {})(React.memo(BalanceCard));
