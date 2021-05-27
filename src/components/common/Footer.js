import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginTop: 120,
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <a className={classes.item} href="#">
        Contract
      </a>
      <a className={classes.item} href="#">
        Github
      </a>
      <a className={classes.item} href="#">
        Twitter
      </a>
      <a className={classes.item} href="#">
        Telegram
      </a>
    </div>
  );
};

export default Footer;
