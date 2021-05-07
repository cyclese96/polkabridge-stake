import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  stakeButton: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    width: 130,
    height: 40,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
  },
  unstakeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#f6f6f6",
    borderColor: "#f6f6f6",
    width: 130,
    height: 40,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
  },
}));

const CustomButton = ({ onClick, children, variant = "primary" }) => {
  const classes = useStyles();
  return (
    <Button
      onClick={onClick}
      //   variant="contained"
      color="primary"
      className={
        variant == "primary" ? classes.stakeButton : classes.unstakeButton
      }
    >
      {children}
    </Button>
  );
};

export default CustomButton;
