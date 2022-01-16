import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  stakeButton: {
    background: `linear-gradient(to bottom,#D9047C, #BF1088)`,
    color: "white",
    width: "fit-content",
    height: 36,
    textTransform: "none",
    borderRadius: 30,
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    padding: "5px 20px 5px 20px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      fontSize: 13,
    },
  },
  unstakeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#f6f6f6",
    borderColor: "#f6f6f6",
    width: "fit-content",
    height: 40,
    borderRadius: 30,
    textTransform: "none",
    fontSize: 16,
    marginRight: 5,
    marginLeft: 5,
    padding: "5px 20px 5px 20px",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      fontSize: 15,
    },
  },
}));

const CustomButton = ({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  hidden = false,
}) => {
  const classes = useStyles();
  return (
    <Button
      hidden={hidden}
      onClick={onClick}
      color="primary"
      variant="contained"
      disabled={disabled}
      className={
        variant == "primary" ? classes.stakeButton : classes.unstakeButton
      }
    >
      {children}
    </Button>
  );
};

export default CustomButton;
