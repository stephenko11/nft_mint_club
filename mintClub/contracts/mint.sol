// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract mint is ERC721, Ownable, ERC721Burnable, ReentrancyGuard {
    
    //set maximum supply. You may want to put it in this contract.
    //Because you want the minter knows that the Max Supply is fixed.
    //You may want to put a exact number here, as you want to show 
    //the max supply won't be changed
    uint256 public MAX_SUPPLY; 
    uint256 public currentTokenId;

    string private preBaseURI;
    string private baseURI;
    string private contractFullURI = "";
    string private baseExtension = ".json";
    
    bool private reveal = false;
    
    // The signer will sign the whitelist address and store it on the web
    // only address signed by the signer will be allow to mint in early stage
    // can set the address later
    address private storeKeeper;




    // "ipfs://QmPmFQf23RJwixt9nZaFjpEd8N58SsSTGTDfSeSdXfxD2a/"
    // maxperMint = 2
    // price = 0
    // 0.01 ether 1*10**16; 1 ether = 1*10**18
    constructor(string memory _name, 
                string memory _symbol,
                string memory _preBaseURI,
                uint256 _max_supply
                ) ERC721(_name, _symbol) {

        preBaseURI = _preBaseURI;
        MAX_SUPPLY = _max_supply;

    }

    modifier onlyOwnerOrstoreKeeper() {
        require (owner() == msg.sender || storeKeeper == msg.sender, 
        "You need to be the onwer or storeKeeper to access this function");
        _;
    }

    function safeMint(address _to, uint _amountOfArts) public 
    onlyOwnerOrstoreKeeper  {
        
        require (currentTokenId + _amountOfArts < MAX_SUPPLY, "Not enough art to sell");
      
        for(uint256 i=0; i < _amountOfArts; i++) {
            _safeMint(_to, currentTokenId);
            currentTokenId += 1;
        }

    }

    // Metadata
    function tokenURI(uint256 _tokenid) public view override returns (string memory){
        require(_tokenid < currentTokenId, "no such Token");
        if (!reveal) {

            return(preBaseURI);
        }

        if (bytes(baseURI).length == 0) return "";

        return(string(abi.encodePacked(baseURI, Strings.toString(_tokenid), baseExtension)));
    }

    function contractURI() public view returns (string memory) {
        return(contractFullURI);
    }

    function totalBalance() public view onlyOwner returns (uint256) {
        return (address(this).balance);
    }

    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    function setContractURI(string memory _contractURI) external onlyOwner {
        contractFullURI = _contractURI;
    }

    function setPreBaseURI(string memory _preBaseURI) external onlyOwner {
        preBaseURI = _preBaseURI;
    }

    function setStoreKeeper(address _storeKeeper) external onlyOwner {
        storeKeeper = _storeKeeper;
    }

    function setReveal() external onlyOwner {
        require (bytes(baseURI).length > 0, "BaseURI not set");
        reveal = !reveal;

    }

}