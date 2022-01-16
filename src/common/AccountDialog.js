import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CustomButton from "../components/CustomButton";
import { FileCopy } from "@material-ui/icons";
import {
  BITE,
  CFL365,
  etheriumNetwork,
  GRAV,
  DEFLY,
  maticNetwork,
  PBR,
  PUN,
  SHOE,
  WELT,
  AOG,
  tokenName,
  tokenLogo,
  LABS,
  harmonyNetwork,
} from "../constants";

import { formatCurrency, fromWei } from "../utils/helper";
import { connect } from "react-redux";
import { logout } from "../actions/accountActions";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  background: {
    minWidth: 360,
    width: "100%",
    height: 450,
    backgroundColor: "#121827",
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",

    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      width: "100%",
      height: 450,
    },
  },
  heading: {
    fontSize: 20,
    fontWeight: 400,
    color: "#e5e5e5",
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  subheading: {
    fontSize: 14,
    fontWeight: 400,
    color: "#bdbdbd",
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
    },
  },
  inputGroup: {
    marginTop: 40,
  },

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#616161 !important",
  },
  inputText: {
    color: "#f8f8f8",
  },
  maxBtn: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    height: 50,
    borderRadius: 10,
    marginLeft: 20,
    color: "#f9f9f9",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
  },
  buttons: {
    // marginTop: 80,
    // marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 20,
    marginLeft: 15,
  },
  icon: {
    marginRight: 5,
    color: "#919191",
    display: "inline-block",
    // position: "relative",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
  },
  logoWrapper: {
    height: 35,
    width: 35,
    backgroundColor: "#ffffff",
    border: "1px solid #bdbdbd",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 20,
    width: 20,
  },
  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
    color: "#e5e5e5",
  },
  tokenSubtitle: {
    fontWeight: 300,
    padding: 0,
    paddingLeft: 10,
    fontSize: 10,
    color: "#bdbdbd",
  },
  tokenAmount: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 16,
    color: "#f9f9f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  copyIcon: {
    fontSize: 18,
    marginLeft: 10,
    color: "#dcedc8",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
}));

const AccountDialog = ({
  open,
  handleClose,
  handleLogout,
  account: { currentAccount, balance, currentNetwork },
}) => {
  const classes = useStyles();
  const onSingOut = () => {
    localStorage.setItem(`logout${currentAccount}`, currentAccount);
    handleLogout();
    handleClose();
  };

  const getCoins = () => {
    if (currentNetwork === etheriumNetwork) {
      return [
        { coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) },
        { coin: LABS, balance: formatCurrency(fromWei(balance[LABS])) },
        // { coin: PUN, balance: formatCurrency(fromWei(balance[PUN])) },
        // { coin: SHOE, balance: formatCurrency(fromWei(balance[SHOE])) },
        // { coin: BITE, balance: formatCurrency(fromWei(balance[BITE])) },
        // { coin: CFL365, balance: formatCurrency(fromWei(balance[CFL365])) },
      ];
    } else if (currentNetwork === maticNetwork) {
      return [
        { coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) },
        { coin: WELT, balance: formatCurrency(fromWei(balance[WELT])) },
      ];
    } else if (currentNetwork === harmonyNetwork) {
      return [{ coin: PBR, balance: formatCurrency(fromWei(balance[PBR])) }];
    } else {
      return [
        {
          coin: "CORGIB",
          balance: formatCurrency(fromWei(balance["CORGIB"])),
        },
        {
          coin: "PWAR",
          balance: formatCurrency(fromWei(balance["PWAR"]), false, 1, true),
        },
        {
          coin: GRAV,
          balance: formatCurrency(fromWei(balance?.GRAV), false, 1, true),
        },
        {
          coin: DEFLY,
          balance: formatCurrency(fromWei(balance?.DEFLY), false, 1, true),
        },
        {
          coin: AOG,
          balance: formatCurrency(fromWei(balance?.AOG), false, 1, true),
        },
      ];
    }
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        disableBackdropClick
        className={classes.dialog}
        color="green"
        PaperProps={{
          style: { borderRadius: 25, backgroundColor: "#121827" },
        }}
      >
        <Card elevation={10} className={classes.background}>
          <div style={{ width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div style={{ width: 40 }}></div>
              <div className={classes.heading}>My Wallet</div>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon style={{ color: "#919191" }} />
              </IconButton>
            </div>
            <div
              style={{ paddingLeft: 10, paddingRight: 10, textAlign: "center" }}
            >
              <h6 htmlFor="username" className={classes.subheading}>
                {[...currentAccount].splice(0, 7)} {"..."}
                {[...currentAccount].splice([...currentAccount].length - 7, 7)}
                <IconButton style={{ padding: 0 }}>
                  {" "}
                  <FileCopy
                    className={classes.copyIcon}
                    onClick={() =>
                      navigator.clipboard.writeText(currentAccount)
                    }
                  />
                </IconButton>
              </h6>
            </div>
          </div>

          <div style={{ width: "100%", paddingLeft: 20, paddingRight: 20 }}>
            {getCoins().map(function (coinObj, index) {
              return (
                <div className="d-flex justify-content-between mt-4">
                  <div className="d-flex justify-content-start">
                    <div className={classes.logoWrapper}>
                      <img
                        src={tokenLogo?.[coinObj.coin]}
                        className={classes.logo}
                      />
                    </div>
                    <div>
                      <div className={classes.tokenTitle}>{coinObj.coin}</div>
                      <div className={classes.tokenSubtitle}>
                        {tokenName?.[coinObj.coin]}
                      </div>
                    </div>
                  </div>
                  <div className={classes.tokenAmount}>{coinObj.balance}</div>
                </div>
              );
            })}
          </div>
          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton onClick={onSingOut}>Sign out</CustomButton>
          </div>
        </Card>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(AccountDialog);
