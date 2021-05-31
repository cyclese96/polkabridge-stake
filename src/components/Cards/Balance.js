import { CircularProgress, makeStyles } from "@material-ui/core";
import supply from "../../assets/supply.png";
import { fromWei, formatCurrency } from "../../actions/helper";
// import pbrImg from "../../assets/balance.png";
import biteImg from "../../assets/bite.png";

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
      height: 220,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
    paddingTop: 8,
  },
  avatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 60,
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: 400,
  },
  cardText: {
    fontSize: 16,
    margin: 0,
    paddingTop: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
}));

const Balance = ({ balance, loading, tokenType }) => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          {loading ? (
            <CircularProgress className={classes.numbers} />
          ) : (
            <>
              <p className={classes.cardHeading}>Balance</p>
              <img
                className={classes.avatar}
                src={tokenType == "PBR" ? supply : biteImg}
              />
              <h4 className={classes.numbers}>
                {formatCurrency(fromWei(balance))} {tokenType}
              </h4>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balance;
