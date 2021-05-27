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
    width: 500,
    height: 400,
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
    marginTop: 40,
  },
  input: {
    "& label.Mui-focused": {
      color: "#616161",
    },
    width: 200,
    height: 50,
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
    marginTop: 80,
    marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
}));

export default function StakeDialog({
  open,
  handleClose,
  balance,
  stakedData,
  account,
  handleOnStake,
  handleOnUnstake,
  type,
  error,
  loading,
}) {
  const classes = useStyles();
  const [pbrTokens, setTokenValue] = useState(null);

  const handleInputChange = (e) => {
    setTokenValue(e.target.value.toString());
  };

  return (
    <div>
      <Dialog
        onClose={() => {
          handleClose();
          setTokenValue(null);
        }}
        open={open}
        disableBackdropClick
        className={classes.dialog}
        color="transparent"
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <div className={classes.background}>
          <DialogTitle
            onClose={() => {
              handleClose();
              setTokenValue(null);
            }}
          >
            <span className={classes.heading}>
              {type === "stake" ? "Stake tokens" : "Withdraw tokens"}
            </span>
          </DialogTitle>

          <p className={classes.subheading}>
            {type === "stake"
              ? `Avaialable tokens: ${balance} $PBR`
              : `Staked tokens: ${stakedData.amount} $PBR`}
          </p>
          <div className={classes.inputGroup}>
            <TextField
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
              placeholder="0"
              value={pbrTokens}
              onChange={handleInputChange}
              label="Enter PBR tokens"
              focused={true}
            />
            <Button
              className={classes.maxBtn}
              onClick={() => setTokenValue(balance)}
            >
              Max
            </Button>
          </div>

          <div className={classes.buttons}>
            {loading ? (
              <CircularProgress className={classes.numbers} />
            ) : (
              <>
                <CustomButton variant="light" onClick={handleClose}>
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={() =>
                    type === "stake"
                      ? handleOnStake(pbrTokens)
                      : handleOnUnstake(pbrTokens)
                  }
                >
                  <p>Confirm</p>
                </CustomButton>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
