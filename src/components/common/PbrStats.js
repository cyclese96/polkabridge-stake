import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Card } from "@material-ui/core";
import Loader from "./Loader";
import corgibImg from "../../assets/corgi.png";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 300,
    width: "100%",
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    [theme.breakpoints.down("sm")]: {
      minWidth: 240,
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
export default function PbrPool({
  tokenType,
  price,
  mCap,
  change,
  poolLoading,
}) {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={10}>
      {!poolLoading && (
        <div>
          {" "}
          <div>
            <div className="d-flex justify-content-center">
              <Avatar
                className={classes.logo}
                src={tokenType === "PBR" ? "./img/symbol.png" : corgibImg}
              />
            </div>
            <h6 className={classes.title}>{tokenType} Statistics</h6>
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
              <div className={classes.earn}>Stake and Earn {tokenType}</div>
            </div>
          </div>
          <div className="text-center mt-4">
            <a
              target="_blank"
              href="https://app.uniswap.org/#/swap?inputCurrency=0x298d492e8c1d909d3f63bc4a36c66c64acb3d695&outputCurrency=ETH&use=V2"
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
              <div className={classes.tokenAmount}>{price}</div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Market Cap</div>
              <div className={classes.tokenAmount}>{mCap}</div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}> 24Hr Change</div>
              <div className={classes.tokenAmount}>{change} %</div>
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
}
