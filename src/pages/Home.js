import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useMemo } from "react";
import SingleStakeCard from "../components/SingleStakeCard";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Wallet from "../common/Wallet";
import { connect } from "react-redux";
import { supportedStaking, unsupportedStaking } from "../constants";
import { CHANGE_NETWORK, CONNECT_WALLET } from "../actions/types";
import store from "../store";
import BalanceCard from "../common/BalanceCard";
import PbrStatistics from "../common/PbrStatistics";
import { getCurrentNetworkName } from "../utils/helper";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

const useStyles = makeStyles((theme) => ({
  background: {
    paddingTop: 100,
    paddingLeft: 80,
    paddingRight: 80,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  section: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  title: {
    color: "#e5e5e5",
    fontSize: 24,
    fontWeight: 600,
    textAlign: "left",
  },
  otherTitle: {
    color: "#e5e5e5",
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      width: "100%",
    },
  },
  subheading: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 24,
    marginLeft: 5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
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
  cardsContainer: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
  },
  cardsContainer2: {
    marginTop: 120,
    marginBottom: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // flexWrap: "wrap",
  },
  card: {
    marginTop: 5,
    padding: 10,
    marginBottom: 5,
  },
  card2: {
    padding: 10,
    marginTop: 25,
    marginBottom: 5,
    alignSelf: "center",
    justifySelf: "center",
  },
  divider: {
    width: 90,
    height: 3,
    background: "linear-gradient(to right, #e0077d, rgba(0, 0, 0, 0.4))",
  },
  dividerPool: {
    width: 90,
    height: 3,
    background: "linear-gradient(to right, #e0077d, rgba(0, 0, 0, 0.4))",
    marginLeft: 5,
  },
}));

const Home = ({ account: { error, currentChain } }) => {
  const classes = useStyles();

  const { active, account, chainId } = useActiveWeb3React();

  useEffect(() => {
    if (!chainId || !active) {
      // check if there is existing cached selected network other wise select ethereum chain by default

      const cachedChain = localStorage.getItem("cachedChain");
      if (!cachedChain) {
        localStorage.setItem("cachedChain", 1);
      }

      const _network = getCurrentNetworkName(cachedChain || 1);
      console.log("setting cached chain to select chain id ", cachedChain || 1);

      store.dispatch({
        type: CHANGE_NETWORK,
        payload: { network: _network, chain: cachedChain || 1 },
      });

      return;
    }

    const _network = getCurrentNetworkName(chainId);

    store.dispatch({
      type: CONNECT_WALLET,
      payload: account,
    });
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: { network: _network, chain: chainId },
    });
  }, [chainId, active, account]);

  useEffect(() => {
    async function onNetworkChangeUpdate() {
      if (typeof window.web3 !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length === 0) {
            localStorage.connected = "none";
            return;
          }
        });

        window.ethereum.on("disconnect", (error) => {
          console.log("disconnected ", error);
          localStorage.connected = "none";
        });
      }
    }
    onNetworkChangeUpdate();
  }, []);

  useEffect(() => {
    if (!currentChain) {
      return;
    }
    console.log("chain changed ", currentChain);
    const cachedChain = localStorage.getItem("cachedChain");

    if (cachedChain && currentChain?.toString() !== cachedChain) {
      localStorage.setItem("cachedChain", currentChain?.toString());

      window.location.reload();
    } else if (!cachedChain) {
      localStorage.setItem("cachedChain", currentChain?.toString());
    }
  }, [currentChain]);

  useEffect(() => {
    if (JSON.stringify(error).includes("-32000")) {
      alert(
        `You don't have enough balance to pay gas fee for the transaction!`
      );
    } else if (JSON.stringify(error).includes("User rejected transaction")) {
      alert(`Transaction cancelled`);
    }
  }, [JSON.stringify(error)]);

  const supportedStakingPools = useMemo(
    () =>
      Object.keys(supportedStaking).includes(currentChain?.toString())
        ? supportedStaking?.[currentChain]
        : !currentChain
        ? supportedStaking[1]
        : [],
    [currentChain]
  );
  const unSupportedStakingPools = useMemo(
    () =>
      Object.keys(unsupportedStaking).includes(currentChain?.toString())
        ? unsupportedStaking?.[currentChain]
        : !currentChain
        ? unsupportedStaking[1]
        : [],
    [currentChain]
  );

  return (
    <div>
      <section className="appbar-section">
        <Navbar />
      </section>
      <div className="container">
        <div className={classes.background}>
          <h1 className={classes.title}>Stake Pools</h1>
          <div className={classes.divider} />
          <div className="row mt-5">
            <div className="col-md-8 mb-3">
              <PbrStatistics />
            </div>
            <div className="col-md-4">
              <div>
                <BalanceCard tokens={supportedStaking[chainId]} />
              </div>
            </div>
          </div>

          {!active && (
            <div className={classes.cardsContainer2}>
              <Wallet />
              <p className={classes.subheading}>
                Connect your Wallet to stake tokens
              </p>
            </div>
          )}
          {
            <div className="mt-3">
              {supportedStakingPools.length === 0 && (
                <div style={{ textAlign: "center", color: "white" }}>
                  No Staking pool available.
                </div>
              )}

              {supportedStakingPools.length > 0 && (
                <div className="row">
                  <div>
                    <h1 className={classes.title}>Active Pools</h1>
                    <div className={classes.dividerPool} />
                  </div>
                  {supportedStakingPools.map((token) => (
                    <div className="col-md-4">
                      <div className={classes.card}>
                        <SingleStakeCard tokenType={token} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
          {
            <div className="mt-3">
              {supportedStakingPools.length === 0 && (
                <div style={{ textAlign: "center", color: "white" }}></div>
              )}

              {unSupportedStakingPools.length > 0 && (
                <div className="row mt-5">
                  <div>
                    <h1 className={classes.title}>Ended Pool</h1>
                    <div className={classes.dividerPool} />
                  </div>
                  {unSupportedStakingPools.map((token) => (
                    <div className="col-md-4 mt-3">
                      <div className={classes.card}>
                        <SingleStakeCard tokenType={token} stopped={true} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        </div>

        <div className="d-flex justify-content-center pb-3">
          <Footer />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(Home);
