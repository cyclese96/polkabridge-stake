import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import { supportedStaking, tokenAddresses } from "../constants";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import BalanceRow from "./BalanceRow";

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
}));
function BalanceCard() {
  const classes = useStyles();

  const { chainId } = useActiveWeb3React();

  const tokens = useMemo(() => {
    return supportedStaking?.[chainId]?.map((_symbol) => {
      return { symbol: _symbol, address: tokenAddresses?.[_symbol]?.[chainId] };
    });
  }, [chainId]);

  return (
    <Card className={classes.card} elevation={10}>
      <h6 className={classes.title}>Your Balance</h6>

      <div className="mt-4">
        {tokens?.map(function (token, index) {
          return <BalanceRow token={token} />;
        })}
      </div>
    </Card>
  );
}

export default BalanceCard;
