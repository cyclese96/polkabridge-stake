import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useState, useEffect } from "react";
import SingleStakeCard from "../components/SingleStakeCard";
import StakeDialog from "../common/StakeDialog";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

import Wallet from "../common/Wallet";
import PropTypes from "prop-types";
import { connectWallet, getAccountBalance } from "../actions/accountActions";
import { getPoolInfo } from "../actions/stakeActions";
import { connect } from "react-redux";
import {
  formatCurrency,
  isMetaMaskInstalled,
  getCurrentNetworkId,
  getCurrentAccount,
} from "../utils/helper";
import {
  bscConfig,
  bscNetwork,
  etherConfig,
  etheriumNetwork,
  harmonyConfig,
  harmonyNetwork,
  maticNetwork,
  supportedNetworks,
  supportedStaking,
  unsupportedStaking,
} from "../constants";
import { CHANGE_NETWORK, RESET_USER_STAKE } from "../actions/types";
import store from "../store";
import BalanceCard from "../common/BalanceCard";
import PbrStatistics from "../common/PbrStatistics";
import EndedPools from "../components/EndedPools";

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
  connectWallet,
  getPoolInfo,
  account: { currentAccount, connected, currentNetwork, error, loading },
  getAccountBalance,
  stake: { pool, poolLoading },
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState({
    open: false,
    type: null,
    tokenType: null,
  });
  const [currentChainId, setCurrentChainId] = useState(null);

  const onStake = (tokenType) => {
    setDialog({ open: true, type: "stake", tokenType: tokenType });
  };

  const onUnStake = (tokenType) => {
    setDialog({ open: true, type: "unstake", tokenType: tokenType });
  };

  const handleClose = () => {
    setDialog({ open: false, type: null });
  };

  const getCurrentNetwork = (networkId) => {
    const _id = networkId.toString();
    if (
      _id === bscConfig.network_id.mainnet ||
      _id === bscConfig.network_id.testnet
    ) {
      return bscNetwork;
    } else if (
      _id === etherConfig.network_id.mainet ||
      _id === etherConfig.network_id.koven
    ) {
      return etheriumNetwork;
    } else if (
      _id === harmonyConfig.chainId.mainnet ||
      _id === harmonyConfig.chainId.testnet
    ) {
      return harmonyNetwork;
    } else {
      return maticNetwork;
    }
  };

  useEffect(() => {
    async function onNetworkChangeUpdate() {
      if (typeof window.web3 !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length === 0) {
            return;
          }
          console.log("updating balance", accounts[0]);
          const _networkId = await getCurrentNetworkId();
          const _network = getCurrentNetwork(_networkId);
          console.log("connectWallet current network ", _network);
          await update(accounts[0], _network);
        });

        window.ethereum.on("networkChanged", async (networkId) => {
          const network = getCurrentNetwork(networkId);
          setCurrentChainId(parseInt(networkId));
          console.log("connectWallet current network ", network);
          store.dispatch({
            type: CHANGE_NETWORK,
            payload: network,
          });

          await update(currentAccount, network);
        });
        async function update(_account, _network) {
          console.log("connectWallet updating on network ", _network);

          store.dispatch({
            type: RESET_USER_STAKE,
          });

          await connectWallet(false, _network);
          await getPoolInfo(_network);

          await getAccountBalance(_account, _network);
        }
      }
    }
    onNetworkChangeUpdate();
  }, []);

  const getCurrentTokenType = () => {
    if (
      currentNetwork === etheriumNetwork ||
      currentNetwork === maticNetwork ||
      currentNetwork === harmonyNetwork
    ) {
      return "PBR";
    } else {
      return "CORGIB";
    }
  };

  const getCurrentPool = () => {
    if (
      currentNetwork === etheriumNetwork ||
      currentNetwork === maticNetwork ||
      currentNetwork === harmonyNetwork
    ) {
      return pool.PBR;
    } else {
      return pool.CORGIB;
    }
  };

  const getCurrentTokenPrice = () => {
    if (
      currentNetwork === etheriumNetwork ||
      currentNetwork === maticNetwork ||
      currentNetwork === harmonyNetwork
    ) {
      return formatCurrency(getCurrentPool().tokenPrice, true, 2);
    } else {
      return formatCurrency(getCurrentPool().tokenPrice, true, 2);
    }
  };
  const getCurrentTokenChange = () => {
    if (
      currentNetwork === etheriumNetwork ||
      currentNetwork === maticNetwork ||
      currentNetwork === harmonyNetwork
    ) {
      return formatCurrency(getCurrentPool().change, true, 2);
    } else {
      return formatCurrency(getCurrentPool().change, true, 2);
    }
  };

  const getCurrentTokenMCap = () => {
    // if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
    //   return getCurrentPool().mCap//formatCurrency(, false, 0);
    // } else {
    return getCurrentPool().mCap; //formatCurrency(, false, 0);
    // }
  };

  useEffect(async () => {
    let network = "";
    const account = await getCurrentAccount();

    // alert(account)
    if (isMetaMaskInstalled()) {
      const networkId = await getCurrentNetworkId();
      setCurrentChainId(networkId);
      // console.log("connectWallet network id", networkId);
      if (!supportedNetworks.includes(networkId.toString())) {
        // alert('This network is not supported yet! Please switch to Ethereum or Smart Chain network')
      }
      network = getCurrentNetwork(networkId.toString());
      // console.log("current network ", network);
      // alert(`current network set to  ${network}` )
      store.dispatch({
        type: CHANGE_NETWORK,
        payload: network,
      });
      await getPoolInfo(network);
    } else {
      // alert('meta mask not installed')
      network = etheriumNetwork;
      await getPoolInfo(network);
    }

    if (!isMetaMaskInstalled()) {
      return;
    }

    await connectWallet(false, network);
    await getAccountBalance(account, network);
  }, []);

  useEffect(() => {
    if (JSON.stringify(error).includes("-32000")) {
      alert(
        `You don't have enough balance to pay gas fee for the transaction!`
      );
    } else if (JSON.stringify(error).includes("User rejected transaction")) {
      alert(`Transaction cancelled`);
    }
    // alert(JSON.stringify(error))
  }, [JSON.stringify(error)]);

  return (
    <div>
      <section className="appbar-section">
        <Navbar currentNetwork={currentNetwork} chainId={currentChainId} />
      </section>
      <div className="container">
        <div className={classes.background}>
          <h1 className={classes.title}>Stake Pools</h1>
          <div className={classes.divider} />
          <div className="row mt-5">
            <div className="col-md-8 mb-3">
              <PbrStatistics
                poolLoading={poolLoading}
                tokenType={getCurrentTokenType()}
                price={getCurrentTokenPrice()}
                mCap={getCurrentTokenMCap()}
                change={getCurrentTokenChange()}
                network={currentNetwork}
              />
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
          {connected && (
            <div className="mt-3">
              {supportedStaking[currentNetwork].length === 0 && (
                <div style={{ textAlign: "center", color: "white" }}>
                  No Staking pool available.
                </div>
              )}

              {supportedStaking[currentNetwork].length > 0 && (
                <div className="row">
                  <div>
                    <h1 className={classes.title}>Active Pools</h1>
                    <div className={classes.dividerPool} />
                  </div>
                  {supportedStaking[currentNetwork].map((token) => (
                    <div className="col-md-4">
                      <div className={classes.card}>
                        <SingleStakeCard
                          onStake={onStake}
                          onUnstake={onUnStake}
                          tokenType={token}
                          price={getCurrentTokenPrice()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {connected && (
            <div className="mt-3">
              {supportedStaking[currentNetwork].length === 0 && (
                <div style={{ textAlign: "center", color: "white" }}>
                  No Staking pool available.
                </div>
              )}

              {unsupportedStaking[currentNetwork].length > 0 && (
                <div className="row mt-5">
                  <div>
                    <h1 className={classes.title}>Ended Pool</h1>
                    <div className={classes.dividerPool} />
                  </div>
                  {unsupportedStaking[currentNetwork].map((token) => (
                    <div className="col-md-4 mt-3">
                      <div className={classes.card}>
                        <EndedPools
                          onStake={onStake}
                          onUnstake={onUnStake}
                          tokenType={token}
                          price={getCurrentTokenPrice()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
  stake: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
  stake: state.stake,
});

export default connect(mapStateToProps, {
  connectWallet,
  getPoolInfo,
  getAccountBalance,
})(Home);
