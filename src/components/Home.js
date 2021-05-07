import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Avatar } from "@material-ui/core";

import Staking from "./Cards/Staking";
import Balance from "./Cards/Balance";
import StakeDialog from "./common/StakeDialog";

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
    fontSize: 24,
    fontWeight: 600,

    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  logo: {
    width: 95,
    height: 95,
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    padding: 12,
  },
  cardsContainer: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
  },
  card: {
    marginTop: 5,
    marginBottom: 5,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.background}>
      <Avatar className={classes.logo} src="img/symbol.png" />
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

      <div className={classes.cardsContainer}>
        <div className={classes.card}>
          <Staking onStake={handleClickOpen} onUnstake={handleClickOpen} />
        </div>
        <div className={classes.card}>
          <Balance />
        </div>
        <StakeDialog open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};

export default Home;
