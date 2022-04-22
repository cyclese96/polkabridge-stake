import React, { useMemo, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { CircularProgress } from "@material-ui/core";
import CustomButton from "./../components/CustomButton";
import {
  formatCurrency,
  fromWei,
  isNumber,
  resetCurrencyFormatting,
} from "../utils/helper";
import { minimumStakingAmount, poolId, tokenAddresses } from "../constants";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useTokenBalance } from "../hooks/useBalance";
import { useUserStakedInfo } from "../hooks/useUserStakedInfo";

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
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    border: "1px solid #454545",
    borderRadius: 15,
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
    padding: 0,
    padding: "3px 5px 3px 5px",
    fontSize: 12,
    borderRadius: 15,
    marginLeft: 10,
    color: "#f9f9f9",
    [theme.breakpoints.down("sm")]: {
      height: 30,
      marginTop: 10,
      marginRight: 5,
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
  open,
  handleClose,
  type,
  tokenType,
  stakeTokens,
  unstakeTokens,
  transactionStatus,
}) => {
  const classes = useStyles();
  const [inputTokens, setTokenValue] = useState("");
  // const [formattedInputTokens, setFormattedValue] = useState("");
  const [error, setError] = useState({ status: false, message: "" });
  const { account, chainId } = useActiveWeb3React();

  const poolToken = useMemo(() => {
    return {
      symbol: tokenType,
      address: tokenAddresses?.[tokenType]?.[chainId],
    };
  }, [tokenType, chainId]);

  const userStakedInfo = useUserStakedInfo(poolId?.[tokenType], account);

  const poolTokenBalance = useTokenBalance(account, poolToken);

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
    const stakedTokens = fromWei(userStakedInfo?.staked)?.toString();
    const balanceTokens = fromWei(poolTokenBalance)?.toString();

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
      if (parseFloat(enteredTokens) === parseFloat(fromWei(balanceTokens))) {
        enteredTokens -= 1;
      }

      await stakeTokens(enteredTokens.toString(), poolId?.[tokenType]);
    } else {
      await unstakeTokens(enteredTokens?.toString(), poolId?.[tokenType]);
    }
    handleClose();
  };

  const handleMax = () => {
    if (type === "stake") {
      setTokenValue(fromWei(poolTokenBalance));
    } else {
      setTokenValue(fromWei(userStakedInfo?.staked));
    }
  };

  const onClose = () => {
    handleClose();
    setTokenValue("");
    setError({});
  };

  const currentFormattedBalance = () => {
    if (tokenType === "PWAR") {
      return formatCurrency(fromWei(poolTokenBalance), false, 1, true);
    }

    return formatCurrency(fromWei(poolTokenBalance));
  };

  const currentFormattedStakedBal = () => {
    if (tokenType === "PWAR") {
      return formatCurrency(fromWei(userStakedInfo?.staked), false, 1, true);
    }

    return formatCurrency(fromWei(userStakedInfo?.staked));
  };
  return (
    <div>
      <Dialog
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
            <input
              placeholder="0"
              value={
                inputTokens ? formatCurrency(inputTokens, false, 0, true) : ""
              }
              onChange={handleInputChange}
              label={`Enter ${tokenType} tokens`}
              className={classes.input}
            />

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
            {transactionStatus?.status &&
            transactionStatus?.status === "waiting" ? (
              <div className="text-center">
                <CircularProgress className={classes.numbers} />
                <p className={classes.subheading}>Waiting for confirmation</p>
              </div>
            ) : (
              <>
                <CustomButton variant="light" onClick={onClose}>
                  Cancel
                </CustomButton>
                <CustomButton onClick={onConfirm}>Confirm</CustomButton>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default StakeDialog;
