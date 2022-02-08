import Link from "next/link";
import React, { useState } from "react";
import {
  makeStyles,
  Typography,
  createStyles,
  Theme,
  Grid,
} from "@material-ui/core";
import { hooks, metaMask } from "../connectors/metamask";
import Web3 from "web3";
import axios from "axios";
// import NFTMarket from "../../build/contracts/NFTMarket.json";

const NFTMarket = require("../../build/contracts/NFTMarket.json");
const NFT = require("../../build/contracts/NFT.json");

const useStyles = makeStyles((theme: Theme) => createStyles({}));

type NFTItem = {
  itemId: string;
  tokenId: string;
  sold: boolean;
  seller: string;
  price: string;
  nftContract: string;
  owner: string;
  image: string;
  name: string;
  description: string;
};

const { useWeb3React, useProvider } = hooks;

function MarketPlace() {
  const classes = useStyles();

  const provider = useProvider();
  const { account, active, library } = useWeb3React(provider);
  const [nftArray, setNFTArray] = useState<NFTItem[]>([]);

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
    const nftContract = new web3.eth.Contract(
      NFT.abi,
      NFT.networks[nwId].address
    );
    const response = await contract.methods.fetchMarketItems().call();
    console.log("Raw Response: ", response);
    // console.log("RESPOSNE : ", JSON.stringify(response));
    const arrayResponse: any[] = JSON.parse(JSON.stringify(response));
    const nftArray: NFTItem[] = await Promise.all([
      ...arrayResponse.map(async (_item) => {
        const tokenUri = await nftContract.methods.tokenURI(_item[2]).call();
        console.log("Token meta : ", tokenUri);
        const meta = await axios.get(tokenUri);
        console.log("Metadata : ", meta.data);
        return {
          itemId: _item[0],
          nftContract: _item[1],
          owner: _item[4],
          price: _item[5],
          seller: _item[3],
          sold: _item[6] as boolean,
          tokenId: _item[2],
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      }),
    ]);
    setNFTArray(nftArray);
  };

  return (
    <div>
      {console.log("NFT Array : ", nftArray)}
      <Grid container>
        {nftArray.map((_nft, index) => (
          <div />
        ))}
        <Grid item md={4} sm={6} xs={12}></Grid>
      </Grid>
    </div>
  );
}

export default MarketPlace;
