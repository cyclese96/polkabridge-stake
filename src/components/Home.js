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

const Home = () => {
  const classes = useStyles();
  const [dialog, setDialog] = React.useState({ open: false, type: null });
  const [pbrBalance, setPbrBal] = useState(null);
  const [stakedData, setStakeData] = useState({});
  const [poolId, setPoolId] = useState(0);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [poolData, setPoolData] = useState({});
  const [connected, setConnected] = useState(false);
  const [approved, setApproved] = useState(false);

  const onStake = () => {
    console.log(stakedData);
    setDialog({ open: true, type: "stake" });
  };

  const onUnStake = () => {
    setDialog({ open: true, type: "unstake" });
  };

  const handleClose = () => {
    setDialog({ open: false, type: null });
  };

  const checkNetwork = () => {
    console.log("web3 provider", web3.currentProvider.networkVersion);
    if (web3.currentProvider.networkVersion === "42") {
      return true;
    } else {
      return false;
    }
  };

  const fromWei = (tokens) => {
    if (!tokens) {
      return web3.utils.fromWei("0", "ether");
    }
    let amount = web3.utils.fromWei(tokens, "ether");
    return new BigNumber(amount).toFixed(1).toString();
  };

  const toWei = (tokens) => {
    if (!tokens) {
      return web3.utils.toWei("0", "ether");
    }
    return web3.utils.toWei(tokens, "ether");
  };

  const connectWallet = async () => {
    console.log("connect wallet");
    // showAlert({ status: true, message: 'Already connected' })
    if (web3 !== undefined) {
      if (checkNetwork()) {
        try {
          const accounts = await web3.eth.requestAccounts();
          const accountAddress = accounts[0];
          setAccount(accountAddress);
          getAccountBalance(accountAddress);
          setConnected(true);
        } catch (error) {
          setConnected(false);
        }
      } else {
        console.log("wrong net");
        setConnected(false);
        // showAlert({ status: true, message: 'Wrong Network' });
      }
    } else {
      console.log("meta mask not found");
      // showAlert({ status: true, message: 'Install metamask first!' });
    }
  };

  const updatePoolInfo = async () => {
    //get pool info
    const pool = await stakeContract.methods.getPoolInfo(poolId).call();
    console.log("pool info", pool);
    const poolObj = {
      accTokenPerShare: pool[0],
      lastRewardBlock: pool[1],
      rewardPerBlock: pool[2],
      totalTokenStaked: pool[3],
      totalTokenClaimed: pool[4],
    };

    const { data } = await axios.get(
      config.coingecko +
        "/v3/simple/price?ids=polkabridge&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
    );

    poolObj.tokenPrice = data.polkabridge
      ? new BigNumber(data.polkabridge.usd).toFixed(1).toString()
      : "---";

    const NUMBER_BLOCKS_PER_YEAR = 2400000;
    const avg_pbr_perblock = 1.5;

    let tokenPrice = new BigNumber(poolObj.tokenPrice);
    const total_value_locked_usd = tokenPrice.times(
      new BigNumber(fromWei(poolObj.totalTokenStaked))
    );
    const apy = tokenPrice
      .times(new BigNumber(NUMBER_BLOCKS_PER_YEAR))
      .times(new BigNumber(avg_pbr_perblock))
      .div(total_value_locked_usd)
      .times(100)
      .toFixed(1)
      .toString();

    poolObj.apy = apy;

    setPoolData(poolObj);
  };

  const getAccountBalance = async (accountAddr) => {
    setLoading(true);
    await checkAllowance(accountAddr);
    const pbrWei = await pbrContract.methods.balanceOf(accountAddr).call();
    setPbrBal(fromWei(pbrWei));

    const stakedData = await stakeContract.methods
      .userInfo(0, accountAddr)
      .call();
    const pendingReward = await stakeContract.methods
      .pendingReward(0, accountAddr)
      .call();

    if (stakedData) {
      setStakeData({
        amount: fromWei(stakedData.amount),
        rewardClaimed: fromWei(stakedData.rewardClaimed),
        rewardDebt: fromWei(pendingReward),
      });
    }
    setLoading(false);
  };

  const checkAllowance = async (account) => {
    try {
      setApproved(false);
      const allowance = await pbrContract.methods
        .allowance(account, stakeContract._address)
        .call();

      console.log(allowance);
      if (new BigNumber(allowance).gt(0)) {
        setApproved(true);
      }
      console.log("allowance", new BigNumber(allowance).gt(0));
    } catch (error) {
      console.log("allowance error", error);
    }
  };

  const confirmAllowance = async (balance) => {
    try {
      console.log(balance);
      setLoading(true);
      const res = await pbrContract.methods
        .approve(stakeContract._address, balance)
        .send({ from: account });
      setLoading(false);
      setApproved(true);
    } catch (error) {
      console.log("allowance error", error);
      setLoading(false);
    }
  };

  const handleStakeConfirm = async (enteredTokens) => {
    setLoading(true);
    const depositTokens = web3.utils.toWei(enteredTokens, "ether");
    try {
      const res = await stakeContract.methods
        .deposit(poolId, depositTokens)
        .send({ from: account });

      getAccountBalance(account);

      setDialog({ open: false });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUnstakeConfirm = async (enteredTokens) => {
    setLoading(true);
    const depositTokens = toWei(enteredTokens, "ether");

    try {
      const res = await stakeContract.methods
        .withdraw(poolId, depositTokens)
        .send({ from: account });

      getAccountBalance(account);

      setDialog({ open: false });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(async () => {
    window.ethereum.on("accountsChanged", async (accounts) => {
      console.log("account changes", accounts);
      setAccount(accounts[0]);
      getAccountBalance(accounts[0]);
    });
  }, []);

  const signOut = async () => {
    // setAccount(null);
    // getAccountBalance(null);
  };
  useEffect(async () => {
    if (web3 === undefined) {
      console.log("web3 is there", web3);
      alert("Install Meta Mask to connect your wallet");
      return;
    }
    try {
      await updatePoolInfo();
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      getAccountBalance(accounts[0]);
      setConnected(true);
    } catch (error) {
      alert("Connect Meta Mask");
    }
  }, []);

  return (
    <div>
      <section className="appbar-section">
        <Navbar
          handleConnectWallet={connectWallet}
          handleSignOut={signOut}
          account={account}
          pbrBalance={pbrBalance}
        />
      </section>

      <div className={classes.background}>
        <Avatar className={classes.logo} src="img/symbol.png" />
        <p className={classes.heading}>
          PBR price:{" "}
          <strong className={classes.numbers}> ${poolData.tokenPrice}</strong>
        </p>
        <p className={classes.heading}>
          Annual Percentage Yield:
          <strong className={classes.numbers}>{poolData.apy} %</strong>
        </p>
        <p className={classes.heading}>
          Total Token Staked :
          <strong className={classes.numbers}>
            {fromWei(poolData.totalTokenStaked)} PBR
          </strong>
        </p>

        <p className={classes.heading}>
          Total Rewards Claimed:
          <strong className={classes.numbers}>
            {fromWei(poolData.totalTokenClaimed)} PBR
          </strong>
        </p>

        {!connected ? (
          <div className={classes.cardsContainer2}>
            <Wallet />
            <p className={classes.subheading}>
              Unlock your Wallet to stake tokens
            </p>
          </div>
        ) : (
          <div className={classes.cardsContainer}>
            <div className={classes.card}>
              <Staking
                stakeData={stakedData}
                onStake={onStake}
                onUnstake={onUnStake}
                account={account}
                loading={loading}
                approved={approved}
                handleApprove={() => confirmAllowance(toWei("999999999"))}
              />
            </div>
            <div className={classes.card}>
              <Balance balance={pbrBalance} loading={loading} />
            </div>
            <StakeDialog
              loading={loading}
              balance={pbrBalance}
              stakedData={stakedData}
              account={account}
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

export default Home;
