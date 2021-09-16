import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Card } from "@material-ui/core";
import DotCircle from "./DotCircle";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 300,
    minWidth: 600,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    [theme.breakpoints.down("sm")]: {
      minWidth: 240,
    },
  },
  title: {
    textAlign: "center",
    fontSize: 22,
  },
  logoWrapper: {
    height: 45,
    width: 45,
    backgroundColor: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 14,
    paddingBottom: 3,
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
    fontWeight: 700,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#C80C81",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 12,
    [theme.breakpoints.down("sm")]: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
  },
  earn: {
    textAlign: "center",
    color: "#f9f9f9",
    fontSize: 12,
  },
  desktop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));
export default function PbrPool({
  tokenType,
  price,
  apy,
  tokenClaimed,
  tokenStaked,
}) {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={10}>
      <div>
        <div className="d-flex justify-content-center">
          <Avatar className={classes.logo} src="img/symbol.png" />
        </div>
        <h6 className={classes.title}>{tokenType} Pool Stats</h6>
        <div className="d-flex justify-content-center align-items-center">
          <div
            style={{
              backgroundColor: "#C80C81",
              borderRadius: "50%",
              height: "5px",
              width: "5px",
              marginRight: 5,
            }}
          ></div>
          <div className={classes.earn}>Earn {tokenType}</div>
        </div>
      </div>
      <div className={classes.desktop}>
        <div className="text-center mt-4">
          <div className={classes.tokenTitle}>Price</div>
          <div className={classes.tokenAmount}>{price}</div>
        </div>
        <div className="text-center mt-4">
          <div className={classes.tokenTitle}>APY</div>
          <div className={classes.tokenAmount}>{apy}%</div>
        </div>
        <div className="text-center mt-4">
          <div className={classes.tokenTitle}>Total Staked</div>
          <div className={classes.tokenAmount}>{tokenStaked}</div>
        </div>
        <div className="text-center mt-4">
          <div className={classes.tokenTitle}>Total Claimed</div>
          <div className={classes.tokenAmount}>{tokenClaimed}</div>
        </div>
      </div>
    </Card>
  );
}
