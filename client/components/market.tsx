import Link from "next/link";
import React from "react";
import { makeStyles, Typography, createStyles, Theme } from "@material-ui/core";
import { hooks, metaMask } from "../connectors/metamask";
import Web3 from "web3";
// import NFTMarket from "../../build/contracts/NFTMarket.json";

const NFTMarket = require("../../build/contracts/NFTMarket.json");

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const { useWeb3React, useProvider } = hooks;

function MarketPlace() {
  const classes = useStyles();

  const provider = useProvider();
  const { account, active, library } = useWeb3React(provider);

  React.useEffect(() => {
    getMarketNFTs().then();
  }, []);

  const getMarketNFTs = async () => {
    const web3 = new Web3(metaMask.provider as any);
    // const web3 = new Web3(provider as any);
    console.log("WEB3 : ", web3);
    const nwId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
      NFTMarket.abi,
      NFTMarket.networks[nwId].address
    );
    const response = await contract.methods.fetchMarketItems().call();
    console.log("RESPOSNE : ", response);
  };

  return <div></div>;
}

export default MarketPlace;
