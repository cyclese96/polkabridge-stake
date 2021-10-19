import { CircularProgress, makeStyles } from "@material-ui/core";
import supply from "../../assets/supply.png";
import { fromWei, formatCurrency } from "../../utils/helper";
import biteImg from "../../assets/bite.png";
import corgibImg from "../../assets/corgi.png";
import clf365Img from "../../assets/clf365.png";
import pwarImg from "../../assets/pwar.png";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 400,
    height: 300,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.5)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
      height: 280,
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
    paddingTop: 8,
  },
  avatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 60,
  },
  avatar_corgib: {
    zIndex: 2,
    // position: "relative",
    width: "auto",
    height: 160,
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: 400,
    padding: 0,
    margin: 0,
    marginTop: 10,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
}));

const Balance = ({ account: { balance, loading }, tokenType }) => {
  const classes = useStyles();

  const tokenLogo = {
    PBR: supply,
    BITE: biteImg,
    CORGIB: corgibImg,
    PWAR: pwarImg,
    CFL365: clf365Img,
    SHOE: 'img/shoefy.png'
  };

  return (
    <div className={classes.card}>
      <div className={classes.cardContents}>
        {loading[tokenType] ? (
          <CircularProgress className={classes.numbers} />
        ) : (
          <>
            <p className={classes.cardHeading}>Balance</p>
            <img
              className={
                tokenType === "CORGIB" ? classes.avatar_corgib : classes.avatar
              }
              src={tokenLogo[tokenType]}
            />
            <h4 className={classes.numbers}>
              {tokenType === "PWAR"
                ? formatCurrency(fromWei(balance[tokenType]), false, 1, true)
                : formatCurrency(fromWei(balance[tokenType]))}
              <span style={{ marginLeft: 10 }}>{tokenType}</span>
            </h4>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(Balance);
