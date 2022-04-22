import React, { useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import { formatCurrency, fromWei } from "../utils/helper";
import {
  tokenLogo,
  tokenName,
  supportedStaking,
  CORGIB,
  tokenAddresses,
} from "../constants";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useCurrencyBalances } from "../hooks/useBalance";

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
function BalanceCard() {
  const classes = useStyles();

  const { chainId, account } = useActiveWeb3React();

  const tokens = useMemo(() => {
    return supportedStaking?.[chainId]?.map((_symbol) => {
      return { symbol: _symbol, address: tokenAddresses?.[_symbol]?.[chainId] };
    });
  }, [chainId]);
  const balances = useCurrencyBalances(account, tokens);

  return (
    <Card className={classes.card} elevation={10}>
      <h6 className={classes.title}>Your Balance</h6>

      <div className="mt-4">
        {tokens?.map(function (token, index) {
          return (
            <div className="d-flex justify-content-between mt-4">
              <div className="d-flex justify-content-start">
                <div className={classes.logoWrapper}>
                  <img
                    src={tokenLogo?.[token?.symbol]}
                    className={classes.logo}
                  />
                </div>
                <div>
                  <div className={classes.tokenTitle}>{token?.symbol}</div>
                  <div className={classes.tokenSubtitle}>
                    {tokenName?.[token?.symbol]}
                  </div>
                </div>
              </div>
              <div className={classes.tokenAmount}>
                {token?.symbol === CORGIB
                  ? formatCurrency(fromWei(balances?.[index]))
                  : formatCurrency(fromWei(balances?.[index]), false, 1, true)}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default React.memo(BalanceCard);
