import React, { useState } from "react";
import {
  makeStyles,
  Typography,
  createStyles,
  Theme,
  Grid,
  Button,
} from "@material-ui/core";
import { hooks, metaMask } from "../connectors/metamask";
import Web3 from "web3";
import axios from "axios";

const NFTMarket = require("../../build/contracts/NFTMarket.json");
const NFT = require("../../build/contracts/NFT.json");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 20,
      backgroundColor: "rgb(239, 238, 234)",
      height: "90vh",
    },
    nftItem: {
      padding: 20,
      borderRadius: 20,
      display: "flex",
      justifyContent: "center",
      // alignItems:'center',
      backgroundColor: "white",
      boxShadow: "0 5px 10px -2px #e7e5de",
      flexDirection: "column",
    },
    text: {
      marginTop: 10,
      fontSize: "16px",
    },
  })
);

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
    getMyNFTs().then();
  }, [active]);

  const getMyNFTs = async () => {
    if (!active) return;
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
    const response = await contract.methods.fethcMyNFTs().call();
    console.log("Raw Response: ", response);
    // console.log("RESPOSNE : ", JSON.stringify(response));
    const arrayResponse: any[] = JSON.parse(JSON.stringify(response));
    const nftArray: NFTItem[] = await Promise.all([
      ...arrayResponse.map(async (_item) => {
        const tokenUri = await nftContract.methods.tokenURI(_item[2]).call();
        console.log("Token meta : ", tokenUri);
        const meta = await axios.get(tokenUri);
        // console.log("Metadata : ", meta.data);
        return {
          itemId: _item[0],
          nftContract: _item[1],
          owner: _item[4],
          price: _item[5],
          seller: _item[3],
          sold: _item[6] as boolean,
          tokenId: _item[2],
          image: meta.data.image || tokenUri,
          name: meta.data.name,
          description: meta.data.description,
        };
      }),
    ]);
    setNFTArray(nftArray);
  };

  return (
    <div className={classes.root}>
      {console.log("NFT Array : ", nftArray)}
      <Grid container>
        {nftArray.map((_nft, index) => (
          <Grid
            item
            md={3}
            sm={4}
            xs={12}
            className={classes.nftItem}
            key={index}
          >
            <img
              src={_nft.image}
              style={{ height: 200, borderRadius: "20px" }}
            />
            <Typography className={classes.text} noWrap>
              <span style={{ fontWeight: 700 }}> Name : </span>
              {_nft.name || "Unnamed"}
            </Typography>
            <Typography className={classes.text} noWrap>
              <span style={{ fontWeight: 700 }}> Description : </span>
              {_nft.description || "Not available"}
            </Typography>
            <Typography className={classes.text} noWrap>
              <span style={{ fontWeight: 700 }}> Seller : </span>
              {_nft.seller || "Not available"}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default MarketPlace;
