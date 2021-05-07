import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Avatar, Button, Divider } from "@material-ui/core";
import bal from "../assets/balance.png";
import supply from "../assets/supply.png";

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
  card: {
    width: 370,
    height: 100,
    paddingLeft: 10,
    paddingRight: 10,
  },

  cardsContainer: {
    marginTop: 30,
    display: "flex",
  },
  cardContents: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
  },
  avatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 50,
  },
  options: {
    marginTop: 200,
  },
  actionCard: {
    width: 320,
    height: 350,
    paddingLeft: 10,
    paddingRight: 10,
  },
  actionCardAvatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 55,
    marginLeft: 3,
    marginRight: 3,
  },
  actionCardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
}));

const Home = () => {
  const classes = useStyles();
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
          <div className="card-theme">
            <div className={classes.cardContents}>
              <img className={classes.avatar} src={bal} />
              <div>
                <p className="card__text">Your Available PBR Balence</p>
                <div className="card__text">
                  <strong className={classes.numbers}>Locked</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div className="card-theme">
            <div className={classes.cardContents}>
              <img className={classes.avatar} src={supply} />
              <div>
                <p className="card__text">PBR Circulating supply</p>
                <div className="card__text">
                  <strong className={classes.numbers}>24,039,938</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <hr style={{ height: 0.02, width: "80%" }} /> */}
      <div className={classes.options}>
        <div className={classes.actionCard}>
          <div className="card-theme">
            <div className={classes.actionCardContainer}>
              <div>
                <img
                  className={classes.actionCardAvatar}
                  src="img/tokens/pbr.png"
                />
                <img
                  className={classes.actionCardAvatar}
                  src="img/tokens/eth.png"
                />
              </div>

              <div className="card__text">
                <p>PBR - ETH</p> <span>Deposit PBR-ETH LP Earn PBR</span>
              </div>
              <Button
                style={{
                  backgroundColor: "#E0077D",
                  color: "black",
                  width: "80%",
                  height: 45,
                  textTransform: "none",
                  fontSize: 18,
                  borderRadius: 8,
                  marginTop: 25,
                  marginBottom: 25,
                }}
              >
                Select
              </Button>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 200,
                }}
                className="card__text"
              >
                <table style={{ width: "88%" }}>
                  <tr>
                    <td align="left">Total Locked Value</td>
                    <td align="right">1550560 USD</td>
                  </tr>
                  <tr>
                    <td align="left">Avg. reward</td>
                    <td align="right">0.668 PBR / block</td>
                  </tr>
                  <tr>
                    <td align="left">Multiplier</td>
                    <td align="right">40x</td>
                  </tr>
                  <tr>
                    <td align="left">APY</td>
                    <td align="right" style={{ color: "#4CAF50" }}>
                      34.010%
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
