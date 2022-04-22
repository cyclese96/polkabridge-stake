import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CustomButton from "../components/CustomButton";
import { FileCopy } from "@material-ui/icons";
import {
  tokenName,
  tokenLogo,
  supportedStaking,
  CORGIB,
  tokenAddresses,
} from "../constants";
import { formatCurrency, fromWei } from "../utils/helper";
import { connect } from "react-redux";
import { logout } from "../actions/accountActions";
import { Card } from "@material-ui/core";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useCurrencyBalances } from "../hooks/useBalance";

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
  buttons: {},
  numbers: {
    color: "#E0077D",
    fontSize: 20,
    marginLeft: 15,
  },
  icon: {
    marginRight: 5,
    color: "#919191",
    display: "inline-block",
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
  singleWalletCard: {
    marginBottom: 20,
    padding: "10px 20px 10px 20px",
    width: "100%",
    backgroundColor: "#161c2b",
    border: "1px solid #282b33",
    borderRadius: 10,
    cursor: "pointer",
  },
}));

const AccountDialog = ({
  open,
  handleClose,
  handleLogout,
  handleConnection,
}) => {
  const classes = useStyles();

  const { active, chainId, account } = useActiveWeb3React();

  const onSingOut = () => {
    localStorage.setItem(`logout${account}`, account);
    handleLogout();
    handleClose();
  };

  const tokens = useMemo(() => {
    return supportedStaking?.[chainId]?.map((_symbol) => {
      return { symbol: _symbol, address: tokenAddresses?.[_symbol]?.[chainId] };
    });
  }, [chainId]);
  const balances = useCurrencyBalances(account, tokens);

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
        {active && (
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
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  textAlign: "center",
                }}
              >
                <h6 htmlFor="username" className={classes.subheading}>
                  {[...account].splice(0, 7)} {"..."}
                  {[...account].splice([...account].length - 7, 7)}
                  <IconButton style={{ padding: 0 }}>
                    {" "}
                    <FileCopy
                      className={classes.copyIcon}
                      onClick={() => navigator.clipboard.writeText(account)}
                    />
                  </IconButton>
                </h6>
              </div>
            </div>

            <div style={{ width: "100%", paddingLeft: 20, paddingRight: 20 }}>
              {tokens?.map(function (token, index) {
                return (
                  <div className="d-flex justify-content-between mt-4">
                    <div className="d-flex justify-content-start">
                      <div className={classes.logoWrapper}>
                        <img
                          src={tokenLogo?.[token?.symbol]}
                          className={classes.logo}
                        />
                      </div>
                      <div>
                        <div className={classes.tokenTitle}>
                          {token?.symbol}
                        </div>
                        <div className={classes.tokenSubtitle}>
                          {tokenName?.[token?.symbol]}
                        </div>
                      </div>
                    </div>
                    <div className={classes.tokenAmount}>
                      {token?.symbol === CORGIB
                        ? formatCurrency(fromWei(balances?.[index]))
                        : formatCurrency(
                            fromWei(balances?.[index]),
                            false,
                            1,
                            true
                          )}
                    </div>
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
        )}
        {!active && (
          <Card elevation={10} className={classes.background}>
            <div style={{ width: "100%" }}>
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ width: 40 }}></div>
                <div className={classes.heading}>Connect You Wallet</div>
                <IconButton aria-label="close" onClick={handleClose}>
                  <CloseIcon style={{ color: "#919191" }} />
                </IconButton>
              </div>

              <div style={{ width: "100%", paddingLeft: 20, paddingRight: 20 }}>
                <div className="mt-4">
                  <div
                    className={classes.singleWalletCard}
                    onClick={() => handleConnection("injected")}
                  >
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

                  <div
                    className={classes.singleWalletCard}
                    onClick={() => handleConnection("unstoppable")}
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <div className={classes.logoWrapper}>
                        <img
                          src={
                            "https://avatars.githubusercontent.com/u/36172275?s=280&v=4"
                          }
                          className={classes.logo}
                        />
                      </div>
                      <div className={classes.tokenTitle}>
                        Unstoppable Domains
                      </div>
                    </div>
                  </div>

                  <div
                    className={classes.singleWalletCard}
                    onClick={() => handleConnection("walletConnect")}
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <div className={classes.logoWrapper}>
                        <img src="img/wc.png" className={classes.logo} />
                      </div>
                      <div className={classes.tokenTitle}>Walletconnect</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={classes.buttons}>
              <CustomButton variant="light" onClick={handleClose}>
                Cancel
              </CustomButton>
            </div>
          </Card>
        )}
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, { logout })(AccountDialog);
