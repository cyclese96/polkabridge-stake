import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";

import Staking from "./Cards/Staking";
import Balance from "./Cards/Balance";
import StakeDialog from "./common/StakeDialog";
import stakeContract from "../utils/stakeConnection";
import web3 from "../web3";
import pbrContract from "../utils/pbrConnection";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import axios from "axios";
import config from "../config";
import BigNumber from "bignumber.js";

import Wallet from "./common/Wallet";
import PropTypes from "prop-types";
import {
  connectWallet,
  getAccountBalance,
  logout,
} from "../actions/accountActions";
import {
  stakeTokens,
  unstakeTokens,
  getPoolInfo,
  updateAcountData,
  checkAllowance,
  confirmAllowance,
} from "../actions/stakeActions";
import { connect } from "react-redux";
import store from "../store";
import { fromWei, toWei, formatCurrency } from "../actions/helper";
import { SET_ACCOUNT } from "../actions/types";
// const web3 = web3Config.web3;

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
}));

const Home = ({
  connectWallet,
  getPoolInfo,
  updateAcountData,
  checkAllowance,
  confirmAllowance,
  stakeTokens,
  unstakeTokens,
  logout,
  account: { currentAccount, balance, loading, connected },
  stake: { stakeData, poolData, approved },
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState({ open: false, type: null });

  const onStake = () => {
    setDialog({ open: true, type: "stake" });
  };

  const onUnStake = () => {
    setDialog({ open: true, type: "unstake" });
  };

  const handleClose = () => {
    setDialog({ open: false, type: null });
  };

  const handleStakeConfirm = async (enteredTokens) => {
    await stakeTokens(enteredTokens, currentAccount);
    setDialog({ open: false, type: "" });
  };

  const handleUnstakeConfirm = async (enteredTokens) => {
    await unstakeTokens(enteredTokens, currentAccount);
    setDialog({ open: false, type: "" });
  };

  useEffect(async () => {
    window.ethereum.on("accountsChanged", async (accounts) => {
      if (accounts.length === 0) {
        return;
      }
      store.dispatch({
        type: SET_ACCOUNT,
        payload: accounts[0],
      });
      await connectWallet();
      await updateAcountData();
    });
  }, []);

  const signOut = async () => {
    localStorage.setItem("loggedOut", currentAccount);
    logout();
  };
  const handleConnectWallet = async () => {
    localStorage.setItem("loggedOut", "");
    await connectWallet();
    await updateAcountData();
  };
  useEffect(async () => {
    await getPoolInfo();
    await connectWallet();
    await updateAcountData();
  }, []);

  return (
    <div>
      <section className="appbar-section">
        <Navbar
          handleConnectWallet={handleConnectWallet}
          handleSignOut={signOut}
          account={currentAccount}
          connected={connected}
          pbrBalance={formatCurrency(fromWei(balance))}
        />
      </section>

      <div className={classes.background}>
        <Avatar className={classes.logo} src="img/symbol.png" />
        <p className={classes.heading}>
          PBR price:
          <strong className={classes.numbers}>
            {formatCurrency(poolData.tokenPrice, true)}
          </strong>
        </p>
        <p className={classes.heading}>
          APY:
          <strong className={classes.numbers}>
            {formatCurrency(poolData.apy)} %
          </strong>
        </p>
        <p className={classes.heading}>
          Total Token Staked :
          <strong className={classes.numbers}>
            {formatCurrency(fromWei(poolData.totalTokenStaked))} PBR
          </strong>
        </p>

        <p className={classes.heading}>
          Total Rewards Claimed:
          <strong className={classes.numbers}>
            {formatCurrency(fromWei(poolData.totalTokenClaimed))} PBR
          </strong>
        </p>

        {!connected ? (
          <div className={classes.cardsContainer2}>
            <Wallet
              onClick={connectWallet}
              account={currentAccount}
              connected={connected}
            />
            <p className={classes.subheading}>
              Unlock your Wallet to stake tokens
            </p>
          </div>
        ) : (
          <div className={classes.cardsContainer}>
            <div className={classes.card}>
              <Staking
                stakeData={stakeData}
                onStake={onStake}
                onUnstake={onUnStake}
                account={currentAccount}
                loading={loading}
                approved={approved}
                handleApprove={() => confirmAllowance(toWei("999999999"))}
              />
            </div>
            <div className={classes.card}>
              <Balance balance={balance} loading={loading} />
            </div>
            <StakeDialog
              loading={loading}
              balance={balance}
              stakedData={stakeData}
              account={currentAccount}
              open={dialog.open}
              type={dialog.type}
              handleClose={handleClose}
              handleOnStake={handleStakeConfirm}
              handleOnUnstake={handleUnstakeConfirm}
            />
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
  getAccountBalance,
  updateAcountData,
  stakeTokens,
  unstakeTokens,
  getPoolInfo,
  checkAllowance,
  confirmAllowance,
  logout,
})(Home);
