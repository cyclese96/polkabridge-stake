import { makeStyles } from "@material-ui/core";
import supply from "../../assets/supply.png";

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
    fontWeight:400
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

const Balance = () => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          <p className={classes.cardHeading}>Balance</p>
          <img className={classes.avatar} src={supply} />
          <h4 className={classes.numbers}>150,000 $PBR</h4>
        </div>
      </div>
    </div>
  );
};

export default Balance;
