import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, TextField } from "@material-ui/core";
import CustomButton from "../Buttons/CustomButton";
import {
  formatCurrency,
  fromWei,
  isNumber,
  resetCurrencyFormatting,
} from "../../utils/helper";
import { connect } from "react-redux";
import {
  getPoolInfo,
  stakeTokens,
  unstakeTokens,
} from "../../actions/stakeActions";
import { getAccountBalance } from "../../actions/accountActions";
import { minimumStakingAmount } from "../../constants";
import BigNumber from "bignumber.js";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#121827",
    color: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 380,
    minHeight: 350,
    [theme.breakpoints.down("sm")]: {
      width: 320,
      height: 350,
    },
  },
  heading: {
    fontSize: 24,
    fontWeight: 400,
    color: "#919191",
  },
  subheading: {
    fontSize: 18,
    fontWeight: 400,
    color: "#919191",
  },
  inputGroup: {
    display:'flex',
    justifyContent:'space-between',
    marginTop: 20,
    border:'1px solid #454545',
    borderRadius:15
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 5,
    height: 50,
    border: "none",
    fontSize: 18,
    width: "70%",
    color: "white",
    padding: 10,
    outline: "none",
    [theme.breakpoints.down("sm")]: {
      height: 50,
      fontSize: 15,
    },
  },
  cssInputLabel: {
    color: "#616161",
  },
  cssInputFocused: {},
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `#616161 !important`,
    },
  },
  cssFocused: {
    color: "#f1f1f1",
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#616161 !important",
  },
  inputText: {
    color: "#f8f8f8",
  },
  maxBtn: {
    background: `linear-gradient(to bottom,#D9047C, #BF1088)`,
    padding:0,
    padding:'3px 5px 3px 5px',
    fontSize:12,
    borderRadius: 15,
    marginLeft: 10,
    color: "#f9f9f9",
    [theme.breakpoints.down("sm")]: {
      height: 30,
     marginTop:10,
     marginRight:5
    },
    
  },
  buttons: {
    marginTop: 30,
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      marginBottom: 5,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  error: {
    alignSelf: "center",
    justifySelf: "center",
    paddingTop: 20,
  },
}));

const StakeDialog = ({
  account: { currentAccount, currentNetwork, balance, loading },
  stake: { stake },
  stakeTokens,
  unstakeTokens,
  getAccountBalance,
  getPoolInfo,
  open,
  handleClose,
  type,
  tokenType,
}) => {
  const classes = useStyles();
  const [inputTokens, setTokenValue] = useState("");
  const [formattedInputTokens, setFormattedValue] = useState("");
  const [error, setError] = useState({ status: false, message: "" });

  const handleInputChange = (e) => {
    if (
      !isNumber(e.nativeEvent.data) &&
      e.nativeEvent.inputType !== "deleteContentBackward"
    ) {
      setError({ status: true, message: "Please enter numbers only!" });
      return;
    }
    setTokenValue(resetCurrencyFormatting(e.target.value));

    if (error.status) {
      setError({ status: false, message: "" });
    }
  };

  const onConfirm = async () => {
    let enteredTokens = inputTokens;
    const stakedTokens = parseFloat(fromWei(stake[tokenType].amount));
    const balanceTokens = parseFloat(fromWei(balance[tokenType]));

    if (enteredTokens === "" || new BigNumber(enteredTokens).eq(0)) {
      setError({
        status: true,
        message: `Please enter some ${tokenType} to ${type} !`,
      });
      return;
    }

    if (type !== "stake" && enteredTokens > stakedTokens) {
      setError({
        status: true,
        message: `Maximum withdraw amount can not exceed ${formatCurrency(
          stakedTokens
        )} !`,
      });
      return;
    }

    if (type === "stake" && enteredTokens < minimumStakingAmount[tokenType]) {
      setError({
        status: true,
        message: `Minimum ${formatCurrency(
          minimumStakingAmount[tokenType]
        )} ${tokenType} required to stake!`,
      });
      return;
    }

    if (type === "stake" && enteredTokens > balanceTokens) {
      setError({
        status: true,
        message: `Can not stake more that ${formatCurrency(
          balanceTokens
        )} ${tokenType}!`,
      });
      return;
    }

    setError({});

    if (type === "stake") {
      // console.log('staking tokens', { inputTokens, currentAccount, tokenType, currentNetwork })

      if (
        parseFloat(enteredTokens) === parseFloat(fromWei(balance[tokenType]))
      ) {
        // console.log("max ");
        enteredTokens -= 1;
      }

      // console.log({
      //   entered: enteredTokens,
      //   input: inputTokens,
      //   bal: parseFloat(fromWei(balance[tokenType])),
      // });
      await stakeTokens(
        enteredTokens.toString(),
        currentAccount,
        tokenType,
        currentNetwork
      );
    } else {
      await unstakeTokens(
        inputTokens,
        currentAccount,
        tokenType,
        currentNetwork
      );
    }
    handleClose();
    getPoolInfo(currentNetwork);
    getAccountBalance(currentNetwork);
  };

  const handleMax = () => {
    if (type === "stake") {
      setTokenValue(fromWei(balance[tokenType]));
    } else {
      setTokenValue(fromWei(stake[tokenType].amount));
    }
  };

  const onClose = () => {
    handleClose();
    setTokenValue("");
    setError({});
  };

  // const currentBalance = () => {
  //   // if (tokenType === 'PBR') {
  //   //   return fromWei(pbrBalance)
  //   // } else if (tokenType === 'BITE') {
  //   //   return fromWei(biteBalance)
  //   // } else {
  //   //   return fromWei(corgibBalance)
  //   // }
  //   return balance[tokenType]
  // }

  // const currentStakedAmount = () => {

  //   return stake[tokenType].amount
  // }
  const currentFormattedBalance = () => {
    if (tokenType === "PWAR") {
      return formatCurrency(fromWei(balance[tokenType]), false, 1, true);
    }

    return formatCurrency(fromWei(balance[tokenType]));
  };

  const currentFormattedStakedBal = () => {
    if (tokenType === "PWAR") {
      return formatCurrency(
        fromWei(stake[tokenType] ? stake[tokenType].amount : 0),
        false,
        1,
        true
      );
    }

    return formatCurrency(
      fromWei(stake[tokenType] ? stake[tokenType].amount : 0)
    );
  };
  return (
    <div>
      <Dialog
        // onClose={onClose}
        onExited={onClose}
        open={open}
        disableBackdropClick
        className={classes.dialog}
        color="transparent"
        disableRestoreFocus={true}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <div className={classes.background}>
          <DialogTitle onClose={handleClose}>
            <span className={classes.heading}>
              {type === "stake" ? "Stake tokens" : "Withdraw tokens"}
            </span>
          </DialogTitle>

          <p className={classes.subheading}>
            {type === "stake"
              ? `Available tokens: ${currentFormattedBalance()}  ${tokenType}`
              : `Staked tokens: ${currentFormattedStakedBal()} ${tokenType}`}
          </p>
          <div className={classes.inputGroup}>
            <input  placeholder="0"
              value={
                inputTokens ? formatCurrency(inputTokens, false, 0, true) : ""
              }
              // name={[pbrTokens]}
              onChange={handleInputChange}
              label={`Enter ${tokenType} tokens`}
              
              className={classes.input}/>
            {/* <TextField
              InputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                classes: {
                  root: classes.cssInputLabel,
                  focused: classes.cssInputFocused,
                },
              }}
              className={classes.input}
              id="outlined-basic"
              variant="outlined"
             
              focused={true}
            /> */}
            <Button className={classes.maxBtn} onClick={handleMax}>
              Max
            </Button>
          </div>
          {error.status ? (
            <span className={classes.error}>{error.message}</span>
          ) : (
            ""
          )}
          <div className={classes.buttons}>
            {loading[tokenType] ? (
              <CircularProgress className={classes.numbers} />
            ) : (
              <>
                <CustomButton variant="light" onClick={onClose}>
                  Cancel
                </CustomButton>
                <CustomButton onClick={onConfirm}>
                  Confirm
                </CustomButton>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  stake: state.stake,
  account: state.account,
});

export default connect(mapStateToProps, {
  stakeTokens,
  unstakeTokens,
  getAccountBalance,
  getPoolInfo,
})(StakeDialog);
