import { CircularProgress, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import pbrImg from "../../assets/balance.png";
import biteImg from "../../assets/bite.png";
import CustomButton from "../Buttons/CustomButton";
import { formatCurrency, fromWei, toWei } from "../../actions/helper";
import { connect } from "react-redux";
import {
  confirmAllowance,
  getUserStakedData,
  stakeTokens,
  unstakeTokens,
} from "../../actions/stakeActions";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 370,
    height: 260,
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
      height: 230,
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
    marginTop: 30,
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
}));

const Staking = ({
  stake: { stakeData, approved },
  account: { loading },
  tokenType,
  getUserStakedData,
  confirmAllowance,
  onStake,
  onUnstake,
}) => {
  const classes = useStyles();

  useEffect(async () => {
    if (tokenType === "PBR") {
      await getUserStakedData();
    }
  }, []);

  const handleApprove = () => confirmAllowance(toWei("999999999"));

  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          {loading ? (
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

              {tokenType == "PBR" ? (
                <>
                  <p className={classes.cardText}>
                    <strong>Staked: </strong>{" "}
                    {formatCurrency(fromWei(stakeData.amount))} {tokenType}
                  </p>
                  <p className={classes.cardText}>
                    <strong>Claimed rewards: </strong>{" "}
                    {formatCurrency(fromWei(stakeData.rewardClaimed))}{" "}
                    {tokenType}
                  </p>
                  <p className={classes.cardText}>
                    <strong>Pending rewards: </strong>{" "}
                    {formatCurrency(fromWei(stakeData.pendingReward))}{" "}
                    {tokenType}
                  </p>
                </>
              ) : (
                ""
              )}

              {tokenType === "PBR" ? (
                <div className={classes.buttons}>
                  {!approved === true ? (
                    <div>
                      <CustomButton onClick={handleApprove}>
                        Approve
                      </CustomButton>
                      <p className={classes.hint}>
                        ! Approve PBR tokens to start staking
                      </p>
                    </div>
                  ) : (
                    <>
                      <CustomButton onClick={onUnstake} variant="light">
                        Unstake
                      </CustomButton>
                      <CustomButton onClick={onStake}>Stake</CustomButton>
                    </>
                  )}
                </div>
              ) : (
                <div className={classes.buttons}>
                  {true ? (
                    <div>
                      <CustomButton onClick={() => {}}>
                        Coming soon
                      </CustomButton>
                      <p className={classes.hint}>
                        ! BITE tokens will available soon to stake
                      </p>
                    </div>
                  ) : (
                    <>
                      <CustomButton onClick={onUnstake} variant="light">
                        Unstake
                      </CustomButton>
                      <CustomButton onClick={onStake}>Stake</CustomButton>
                    </>
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
