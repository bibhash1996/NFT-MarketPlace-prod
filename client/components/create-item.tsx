import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import {
  makeStyles,
  Typography,
  createStyles,
  Theme,
  Button,
} from "@material-ui/core";
import { hooks, metaMask } from "../connectors/metamask";
import Web3 from "web3";
import IPFS from "ipfs-http-client";

const NFTMarket = require("../../build/contracts/NFTMarket.json");
const NFT = require("../../build/contracts/NFT.json");

const ipfsClient = IPFS.create({
  url: "https://ipfs.infura.io:5001/api/v0",
});

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const { useWeb3React, useProvider } = hooks;

function MarketPlace() {
  const classes = useStyles();
  const [fileUrl, setFileUrl] = useState<string>("");

  const provider = useProvider();
  const { account, active, library } = useWeb3React(provider);

  //   React.useEffect(() => {
  //     getMarketNFTs().then();
  //   }, []);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file = e.target.files[0];
    const fileAdded = await ipfsClient.add(file, {
      progress: (progress) => {
        console.log("Progress : ", progress);
      },
    });
    setFileUrl(`https://ipfs.infura.io/ipfs/${fileAdded.path}`);
  };

  const createMarketSale = async () => {
    const web3 = new Web3(metaMask.provider as any);
    if (!fileUrl) return;
    // web3.setProvider(provider.getSigner());
    console.log("WEB3 : ", web3);
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts : ", accounts);
    if (!accounts.length) return;
    const nwId = await web3.eth.net.getId();
    const nftContract = new web3.eth.Contract(
      NFT.abi,
      NFT.networks[nwId].address
    );
    const marketContract = new web3.eth.Contract(
      NFTMarket.abi,
      NFTMarket.networks[nwId].address
    );

    const response = await nftContract.methods
      .createToken(fileUrl)
      .send({ from: accounts[0] });
    console.log("Response create token : ", response);
  };

  return (
    <div>
      <input type="file" name="Asset" className="my-4" onChange={uploadFile} />
      {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
      <Button onClick={createMarketSale}>Create sale</Button>
    </div>
  );
}

export default MarketPlace;
