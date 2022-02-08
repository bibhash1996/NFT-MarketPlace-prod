import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import {
  makeStyles,
  Typography,
  createStyles,
  Theme,
  Button,
  TextField,
  ButtonBase,
} from "@material-ui/core";
import { hooks, metaMask } from "../connectors/metamask";
import Web3 from "web3";
import IPFS from "ipfs-http-client";
import { useRouter } from "next/router";

const NFTMarket = require("../../build/contracts/NFTMarket.json");
const NFT = require("../../build/contracts/NFT.json");

const ipfsClient = IPFS.create({
  url: "https://ipfs.infura.io:5001/api/v0",
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
  })
);

const { useWeb3React, useProvider } = hooks;

function MarketPlace() {
  const classes = useStyles();
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);

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

  const getUpdatedIPFSURL = async () => {
    try {
      const fileObject = {
        name: name,
        description: description,
        image: fileUrl,
      };
      const addedIpfsFileObject = await ipfsClient.add(
        JSON.stringify(fileObject)
      );
      console.log("ADDED FILE OBJECT : ", addedIpfsFileObject);
      return `https://ipfs.infura.io/ipfs/${addedIpfsFileObject.path}`;
    } catch (error) {
      throw error;
    }
  };

  const createMarketSale = async () => {
    if (!price || !name || !description) return;
    if (!fileUrl) return;
    const web3 = new Web3(metaMask.provider as any);
    // web3.setProvider(provider.getSigner());
    console.log("WEB3 : ", web3);
    const updatedFileURL = await getUpdatedIPFSURL();

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
      .createToken(updatedFileURL)
      .send({ from: accounts[0] });
    console.log("Response create token : ", response);
    const tokenId = response.events["Transfer"]["returnValues"]["tokenId"];
    console.log("TokenID : ", tokenId);
    let listingPrice = await marketContract.methods.getListingPrice().call();
    listingPrice = listingPrice.toString();
    console.log("Listing price : ", web3.utils.fromWei(listingPrice, "ether"));
    // const _listingPrice = web3.utils.fromWei(listingPrice, "ether");
    const marketResponse = await marketContract.methods
      .createMarketItem(NFT.networks[nwId].address, tokenId, price)
      .send({ from: accounts[0], value: listingPrice });
    console.log("Create market item response : ", marketResponse);
    router.push("/");
  };

  return (
    <div className={classes.root}>
      <div>
        <TextField
          style={{ width: 350 }}
          // required
          id="outlined-required"
          label="Name"
          defaultValue="Sample name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={{ marginTop: 30 }}>
        <TextField
          style={{ width: 350 }}
          // required
          id="outlined-required"
          label="Description"
          defaultValue="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div style={{ marginTop: 30 }}>
        <TextField
          style={{ width: 350 }}
          // required
          type="number"
          id="outlined-required"
          label="Price (in Eth)"
          defaultValue="Description"
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <Button
        variant="contained"
        component="label"
        style={{
          width: 350,
          backgroundColor: "pink",
          color: "white",
          marginTop: 20,
        }}
      >
        Upload File
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={uploadFile}
          hidden
        />
      </Button>

      {fileUrl ? (
        <img
          className="rounded mt-4"
          width={200}
          height={200}
          src={fileUrl}
          style={{ marginTop: 8, aspectRatio: "auto" }}
        />
      ) : (
        <div
          style={{
            height: 200,
            width: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>No image added</Typography>
        </div>
      )}
      {/* <Button onClick={createMarketSale}>Create sale</Button> */}
      <Button
        variant="contained"
        component="label"
        onClick={createMarketSale}
        style={{
          width: 350,
          backgroundColor: "pink",
          color: "white",
          marginTop: 20,
        }}
      >
        Create sale
      </Button>
    </div>
  );
}

export default MarketPlace;
