import { CircularProgress, makeStyles } from "@material-ui/core";
import bal from "../../assets/balance.png";
import CustomButton from "../Buttons/CustomButton";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 370,
    height: 260,
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 350,
      height: 240,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
  },
  avatar: {
    position: "relative",
    width: 25,
    height: "auto",
    alignSelf: "start",
    marginLeft: 60,
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
    marginTop: 30,
    marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
}));

const Staking = ({ onStake, onUnstake, stakeData }) => {
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          {!stakeData.amount ? (
            <div>
              <CircularProgress className={classes.numbers} />
            </div>
          ) : (
            <>
              <p className={classes.cardHeading}>Staking Pool</p>
              <img className={classes.avatar} src={bal} />
              <p className={classes.cardText}>
                <strong>Staked: </strong> {stakeData.amount} PBR
              </p>
              <p className={classes.cardText}>
                <strong>Claimed rewards: </strong> {stakeData.rewardClaimed} PBR
              </p>
              <p className={classes.cardText}>
                <strong>Pending rewards: </strong> {stakeData.rewardDebt} PBR
              </p>
              {/* <p className={classes.cardText}>
            <strong>Earning rate: </strong> 28 $PBR / hour
          </p> */}
              <div className={classes.buttons}>
                <CustomButton onClick={onUnstake} variant="light">
                  Unstake
                </CustomButton>
                <CustomButton onClick={onStake}>Stake</CustomButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staking;
