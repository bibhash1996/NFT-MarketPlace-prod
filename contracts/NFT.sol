pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address contractAddress;

    constructor(address marketPlaceAddress) ERC721("Metaverse Tokens", "METB") {
        contractAddress = marketPlaceAddress;
    }

    // Minting new token
    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        setApprovalForAll(contractAddress, true);

        return newTokenId;
    }
}
