import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
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

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 400,
    height: 300,
  },
  input: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& label.Mui-": {
      color: "white",
    },
    width: 200,
    height: 50,
    color: "#f9f9f9",
    // backgroundColor: "#f9f9f9",
  },
  inputText: {
    color: "#f8f8f8",
    backgroundColor: "red",
  },
  maxBtn: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    height: 50,
    borderRadius: 10,
    marginLeft: 20,
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
  },
  buttons: {
    marginTop: 40,
    marginBottom: 30,
  },
}));
export default function StakeDialog({ open, handleClose }) {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        disableBackdropClick
        className={classes.dialog}
      >
        <div className={classes.background}>
          <DialogTitle onClose={handleClose}>Stake Liquidity</DialogTitle>

          <p>Avaialable balence: 122234 $PBR</p>
          <div>
            <TextField
              inputProps={classes.inputText}
              className={classes.input}
              id="outlined-basic"
              variant="outlined"
              placeholder="0"
              label="Enter PBR tokens"
            />
            <Button className={classes.maxBtn}>Max</Button>
          </div>

          <div className={classes.buttons}>
            <CustomButton variant="light" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton>Confirm</CustomButton>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
