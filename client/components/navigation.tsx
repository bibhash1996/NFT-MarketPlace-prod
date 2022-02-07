import Link from "next/link";
import { makeStyles, Typography, createStyles, Theme } from "@material-ui/core";
import { hooks, metaMask } from "../connectors/metamask";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      borderBottom: `1px solid rgba(0,0,0,0.1)`,
      padding: "10px",
      boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
      height: "72px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      fontSize: "20px",
      fontWeight: 600,
      fontFamily: "Roboto",
    },
    mainLinkContainer: {
      display: "flex",
      flexDirection: "row",
    },
    linkText: {
      marginRight: "20px",
      color: "#db6071",
      // fontWeight: 700,
      fontFamily: "Architects Daughter",
    },
    connection: {
      height: "40px",
      width: "40px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const { useWeb3React, useProvider } = hooks;

function MyApp() {
  const classes = useStyles();

  const provider = useProvider();
  const { account, active } = useWeb3React(provider);

  return (
    <nav className={classes.navigation}>
      <Typography className={classes.headerText}>
        Metaverse Marketplace
      </Typography>
      <div className={classes.mainLinkContainer}>
        <Link href="/">
          <a className={classes.linkText}>Home</a>
        </Link>
        <Link href="/create-item">
          <a className={classes.linkText}>Sell Disgital Asset</a>
        </Link>
        <Link href="/my-assets">
          <a className={classes.linkText}>My Digital Assets</a>
        </Link>
        <Link href="/creator-dashboard">
          <a className={classes.linkText}>Creator Dashboard</a>
        </Link>
      </div>
      <div
        className={classes.connection}
        style={{
          backgroundColor: active ? "#2a68264a" : "#f515152e",
        }}
        onClick={() => {
          if (!active) metaMask.activate();
        }}
      >
        <img
          src="/metamask.png"
          style={{ height: 40, aspectRatio: "auto", cursor: "pointer" }}
        />
      </div>
    </nav>
  );
}

export default MyApp;
