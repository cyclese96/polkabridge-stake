import { Button, makeStyles } from "@material-ui/core";
import { AccountBalanceWalletOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
  navbarButton: {
    backgroundColor: "#f9f9f9",
    color: "#C80C81",
    borderRadius: 10,
    height: 35,
    marginRight: 40,
    padding: 15,
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginLeft: 15,
      width: 150,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 18,
  },
}));

const Wallet = ({ account, amount, onClick }) => {
  const classes = useStyles();
  return (
    <div>
      {!amount ? (
        <Button onClick={onClick} className={classes.navbarButton}>
          Unlock Wallet
        </Button>
      ) : (
        <a href="#" className={classes.root}>
          <strong className={classes.numbers}>{amount} PBR</strong>
          <AccountBalanceWalletOutlined
            style={{ color: "#f9f9f9" }}
            fontSize="large"
          />
        </a>
      )}
    </div>
  );
};

export default Wallet;
