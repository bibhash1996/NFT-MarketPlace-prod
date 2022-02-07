import "../styles/globals.css";
import type { AppProps } from "next/app";
import { makeStyles, Typography, createStyles, Theme } from "@material-ui/core";
import dynamic from "next/dynamic";

const Navigation = dynamic(() => import("../components/navigation"), {
  ssr: false,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      borderBottom: `1px solid rgba(0,0,0,0.1)`,
      padding: "10px",
    },
    headerText: {
      fontSize: "16px",
      fontWeight: 700,
    },
    mainLinkContainer: {
      display: "flex",
      flexDirection: "row",
      marginTop: 4,
    },
    linkText: {
      marginRight: "16px",
      color: "pink",
      fontWeight: 500,
    },
  })
);

// const { useWeb3React, useProvider } = hooks;

function MyApp({ Component, pageProps }: AppProps) {
  const classes = useStyles();

  return (
    <div>
      <Navigation />
      {/* <ConnectButton /> */}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
