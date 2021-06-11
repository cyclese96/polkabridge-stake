import { CircularProgress, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import pbrImg from "../../assets/balance.png";
import biteImg from "../../assets/bite.png";
import CustomButton from "../Buttons/CustomButton";
import { formatCurrency, fromWei, toWei } from "../../utils/helper";
import { connect } from "react-redux";
import {
  confirmAllowance,
  getUserStakedData,
} from "../../actions/stakeActions";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    height: 300,
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
      height: 320,
    },
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },
  avatar: {
    // position: "relative",
    width: 20,
    height: "auto",
    // justifySelf: "start",
    marginLeft: 60,
  },
  cardHeading: {
    fontSize: 18,
    // alignSelf: "center",
    // justifySelf: "center",
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
    fontSize: 10,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  bitePool: {
    marginBottom: 20,
    alignSelf: 'start',
  },
  poolItemText: {
    fontSize: 12,
    marginLeft: 60,
    margin: 0,
  },
  stakeButtons: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap-reverse' },
  stakeButton: {
    marginTop: 5,
    alignSelf: 'center',
    justifySelf: 'center'
  }
}));

const Staking = ({
  stake: { pbrStake, biteStake, bitePoolData, pbrApproved, biteApproved },
  account: { currentAccount, loading, biteLoading, pbrLoading, error },
  tokenType,
  getUserStakedData,
  confirmAllowance,
  onStake,
  onUnstake,
  onClaim
}) => {
  const classes = useStyles();

  useEffect(async () => {

    getUserStakedData(tokenType)

  }, [currentAccount]);

  const handleApprove = async (tokenType) => {
    await confirmAllowance(toWei("999999999"), tokenType);
    await getUserStakedData(tokenType);
  };

  const currentStake = () => {
    return tokenType === 'PBR' ? pbrStake : biteStake
  }
  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          {(tokenType === 'PBR' ? pbrLoading : biteLoading) ? (
            <div>
              <CircularProgress className={classes.numbers} />
            </div>
          ) : (
            <>
              <div className={classes.cardHeader}>
                <img
                  className={classes.avatar}
                  src={tokenType === "BITE" ? biteImg : pbrImg}
                />
                <small
                  style={{
                    color: "#f9f9f9",
                    marginTop: 8,
                    marginLeft: 5,
                    marginRight: 22,
                  }}
                >
                  {tokenType}
                </small>
                <h6 className={classes.cardHeading}>Staking Pool</h6>
              </div>

              {tokenType === 'BITE' ? (
                <div className={classes.bitePool}>
                  <p className={classes.poolItemText}>
                    <strong>BITE APY: </strong>{" "}
                    {formatCurrency(bitePoolData.biteApy)} %
                  </p>
                  <p className={classes.poolItemText}>
                    <strong>Total token staked: </strong>{" "}
                    {formatCurrency(fromWei(bitePoolData.totalTokenStaked))} {tokenType}
                  </p>
                </div>
              ) : ""}

              <>
                <p className={classes.cardText}>
                  <strong>Staked: </strong>{" "}
                  {formatCurrency(fromWei(currentStake().amount))} {tokenType}
                </p>
                <p className={classes.cardText}>
                  <strong>Claimed rewards: </strong>{" "}
                  {formatCurrency(fromWei(currentStake().rewardClaimed))}{" "}
                  {tokenType}
                </p>
                <p className={classes.cardText}>
                  <strong>Pending rewards: </strong>{" "}
                  {formatCurrency(fromWei(currentStake().pendingReward))}{" "}
                  {tokenType}
                </p>
              </>


              {tokenType === "PBR" ? (
                <div className={classes.buttons}>
                  {!pbrApproved === true ? (
                    <div>
                      <CustomButton onClick={() => handleApprove('PBR')}>
                        Approve
                      </CustomButton>
                      <p className={classes.hint}>
                        ! Approve PBR tokens to start staking
                      </p>
                    </div>
                  ) : (
                    <div className={classes.stakeButtons}>
                      <CustomButton disabled={pbrStake.amount == 0} onClick={() => onClaim('PBR')} >
                        Claim
                      </CustomButton>
                      <CustomButton onClick={() => onUnstake('PBR')} variant="light">
                        Unstake
                      </CustomButton>
                      <CustomButton onClick={() => onStake('PBR')}>Stake</CustomButton>
                    </div>
                  )}
                </div>
              ) : (
                <div className={classes.buttons}>
                  {!biteApproved === true ? (
                    <div>
                      <CustomButton onClick={() => handleApprove('BITE')}>
                        Approve
                      </CustomButton>
                      <p className={classes.hint}>
                        ! Approve BITE tokens to start staking
                      </p>
                    </div>
                  ) : (
                    <div className={classes.stakeButtons}>
                      <CustomButton onClick={() => onClaim('BITE')} >
                        Claim
                      </CustomButton>
                      <CustomButton onClick={() => onUnstake('BITE')} variant="light">
                        Unstake
                      </CustomButton>
                      <CustomButton onClick={() => onStake('BITE')}>Stake</CustomButton>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  stake: state.stake,
  account: state.account,
});

export default connect(mapStateToProps, {
  getUserStakedData,
  confirmAllowance,
})(Staking);
