// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TestNFT is ERC721, Pausable, Ownable, ERC721Burnable, ReentrancyGuard {

    uint256 public constant MAX_SUPPLY = 7; //set max supply
    uint256 public maxPerMint;
    uint256 public currentTokenId;
    uint256 public price;
    

    string private preBaseURI;
    string private baseURI;
    string private contractFullURI = "";
    string private baseExtension = ".json";
    
    bool private reveal = false;
    
    // The signer will sign the whitelist address and store it on the web
    // only address signed by the signer will be allow to mint in early stage
    // can set the address later
    address private signer;




    // "ipfs://QmPmFQf23RJwixt9nZaFjpEd8N58SsSTGTDfSeSdXfxD2a/"
    // maxperMint = 2
    // price = 0
    // 0.01 ether 1*10**16; 1 ether = 1*10**18
    constructor(string memory _name, 
                string memory _symbol,
                string memory _preBaseURI,
                uint256 _maxPerMint,
                uint256 _price
                ) ERC721(_name, _symbol) {

        preBaseURI = _preBaseURI;
        maxPerMint = _maxPerMint;
        price = _price;

    }

    modifier ownerOrSigner() {
        require (owner() == msg.sender || signer == msg.sender);
        _;
    }

    function safeMint(address _to, uint _amountOfArts) public payable {
        require(_amountOfArts > 0, "has to buy at least one NFT");
        require(_amountOfArts <= maxPerMint, "exceed maxium buying amount");
        require (currentTokenId + _amountOfArts < MAX_SUPPLY, "Not enough art to sell");


        require(price * _amountOfArts == msg.value, "wrong ETH amount");
        for(uint256 i=0; i < _amountOfArts; i++) {
            _safeMint(_to, currentTokenId);
            currentTokenId += 1;
        }

    }

    function batchSafeMint(address[] memory _to, uint256[] memory _tokenId) 
    public ownerOrSigner {
        require(_tokenId.length == _to.length, "tokenId and tos length mismatch");

        for (uint i = 0; i < _tokenId.length; i++) {
           _safeMint(_to[i], _tokenId[i]);
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

    // Withdraw
    function withdrawAll() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        _widthdraw(owner(), address(this).balance);
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "failed withdraw");
    }

    function totalBalance() public view onlyOwner returns (uint256) {
        return (address(this).balance);
    }


    //Changing setting and variables
    function setPrice (uint _newPrice) external onlyOwner {
        price = _newPrice;
    }

    function setMaxPerMint(uint256 _newMaxPerMint) external onlyOwner {
        maxPerMint = _newMaxPerMint;
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

    function setReveal() external onlyOwner {
        require (bytes(baseURI).length > 0, "BaseURI not set");
        reveal = !reveal;

    }


    // Pausing and unpause the transaction
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }



    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}