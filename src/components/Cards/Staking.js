import { Card, CircularProgress, Divider, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";

import biteImg from "../../assets/bite.png";
import corgiImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import clf365Img from "../../assets/clf365.png";
import CustomButton from "../Buttons/CustomButton";
import { formatCurrency, fromWei, toWei } from "../../utils/helper";
import { connect } from "react-redux";
import {
  confirmAllowance,
  getUserStakedData,
  getPoolInfo,
  unstakeTokens,
} from "../../actions/stakeActions";
import { getAccountBalance } from "../../actions/accountActions";
import {
  BITE,
  claimTokens,
  CFL365,
  etheriumNetwork,
  PWAR,
} from "../../constants";
import Loader from "../common/Loader";
import DotCircle from "../common/DotCircle";

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
}));

const Staking = ({
  stake: { stake, pool, approved },
  account: { currentAccount, currentNetwork, loading, error },
  tokenType,
  getUserStakedData,
  confirmAllowance,
  getPoolInfo,
  getAccountBalance,
  unstakeTokens,
  onStake,
  onUnstake,
}) => {
  const classes = useStyles();

  useEffect(async () => {
    getUserStakedData(tokenType, currentNetwork);
  }, [currentAccount, currentNetwork]);

  const handleApprove = async (tokenType) => {
    const tokenWeiAmountToApprove =
      currentNetwork === etheriumNetwork
        ? toWei("999999999")
        : "999999999999999999999999999999999999";

    await confirmAllowance(
      tokenWeiAmountToApprove,
      tokenType,
      currentNetwork,
      currentAccount
    );
    // alert(
    //   `tokenType: ${tokenType}  currentNetwork: ${currentNetwork} tokenAmount:  ${tokenWeiAmountToApprove}`
    // );
    await getUserStakedData(tokenType, currentNetwork);
  };

  const handleClaim = async (tokenType) => {
    const tokensToClaim = claimTokens;

    await unstakeTokens(
      tokensToClaim,
      currentAccount,
      tokenType,
      currentNetwork
    );
    await Promise.all([
      getPoolInfo(currentNetwork),
      getAccountBalance(currentNetwork),
    ]);
  };

  const currentAmount = (tokenType) => {
    return stake[tokenType] ? stake[tokenType].amount : 0;
  };

  const tokenLogo = {
    PBR: "img/symbol.png",
    BITE: biteImg,
    CORGIB: corgiImg,
    PWAR: pwarImg,
    CFL365: clf365Img,
  };

  const tokenName = {
    PBR: "PolkaBridge",
    BITE: "DragonBite",
    CORGIB: "Corgi Of PolkaBridge",
    PWAR: "PolkaWar",
    CFL365: "CFL 365",
  };
  const getCurrentApy = () => {
    if (tokenType === "PBR") {
      return pool[tokenType] ? pool[tokenType].pbrApy : "-";
    } else if (tokenType === "CORGIB") {
      return pool[tokenType] ? pool[tokenType].corgibApy : "-";
    } else if (tokenType === "BITE") {
      return pool[tokenType] ? pool[tokenType].biteApy : "0";
    } else if (tokenType === PWAR) {
      return pool[tokenType] ? pool[tokenType].pwarApy : "0";
    } else {
      return pool[tokenType] ? pool[tokenType].clf365Apy : "0";
    }
  };

  const getCurrencyFormatForToken = (tokenType, tokens) => {
    if (tokenType === BITE) {
      return formatCurrency(fromWei(tokens));
    } else if (tokenType === CFL365) {
      return formatCurrency(fromWei(tokens));
    } else {
      return formatCurrency(fromWei(tokens), false, 1, true);
    }
  };

  return (
    <Card elevation={10} className={classes.card}>
      {loading[tokenType] && (
        <div className="text-center">
          <Loader height={300} />
        </div>
      )}
      {!loading[tokenType] && (
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-center align-items-center py-2">
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
          <div style={{ minHeight: 120, paddingLeft: 10, paddingRight: 10 }}>
            {["PBR", "BITE", "PWAR", "CORGIB", CFL365].includes(tokenType) ? (
              <div className="mt-5">
                <div className="d-flex justify-content-between mt-1">
                  <div className="d-flex justify-content-start">
                    <div>
                      <div className={classes.tokenTitle}>APY</div>
                    </div>
                  </div>
                  <div className={classes.tokenAmount}>
                    {formatCurrency(getCurrentApy(), false, 1, true)} %
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="d-flex justify-content-start">
                    <div>
                      <div className={classes.tokenTitle}>Total Staked</div>
                    </div>
                  </div>
                  <div className={classes.tokenAmount}>
                    {" "}
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
                    {" "}
                    {formatCurrency(
                      fromWei(
                        pool[tokenType]
                          ? pool[tokenType].totalTokenClaimed
                          : "0"
                      ),
                      false,
                      1,
                      true
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <Divider style={{ backgroundColor: "#616161", height: 1 }} />
          <div className={classes.desktop}>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Staked</div>
              <div className={classes.tokenAmount}>
                {" "}
                {tokenType === "PWAR"
                  ? formatCurrency(
                      fromWei(stake[tokenType].amount),
                      false,
                      1,
                      true
                    )
                  : formatCurrency(fromWei(stake[tokenType].amount))}{" "}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Claimed</div>
              <div className={classes.tokenAmount}>
                {" "}
                {tokenType === "PWAR"
                  ? formatCurrency(
                      fromWei(stake[tokenType].rewardClaimed),
                      false,
                      1,
                      true
                    )
                  : formatCurrency(
                      fromWei(stake[tokenType].rewardClaimed)
                    )}{" "}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Pending</div>
              <div className={classes.tokenAmount}>
                {" "}
                {tokenType === "PWAR"
                  ? formatCurrency(
                      fromWei(stake[tokenType].pendingReward),
                      false,
                      1,
                      true
                    )
                  : formatCurrency(
                      fromWei(stake[tokenType].pendingReward)
                    )}{" "}
              </div>
            </div>
          </div>

          <div className={classes.buttons}>
            {!approved[tokenType] ? (
              <div className="text-center">
                <CustomButton onClick={() => handleApprove(tokenType)}>
                  Approve
                </CustomButton>
                <p className={classes.hint}>
                  <DotCircle />
                  <span style={{ paddingLeft: 5 }}>
                    Approve PBR tokens to start staking
                  </span>
                </p>
              </div>
            ) : (
              <div className={classes.stakeButtons}>
                <CustomButton
                  disabled={currentAmount(tokenType) == 0}
                  onClick={() => handleClaim(tokenType)}
                >
                  Claim
                </CustomButton>

                <CustomButton onClick={() => onStake(tokenType)}>
                  Stake
                </CustomButton>
                <CustomButton
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
})(Staking);
