import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 400,
    width: "100%",
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.5)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
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
export default function StakeCard() {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={10}>
      <h6 className={classes.title}>Balance</h6>
      <div className="d-flex justify-content-between mt-4">
        <div className="d-flex justify-content-start">
          <div className={classes.logoWrapper}>
            <img
              src="http://localhost:3000/img/symbol.png"
              className={classes.logo}
            />
          </div>
          <div>
            <div className={classes.tokenTitle}>PBR</div>
            <div className={classes.tokenSubtitle}>PolkaBridge</div>
          </div>
        </div>
        <div className={classes.tokenAmount}>323</div>
      </div>
    </Card>
  );
}
