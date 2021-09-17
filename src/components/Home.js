import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect } from "react";
import { Avatar, CircularProgress, Divider } from "@material-ui/core";

import Staking from "./Cards/Staking";
import Balance from "./Cards/Balance";
import StakeDialog from "./common/StakeDialog";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

import Wallet from "./common/Wallet";
import PropTypes from "prop-types";
import { connectWallet, getAccountBalance } from "../actions/accountActions";
import { getPoolInfo } from "../actions/stakeActions";
import { connect } from "react-redux";
import {
  fromWei,
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
  maticNetwork,
  supportedNetworks,
  supportedStaking,
} from "../constants";
import { CHANGE_NETWORK, RESET_USER_STAKE } from "../actions/types";
import store from "../store";
import web3 from "../web";
import BalanceCard from "./common/BalanceCard";
import StakeCard from "./common/StakeCard";
import PbrStats from "./common/PbrStats";
import Loader from "./common/Loader";
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
}));

const Home = ({
  connectWallet,
  getPoolInfo,
  account: { currentAccount, connected, currentNetwork, error },
  getAccountBalance,
  stake: { pool, poolLoading },
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState({
    open: false,
    type: null,
    tokenType: null,
  });

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
    if (
      networkId === bscConfig.network_id.mainnet ||
      networkId === bscConfig.network_id.testnet
    ) {
      return bscNetwork;
    } else if (
      networkId === etherConfig.network_id.mainet ||
      networkId === etherConfig.network_id.koven
    ) {
      return etheriumNetwork;
    } else {
      return maticNetwork;
    }
  };
  useEffect(async () => {
    if (typeof window.web3 !== "undefined") {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          return;
        }
        store.dispatch({
          type: RESET_USER_STAKE,
        });
        await getPoolInfo(currentNetwork);
        await connectWallet(false, currentNetwork);
        // await getAccountBalance(currentNetwork)
      });

      window.ethereum.on("networkChanged", async (networkId) => {
        // setCurrentNetwork(networkId)
        const network = getCurrentNetwork(networkId);
        console.log("current network ", network);
        store.dispatch({
          type: CHANGE_NETWORK,
          payload: network,
        });

        store.dispatch({
          type: RESET_USER_STAKE,
        });
        await getPoolInfo(network);
        await connectWallet(false, network);
        // await getAccountBalance(network)
      });
    }
  }, []);

  const getCurrentTokenType = () => {
    if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
      return "PBR";
    } else {
      return "CORGIB";
    }
  };

  const getCurrentPool = () => {
    if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
      return pool.PBR;
    } else {
      return pool.CORGIB;
    }
  };

  const getCurrentApy = () => {
    if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
      return getCurrentPool().pbrApy;
    } else {
      return getCurrentPool().corgibApy;
    }
  };

  const getCurrentTokenPrice = () => {
    if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
      return formatCurrency(getCurrentPool().tokenPrice, true, 2);
    } else {
      return formatCurrency(getCurrentPool().tokenPrice, true, 2);
    }
  };
  const getCurrentTokenChange = () => {
    if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
      return formatCurrency(getCurrentPool().change, true, 2);
    } else {
      return formatCurrency(getCurrentPool().change, true, 2);
    }
  };

  const getCurrentTokenMCap = () => {
    if (currentNetwork === etheriumNetwork || currentNetwork === maticNetwork) {
      return formatCurrency(getCurrentPool().mCap, false, 0);
    } else {
      return formatCurrency(getCurrentPool().mCap, false, 0);
    }
  };

  useEffect(async () => {
    let network = "";
    const account = await getCurrentAccount();

    // alert(account)
    if (isMetaMaskInstalled()) {
      const networkId = await getCurrentNetworkId();
      console.log("network id", networkId);
      if (!supportedNetworks.includes(networkId.toString())) {
        // alert('This network is not supported yet! Please switch to Ethereum or Smart Chain network')
      }
      network = getCurrentNetwork(networkId.toString());
      console.log("current network ", network);
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
    await getAccountBalance(network);
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
        <Navbar currentNetwork={currentNetwork} />
      </section>
      <div className="container">
        <div className={classes.background}>
          <h1 className={classes.title}>Stake Pools</h1>
          <div className={classes.divider} />
          <div className="row mt-5">
            <div className="col-md-8 mb-3">
              <PbrStats
                poolLoading={poolLoading}
                tokenType={getCurrentTokenType()}
                price={getCurrentTokenPrice()}
                mCap={getCurrentTokenMCap()}
                change={getCurrentTokenChange()}
              />
            </div>
            <div className="col-md-4">
              <div>
                <BalanceCard tokens={supportedStaking[currentNetwork]} />
              </div>
            </div>
          </div>

          {!connected && (
            <div className={classes.cardsContainer2}>
              <Wallet />
              <p className={classes.subheading}>
                Connect your Wallet to stake tokens
              </p>
            </div>
          )}
          {connected && (
            <div className="mt-3">
              <div className="row">
                {supportedStaking[currentNetwork].map((token) => (
                  <div className="col-md-4">
                    <div className={classes.card}>
                      <Staking
                        onStake={onStake}
                        onUnstake={onUnStake}
                        tokenType={token}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
