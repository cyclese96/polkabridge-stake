import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { formatCurrency, fromWei } from "../utils/helper";
import { tokenLogo, tokenName, CORGIB } from "../constants";
import useTokenBalance from "hooks/useTokenBalance";

const useStyles = makeStyles((theme) => ({
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
function BalanceRow({ token }) {
  const classes = useStyles();

  const balance = useTokenBalance(token?.address);

  return (
    <div className="d-flex justify-content-between mt-4">
      <div className="d-flex justify-content-start">
        <div className={classes.logoWrapper}>
          <img
            src={tokenLogo?.[token?.symbol]}
            className={classes.logo}
            alt=""
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
          ? formatCurrency(fromWei(balance))
          : formatCurrency(fromWei(balance), false, 1, true)}
      </div>
    </div>
  );
}

export default React.memo(BalanceRow);
