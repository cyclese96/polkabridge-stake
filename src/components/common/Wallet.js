import { Button, makeStyles } from "@material-ui/core";
import { AccountBalanceWalletOutlined } from "@material-ui/icons";
import etherIcon from "../../assets/ether.png";
import binanceIcon from "../../assets/binance.png";
import { connect } from "react-redux";
import { isMetaMaskInstalled } from "../../utils/helper";
import { etheriumNetwork } from "../../constants";
import { connectWallet } from "../../actions/accountActions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    border: "0.5px solid white",
    borderRadius: 15,
    padding: 2,
    paddingLeft: 10,
    paddingRight: 10,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 5,
      paddingRight: 15,
    },
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
    fontSize: 12,
  },
  networkIcon: {
    width: 25,
    marginRight: 5,
    height: "auto",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const Wallet = ({
  connectWallet,
  onWalletClick,
  account: { connected, currentNetwork, currentAccount },
}) => {
  const classes = useStyles();

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert("Please install Meta Mask to connect");
      return;
    }
    await connectWallet(true, currentNetwork);
  };

  return (
    <div>
      {!connected ? (
        <Button onClick={handleConnectWallet} className={classes.navbarButton}>
          Unlock Wallet
        </Button>
      ) : (
        <a onClick={onWalletClick} className={classes.root}>
          <img
            className={classes.networkIcon}
            src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
            alt={currentNetwork}
          />
          <strong className={classes.numbers}>
            {currentAccount ? currentAccount.toString().slice(0, 6) : "."}..
          </strong>
          <AccountBalanceWalletOutlined
            style={{ color: "#f9f9f9" }}
            fontSize="large"
          />
        </a>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { connectWallet })(Wallet);
