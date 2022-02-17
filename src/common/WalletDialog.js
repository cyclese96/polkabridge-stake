import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CustomButton from "../components/CustomButton";
import { FileCopy } from "@material-ui/icons";
import {
  BITE,
  CFL365,
  etheriumNetwork,
  maticNetwork,
  PBR,
  PUN,
  SHOE,
} from "../constants";
import biteImg from "../assets/bite.png";
import corgibImg from "../assets/corgi.png";
import clf365Img from "../assets/clf365.png";
import pwarImg from "../assets/pwar.png";
import puntImg from "../assets/punt.png";

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
  singleWalletCard: {
    marginBottom: 20,
    padding: "10px 20px 10px 20px",
    width: "100%",
    backgroundColor: "#161c2b",
    border: "1px solid #282b33",
    borderRadius: 10,
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
    height: 40,
    width: 40,
    backgroundColor: "#212121",
    border: "1px solid #212121",
    borderRadius: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 38,
    width: 38,
    borderRadius: "10%",
  },
  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 15,
    fontSize: 18,
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

const WalletDialog = () => {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        onClose={null}
        open={true}
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
              <div className={classes.heading}>Connect You Wallet</div>
              <IconButton aria-label="close" onClick={null}>
                <CloseIcon style={{ color: "#919191", marginRight: 10 }} />
              </IconButton>
            </div>
          </div>

          <div style={{ width: "100%", paddingLeft: 20, paddingRight: 20 }}>
            <div className="mt-4">
              <div className={classes.singleWalletCard}>
                <div className="d-flex justify-content-start align-items-center">
                  <div className={classes.logoWrapper}>
                    <img
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"
                      }
                      className={classes.logo}
                    />
                  </div>
                  <div className={classes.tokenTitle}>Metamask</div>
                </div>
              </div>
              <div className={classes.singleWalletCard}>
                <div className="d-flex justify-content-start align-items-center">
                  <div className={classes.logoWrapper}>
                    <img
                      src={
                        "https://avatars.githubusercontent.com/u/36172275?s=280&v=4"
                      }
                      className={classes.logo}
                    />
                  </div>
                  <div className={classes.tokenTitle}>Unstoppable Domains</div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.buttons}>
            <CustomButton variant="light">Cancel</CustomButton>
          </div>
        </Card>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(WalletDialog);
