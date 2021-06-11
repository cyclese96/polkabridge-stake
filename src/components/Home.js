import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect } from "react";
import { Avatar, CircularProgress } from "@material-ui/core";

import Staking from "./Cards/Staking";
import Balance from "./Cards/Balance";
import StakeDialog from "./common/StakeDialog";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";

import Wallet from "./common/Wallet";
import PropTypes from "prop-types";
import { connectWallet, logout } from "../actions/accountActions";
import { getPoolInfo } from "../actions/stakeActions";
import { connect } from "react-redux";
import { fromWei, formatCurrency, isMetaMaskInstalled } from "../utils/helper";

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
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
    marginLeft: 5,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  logo: {
    width: 95,
    height: 95,
    marginTop: 5,
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    padding: 12,
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
    marginBottom: 5,
  },
  card2: {
    marginTop: 25,
    marginBottom: 5,
    alignSelf: "center",
    justifySelf: "center",
  },
}));

const Home = ({
  connectWallet,
  getPoolInfo,
  logout,
  account: { currentAccount, pbrBalance, biteBalance, connected },
  stake: { pbrPoolData, poolLoading },
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState({ open: false, type: null, tokenType: null });

  const onStake = (tokenType) => {
    setDialog({ open: true, type: "stake", tokenType: tokenType });
  };

  const onUnStake = (tokenType) => {
    setDialog({ open: true, type: "unstake", tokenType: tokenType });
  };

  const handleClose = () => {
    setDialog({ open: false, type: null });
  };

  useEffect(async () => {
    if (typeof window.web3 !== "undefined") {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          return;
        }
        console.log("account changed");

        await connectWallet();
      });
    }
  }, []);

  const signOut = async () => {
    localStorage.setItem(`logout${currentAccount}`, currentAccount);
    logout();
  };

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert("Please install Meta Mask to connect");
      return;
    }
    await connectWallet(true);
  };

  useEffect(async () => {
    await getPoolInfo();

    if (!isMetaMaskInstalled()) {
      return;
    }

    await connectWallet();
  }, []);

  return (
    <div>
      <section className="appbar-section">
        <Navbar
          handleConnectWallet={handleConnectWallet}
          handleSignOut={signOut}
          account={currentAccount}
          connected={connected}
          pbrBalance={formatCurrency(fromWei(pbrBalance))}
          biteBalance={formatCurrency(fromWei(biteBalance))}
        />
      </section>

      <div className={classes.background}>
        <Avatar className={classes.logo} src="img/symbol.png" />
        {poolLoading ? (
          <div style={{ marginTop: 132, marginBottom: 16 }}>
            <CircularProgress className={classes.numbers} />
          </div>
        ) : (
          <>
            <p className={classes.heading}>
              PBR price:
              <strong className={classes.numbers}>
                {formatCurrency(pbrPoolData.tokenPrice, true, 3)}
              </strong>
            </p>
            <p className={classes.heading}>
              PBR APY:
              <strong className={classes.numbers}>
                {formatCurrency(pbrPoolData.pbrApy)} %
              </strong>
            </p>
            <p className={classes.heading}>
              Total Token Staked :
              <strong className={classes.numbers}>
                {formatCurrency(fromWei(pbrPoolData.totalTokenStaked))} PBR
              </strong>
            </p>

            <p className={classes.heading}>
              Total Rewards Claimed:
              <strong className={classes.numbers}>
                {formatCurrency(fromWei(pbrPoolData.totalTokenClaimed))} PBR
              </strong>
            </p>
          </>
        )}

        {!connected ? (
          <div className={classes.cardsContainer2}>
            <Wallet
              onClick={handleConnectWallet}
              account={currentAccount}
              connected={connected}
            />
            <p className={classes.subheading}>
              Unlock your Wallet to stake tokens
            </p>
          </div>
        ) : (
          <div>
            <div className={classes.cardsContainer}>
              <div className={classes.card}>
                <Staking
                  onStake={onStake}
                  onUnstake={onUnStake}
                  tokenType="PBR"
                />
              </div>
              <div className={classes.card}>
                <Balance tokenType="PBR" />
              </div>
              <StakeDialog
                open={dialog.open}
                type={dialog.type}
                tokenType={dialog.tokenType}
                handleClose={handleClose}
              />
            </div>

            <div className={classes.cardsContainer}>
              <Staking tokenType="BITE" onStake={onStake}
                onUnstake={onUnStake} />
              <div className={classes.card}>
                <Balance tokenType="BITE" />
              </div>
            </div>

          </div>
        )}

        <Footer />
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
  logout,
})(Home);
