import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Card } from "@material-ui/core";
import Loader from "./Loader";
import { formatCurrency, formatLargeNumber } from "../utils/helper";
import { connect } from "react-redux";
import { fetchPbrMarketData } from "../actions/stakeActions";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 360,
    width: "100%",
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      width: "100%",
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
    width: 70,
    height: 70,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "transparent",
    border: "1px solid #f9f9f9",
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
  rpcLabel: {
    textAlign: "center",
    color: "#f9f9f9",
    fontSize: 12,
    paddingTop: 3,
    // marginBottom: 4,
  },
  icon: {
    width: 20,
    height: "100%",
    marginRight: 10,
  },
  desktop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  buyNow: {
    background: `linear-gradient(to bottom,#D9047C, #BF1088)`,
    color: "white",
    width: "fit-content",
    height: 40,
    textTransform: "none",
    fontSize: 15,
    borderRadius: 40,
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      width: 120,
      fontSize: 15,
    },
  },
}));

const PbrStatistics = ({
  account: { currentChain },
  stake: { pbrMarketData, poolLoading },
  fetchPbrMarketData,
}) => {
  const classes = useStyles();

  useEffect(() => {
    fetchPbrMarketData();
  }, []);

  return (
    <Card className={classes.card} elevation={10}>
      {!poolLoading && (
        <div>
          {" "}
          <div>
            <div className="d-flex justify-content-center">
              <Avatar className={classes.logo} src="./img/symbol.png" />
            </div>
            <h6 className={classes.title}>PBR Statistics</h6>
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
              {/* <div className={classes.earn}>All in one defi application</div> */}
            </div>
            <div className={classes.rpcLabel}>
              <img
                src="https://assets.coingecko.com/coins/images/4324/small/U85xTl2.png?1608111978"
                className={classes.icon}
              />
              RPC powered by ANKR protocol
            </div>
          </div>
          <div className="text-center mt-4">
            <a
              target="_blank"
              href={
                currentChain === "137"
                  ? "https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0"
                  : "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x298d492e8c1d909d3f63bc4a36c66c64acb3d695"
              }
            >
              <Button variant="contained" className={classes.buyNow}>
                {" "}
                Buy Now
              </Button>
            </a>
          </div>
          <div className={classes.desktop}>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Price</div>
              <div className={classes.tokenAmount}>
                {pbrMarketData?.tokenPrice}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Market Cap</div>
              <div className={classes.tokenAmount}>
                {formatLargeNumber(pbrMarketData?.mCap)}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}> 24Hr Change</div>
              <div className={classes.tokenAmount}>
                {formatCurrency(pbrMarketData?.change, true, 2)}%
              </div>
            </div>
          </div>
        </div>
      )}
      {poolLoading && (
        <div className="text-center">
          <Loader height={200} />
        </div>
      )}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  stake: state.stake,
});

export default connect(mapStateToProps, { fetchPbrMarketData })(
  React.memo(PbrStatistics)
);
