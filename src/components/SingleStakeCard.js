import { Button, Card, Divider, makeStyles } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo } from "react";
import { BigNumber } from "bignumber.js";

import CustomButton from "./CustomButton";
import {
  formatCurrency,
  formatLargeNumber,
  fromWei,
  toWei,
} from "../utils/helper";
import { connect } from "react-redux";
import {
  confirmAllowance,
  getUserStakedData,
  getPoolInfo,
  unstakeTokens,
} from "../actions/stakeActions";
import { getAccountBalance } from "../actions/accountActions";
import {
  claimTokens,
  bscNetwork,
  poolId,
  unsupportedStaking,
  tokenInfo,
  tokenLogo,
  tokenName,
  LABS,
  CORGIB,
  tokenContarctAddresses,
} from "../constants";
import Loader from "./../common/Loader";
import DotCircle from "./../common/DotCircle";
import { RESET_USER_STAKE } from "../actions/types";
import store from "../store";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useTokenContract } from "../hooks/useContract";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    minHeight: 421,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    border: "1px solid #212121",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: "100%",
      height: "100%",
    },
  },
  cardHeader: {
    paddingTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
  avatar: {
    height: "35px",
  },
  cardHeading: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 14,
    alignSelf: "start",
    marginLeft: 60,
    margin: 0,
  },

  buttons: {
    marginTop: 20,
    marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  hint: {
    paddingTop: 4,
    fontSize: 10,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  bitePool: {
    marginBottom: 20,
    alignSelf: "start",
  },
  poolItemText: {
    fontSize: 12,
    marginLeft: 60,
    margin: 0,
    marginTop: 2,
  },
  stakeButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap-reverse",
  },
  stakeButton: {
    marginTop: 5,
    alignSelf: "center",
    justifySelf: "center",
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
  tokenTitleTvl: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e5e5",
    // backgroundColor: "#C80C81",
    border: "1px solid rgba(224, 7, 125, 0.6)",

    borderRadius: 14,
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
  tokenAmountTvl: {
    fontWeight: 700,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#e5e5e5",
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
  earn: {
    textAlign: "center",
    color: "#bdbdbd",
    fontSize: 10,
  },
  desktop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
  },
  borderButton: {
    background: `transparent`,
    color: "white",
    width: "fit-content",
    height: 32,
    textTransform: "none",
    borderRadius: 30,
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    border: "1px solid rgba(224, 7, 125, 0.3)",
    padding: "5px 20px 5px 20px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      fontSize: 13,
    },
  },
  borderButtonRegister: {
    background: "rgba(224, 7, 125, 0.7)",
    color: "white",
    width: "fit-content",
    height: 32,
    textTransform: "none",
    borderRadius: 30,
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    border: "1px solid rgba(224, 7, 125, 0.3)",
    padding: "5px 20px 5px 20px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      fontSize: 13,
    },
  },
}));

const Staking = ({
  stake: { stake, pool, approved },
  account: { currentAccount, currentNetwork, loading },
  tokenType,
  getUserStakedData,
  confirmAllowance,
  getPoolInfo,
  getAccountBalance,
  unstakeTokens,
  onStake,
  onUnstake,
  stopped = false,
}) => {
  const classes = useStyles();
  const { chainId, active, library } = useActiveWeb3React();

  useEffect(async () => {
    // if (!currentNetwork || !currentAccount) {
    //   return
    // }

    const pid = poolId?.[tokenType];
    await Promise.all([
      getPoolInfo(tokenType, pid, currentAccount, currentNetwork),
      getUserStakedData(tokenType, currentNetwork),
    ]);
  }, [currentAccount, currentNetwork]);

  useEffect(() => {
    if (!active) {
      store.dispatch({
        type: RESET_USER_STAKE,
      });
    }
  }, [active]);

  const tokenContract = useTokenContract(
    tokenContarctAddresses.ethereum?.[tokenType]
  );

  useEffect(() => {
    console.log("token contract ", {
      address: tokenContract?.address,
      contract: tokenContract,
    });
  }, [tokenContract]);

  const handleApprove = useCallback(() => {
    const tokenWeiAmountToApprove =
      currentNetwork === bscNetwork
        ? "999999999999999999999999999999999999"
        : toWei("999999999");
    confirmAllowance(
      tokenWeiAmountToApprove,
      tokenType,
      tokenContract,
      currentAccount,
      currentNetwork
    );
  }, [tokenContract, chainId]);
  // const handleApprove = async (tokenType) => {
  //   const tokenWeiAmountToApprove =
  //     currentNetwork === bscNetwork
  //       ? "999999999999999999999999999999999999"
  //       : toWei("999999999");

  //   await confirmAllowance(
  //     tokenWeiAmountToApprove,
  //     tokenType,
  //     currentNetwork,
  //     currentAccount,
  //     library
  //   );

  //   await getUserStakedData(tokenType, currentNetwork);
  // };

  const handleClaim = async (tokenType) => {
    const tokensToClaim = claimTokens;

    await unstakeTokens(
      tokensToClaim,
      currentAccount,
      tokenType,
      currentNetwork,
      library
    );

    const pid = poolId?.[tokenType];
    await Promise.all([
      getPoolInfo(tokenType, pid, currentAccount, currentNetwork),
      getAccountBalance(currentNetwork),
    ]);
  };

  const currentAmount = (tokenType) => {
    return stake[tokenType] ? stake[tokenType].amount : 0;
  };

  const getCurrencyFormatForToken = (tokenType, tokens) => {
    return formatLargeNumber(fromWei(tokens));
  };

  const claimDisableStatus = (_tokenType) => {
    return currentAmount(_tokenType) == 0;
  };

  const stakeDisableStatus = (_tokenType) => {
    if (unsupportedStaking?.[currentNetwork]?.includes(_tokenType)) {
      return true;
    }

    return false;
  };

  const withdrawDisableStatus = (_tokenType) => {
    return false;
  };

  const approveDisableStatus = (_tokenType) => {
    return false;
  };

  const totalValueLocked = useMemo(() => {
    if (!pool?.[tokenType]) {
      return "0";
    }

    if (tokenType === CORGIB) {
      const _locked = new BigNumber(
        fromWei(pool?.[tokenType]?.totalTokenStaked)
      )
        .multipliedBy(pool?.[tokenType]?.tokenPriceCorgib)
        .toString();
    }
    return formatLargeNumber(
      new BigNumber(fromWei(pool?.[tokenType]?.totalTokenStaked))
        .multipliedBy(pool?.[tokenType]?.tokenPrice)
        .toString()
    );
  }, [pool, tokenType]);

  return (
    <Card elevation={10} className={classes.card}>
      {loading[tokenType] && (
        <div className="text-center">
          <Loader height={300} />
        </div>
      )}
      {!loading[tokenType] && (
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-center align-items-center pt-2 pb-1">
            <img className={classes.avatar} src={tokenLogo[tokenType]} />
            <small
              style={{
                color: "#f9f9f9",
                marginLeft: 10,
                fontSize: 18,
              }}
            >
              {tokenType}
            </small>
          </div>

          <div className="d-flex justify-content-center align-items-center ">
            <div
              style={{
                backgroundColor: "#C80C81",
                borderRadius: "50%",
                height: "5px",
                width: "5px",
                marginRight: 5,
              }}
            ></div>
            <div className={classes.earn}>Earn {tokenName[tokenType]}</div>
          </div>
          <div className="d-flex justify-content-center  pt-3">
            {tokenType === LABS && (
              <a href="https://forms.gle/jqadUuQmKhzSrf678" target="_blank">
                <Button
                  variant="contained"
                  className={classes.borderButtonRegister}
                >
                  IDO Register
                </Button>
              </a>
            )}
            <a
              href={tokenInfo?.[tokenType]?.[currentNetwork]?.buy}
              target="_blank"
            >
              <Button variant="contained" className={classes.borderButton}>
                Buy
              </Button>
            </a>
            <a
              href={tokenInfo?.[tokenType]?.[currentNetwork]?.info}
              target="_blank"
            >
              <Button variant="contained" className={classes.borderButton}>
                Info
              </Button>
            </a>
          </div>
          <div style={{ minHeight: 120, paddingLeft: 10, paddingRight: 10 }}>
            <div className="mt-3">
              <div className="d-flex justify-content-between mt-1">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>APY</div>
                  </div>
                </div>
                <div className={classes.tokenAmount}>
                  {formatCurrency(pool?.[tokenType]?.apy, false, 1, true)}%
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>Total Staked</div>
                  </div>
                </div>
                <div className={classes.tokenAmount}>
                  {getCurrencyFormatForToken(
                    tokenType,
                    pool[tokenType] ? pool[tokenType].totalTokenStaked : "0"
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex justify-content-start">
                  <div>
                    <div className={classes.tokenTitle}>Total Claimed</div>
                  </div>
                </div>
                <div className={classes.tokenAmount}>
                  {formatLargeNumber(
                    fromWei(
                      pool[tokenType] ? pool[tokenType].totalTokenClaimed : "0"
                    )
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-center my-4">
                <div>
                  <div className={classes.tokenTitleTvl}>
                    Total Value Locked:{" "}
                    <span className={classes.tokenAmountTvl}>
                      $ {totalValueLocked}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider style={{ backgroundColor: "#616161", height: 1 }} />

          {active && (
            <div className={classes.desktop}>
              <div className="text-center mt-4">
                <div className={classes.tokenTitle}>Staked</div>
                <div className={classes.tokenAmount}>
                  {" "}
                  {tokenType === "PWAR"
                    ? formatCurrency(
                        fromWei(stake?.[tokenType]?.amount),
                        false,
                        1,
                        true
                      )
                    : formatCurrency(fromWei(stake?.[tokenType]?.amount))}{" "}
                </div>
              </div>
              <div className="text-center mt-4">
                <div className={classes.tokenTitle}>Claimed</div>
                <div className={classes.tokenAmount}>
                  {" "}
                  {tokenType === "PWAR"
                    ? formatCurrency(
                        fromWei(stake?.[tokenType]?.rewardClaimed),
                        false,
                        1,
                        true
                      )
                    : formatCurrency(
                        fromWei(stake?.[tokenType]?.rewardClaimed)
                      )}{" "}
                </div>
              </div>
              <div className="text-center mt-4">
                <div className={classes.tokenTitle}>Pending</div>
                <div className={classes.tokenAmount}>
                  {" "}
                  {tokenType === "PWAR"
                    ? formatCurrency(
                        fromWei(stake?.[tokenType]?.pendingReward),
                        false,
                        1,
                        true
                      )
                    : formatCurrency(
                        fromWei(stake?.[tokenType]?.pendingReward)
                      )}{" "}
                </div>
              </div>
            </div>
          )}

          <div className={classes.buttons}>
            {!active && (
              <div className="text-center">
                <p className={classes.hint}>Connect wallet</p>
              </div>
            )}
            {active && !approved?.[tokenType] && (
              <div className="text-center">
                <CustomButton
                  disabled={approveDisableStatus(tokenType)}
                  onClick={() => handleApprove(tokenType)}
                >
                  Approve
                </CustomButton>
                <p className={classes.hint}>
                  <DotCircle />
                  <span style={{ paddingLeft: 5 }}>
                    Approve {tokenType} tokens to start staking
                  </span>
                </p>
              </div>
            )}
            {active && approved?.[tokenType] && (
              <div className={classes.stakeButtons}>
                <CustomButton
                  hidden={stopped}
                  disabled={claimDisableStatus(tokenType)}
                  onClick={() => handleClaim(tokenType)}
                >
                  Claim
                </CustomButton>

                <CustomButton
                  disabled={stakeDisableStatus(tokenType)}
                  hidden={stopped}
                  onClick={() => onStake(tokenType)}
                >
                  Stake
                </CustomButton>
                <CustomButton
                  disabled={withdrawDisableStatus(tokenType)}
                  onClick={() => onUnstake(tokenType)}
                  variant="light"
                >
                  Unstake
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  stake: state.stake,
  account: state.account,
});

export default connect(mapStateToProps, {
  getUserStakedData,
  confirmAllowance,
  getPoolInfo,
  getAccountBalance,
  unstakeTokens,
})(React.memo(Staking));
