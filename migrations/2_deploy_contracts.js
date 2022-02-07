const NFT = artifacts.require("NFT");
const NFTMarket = artifacts.require("NFTMarket");

module.exports =async function(deployer) {
   await deployer.deploy(NFTMarket);
  const market = await NFTMarket.deployed();
  
  await deployer.deploy(NFT,market.address);
};
