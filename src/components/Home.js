import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  background: {
    padding: 80,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#121827",
  },

  heading: {
    textAlign: "left",
    fontSize: 26,
    fontWeight: 600,

    marginTop: 8,
    marginBottom: 8,
  },
  numbers: {
    color: "#C80C81",
  },
  logo: {
    width: 130,
    height: 130,
    marginTop: 20,
    marginBottom: 40,
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.background}>
      <Avatar className={classes.logo} src="assets/icon.jpg" />
      <p className={classes.heading}>
        PBR price: <strong className={classes.numbers}> $0.274</strong>
      </p>
      <p className={classes.heading}>
        Total Value Locked (TVL):{" "}
        <strong className={classes.numbers}> $3,305,073</strong>
      </p>
      <p className={classes.heading}>
        Total Claimed Rewards:{" "}
        <strong className={classes.numbers}> 124,633 PBR</strong>
      </p>
    </div>
  );
};

export default Home;
