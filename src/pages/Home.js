import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useMemo } from "react";
import SingleStakeCard from "../components/SingleStakeCard";
import StakeDialog from "../common/StakeDialog";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

import Wallet from "../common/Wallet";
import PropTypes from "prop-types";
import { getAccountBalance } from "../actions/accountActions";
import { connect } from "react-redux";

import { supportedStaking, unsupportedStaking } from "../constants";
import { CHANGE_NETWORK, CONNECT_WALLET } from "../actions/types";
import store from "../store";
import BalanceCard from "../common/BalanceCard";
import PbrStatistics from "../common/PbrStatistics";
import { useWeb3React } from "@web3-react/core";
import { getCurrentNetworkName } from "../utils/helper";

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

const Home = ({
  account: { connected, currentNetwork, error, loading },
  getAccountBalance,
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState({
    open: false,
    type: null,
    tokenType: null,
  });

  const { active, account, chainId } = useWeb3React();

  const onStake = (tokenType) => {
    setDialog({ open: true, type: "stake", tokenType: tokenType });
  };

  const onUnStake = (tokenType) => {
    setDialog({ open: true, type: "unstake", tokenType: tokenType });
  };

  const handleClose = () => {
    setDialog({ open: false, type: null });
  };

  useEffect(() => {
    if (!chainId || !active) {
      if (localStorage.currentNetwork) {
        console.log("currenNetwork", localStorage.currentNetwork);
        const _network = getCurrentNetworkName(chainId);

        store.dispatch({
          type: CHANGE_NETWORK,
          payload: _network,
        });
      }

      return;
    }

    const _network = getCurrentNetworkName(chainId);

    store.dispatch({
      type: CONNECT_WALLET,
      payload: account,
    });
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: _network,
    });

    getAccountBalance(account, _network);
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
    console.log("current network ", currentNetwork);
  }, [currentNetwork]);

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
    () => supportedStaking[currentNetwork],
    [currentNetwork]
  );
  const unSupportedStakingPools = useMemo(
    () => unsupportedStaking[currentNetwork],
    [currentNetwork]
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
                <BalanceCard tokens={supportedStaking[currentNetwork]} />
              </div>
            </div>
          </div>

          {!connected && !loading && (
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
                        <SingleStakeCard
                          onStake={onStake}
                          onUnstake={onUnStake}
                          tokenType={token}
                        />
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
                        <SingleStakeCard
                          onStake={onStake}
                          onUnstake={onUnStake}
                          tokenType={token}
                          stopped={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }

          <StakeDialog
            open={dialog.open}
            type={dialog.type}
            tokenType={dialog.tokenType}
            handleClose={handleClose}
          />
        </div>

        <div className="d-flex justify-content-center pb-3">
          <Footer />
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  connectWallet: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {
  getAccountBalance,
})(Home);
