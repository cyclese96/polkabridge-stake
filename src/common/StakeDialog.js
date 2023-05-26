import React, { useEffect, useMemo, useState } from "react";
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
  formatLargeNumber,
  fromWei,
  isNumber,
  resetCurrencyFormatting,
  toWei,
} from "../utils/helper";
import {
  AIBB,
  minimumStakingAmount,
  minimumUnstakeAmount,
  tokenAddresses,
} from "../constants";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useStakeCallback } from "hooks/useStakeCallback";
import useTokenBalance from "hooks/useTokenBalance";

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
    padding: 20,
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
    textAlign: "center",
    padding: 20,
  },
  warning: {
    alignSelf: "center",
    justifySelf: "center",
    textAlign: "center",
    padding: 20,
    color: "red",
  },
}));

const StakeDialog = ({
  open,
  handleClose,
  type,
  tokenType,
  poolId,
  userStakedInfo,
  stopped,
}) => {
  const classes = useStyles();
  const [inputTokens, setTokenValue] = useState("");
  const [error, setError] = useState({ status: false, message: "" });
  const { account, chainId } = useActiveWeb3React();

  const poolToken = useMemo(() => {
    return {
      symbol: tokenType,
      address: tokenAddresses?.[tokenType]?.[chainId],
    };
  }, [tokenType, chainId]);

  const poolTokenBalance = useTokenBalance(poolToken?.address);

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

  const [
    transactionStatus,
    stakeTokens,
    unstakeTokens,
    emergencyWithdrawTokens,
  ] = useStakeCallback(tokenType);

  const onConfirm = async () => {
    if (type === "claim") {
      if (
        tokenType === AIBB &&
        new BigNumber(fromWei(userStakedInfo?.pending)).lt(
          minimumUnstakeAmount?.[tokenType]
        )
      ) {
        setError({
          status: true,
          message: `The minimum reward for claim is 500M. Please wait more time or you can deposit more to earn more $AIBB rewards`,
        });
        return;
      }

      if (new BigNumber(fromWei(userStakedInfo?.pending)).lte(1)) {
        setError({
          status: true,
          message: `Not enough rewards to claim`,
        });
        return;
      }

      const unstakeAmountForClaim =
        tokenType === AIBB ? minimumUnstakeAmount?.[tokenType] : "1";

      await unstakeTokens(unstakeAmountForClaim, poolId, stopped);

      // handleClose();

      return;
    }

    if (type === "emergency") {
      await emergencyWithdrawTokens(poolId);

      // handleClose();

      return;
    }

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

    if (type !== "stake" && new BigNumber(enteredTokens).gt(stakedTokens)) {
      setError({
        status: true,
        message: `Maximum withdraw amount can not exceed ${formatCurrency(
          stakedTokens
        )} !`,
      });
      return;
    }

    if (
      type === "stake" &&
      new BigNumber(enteredTokens).lt(minimumStakingAmount[tokenType])
    ) {
      setError({
        status: true,
        message: `Minimum ${formatLargeNumber(
          minimumStakingAmount[tokenType]
        )} ${tokenType} required to stake!`,
      });
      return;
    }

    if (
      type === "unstake" &&
      tokenType === AIBB &&
      new BigNumber(enteredTokens).lt(minimumUnstakeAmount?.[tokenType])
    ) {
      setError({
        status: true,
        message: `Minimum ${formatLargeNumber(
          minimumUnstakeAmount?.[tokenType]
        )} ${tokenType} required to unstake!`,
      });
      return;
    }

    if (
      type === "unstake" &&
      tokenType === AIBB &&
      new BigNumber(fromWei(userStakedInfo?.pending)).lt(
        minimumUnstakeAmount?.[tokenType]
      )
    ) {
      setError({
        status: true,
        message: `Your reward is less than  ${formatLargeNumber(
          minimumUnstakeAmount?.[tokenType]
        )} ${tokenType} Please wait more time or you can deposit more to earn more $AIBB
        `,
      });
      return;
    }

    if (type === "stake" && new BigNumber(enteredTokens).gt(balanceTokens)) {
      setError({
        status: true,
        message: `Can not stake more than balance: ${formatLargeNumber(
          balanceTokens
        )} ${tokenType}!`,
      });
      return;
    }

    setError({});

    if (type === "stake") {
      if (new BigNumber(enteredTokens).eq(balanceTokens)) {
        enteredTokens -= 1;
      }

      await stakeTokens(enteredTokens.toString(), poolId);
    } else {
      if (stopped) {
        await emergencyWithdrawTokens(poolId);
      } else {
        await unstakeTokens(enteredTokens?.toString(), poolId, stopped);
      }
    }
    // handleClose();
  };

  useEffect(() => {
    if (transactionStatus.status === "completed") {
      handleClose();
    }
  }, [transactionStatus]);

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

  const formattedBalance = useMemo(() => {
    if (tokenType === "PWAR") {
      return formatCurrency(fromWei(poolTokenBalance), false, 1, true);
    }

    return formatCurrency(fromWei(poolTokenBalance));
  }, [poolTokenBalance, account, tokenType]);

  const formattedStakedBalance = useMemo(() => {
    if (tokenType === "PWAR") {
      return formatCurrency(fromWei(userStakedInfo?.staked), false, 1, true);
    }

    return formatCurrency(fromWei(userStakedInfo?.staked));
  }, [userStakedInfo, tokenType, account]);

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
              {type === "stake" && "Stake tokens"}
              {type === "unstake" && "Withdraw tokens"}
              {type === "emergency" && "Emergency withdraw"}
              {type === "claim" && "Claim rewards"}
            </span>
          </DialogTitle>

          <p className={classes.subheading}>
            {type === "stake" &&
              `Available tokens: ${formattedBalance}  ${tokenType}`}
            {(type === "unstake" || type === "emergency") &&
              `Staked tokens: ${formattedStakedBalance} ${tokenType}`}
            {type === "claim" &&
              `Pending rewards: ${formatLargeNumber(
                fromWei(userStakedInfo?.pending)
              )} ${tokenType}`}
          </p>

          {["stake", "unstake"].includes(type) && (
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
          )}

          {error.status ? (
            <span className={classes.error}>{error.message}</span>
          ) : (
            ""
          )}
          {type === "emergency" ? (
            <span className={classes.warning}>
              You will not receive staking reward when execute this function.
              Please note about it
            </span>
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
                <CustomButton
                  onClick={onConfirm}
                  disabled={transactionStatus?.status === "pending"}
                >
                  {transactionStatus?.status === "pending"
                    ? "Pending Trx..."
                    : "Confirm"}
                </CustomButton>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default StakeDialog;
