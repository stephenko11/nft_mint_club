// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface mint {
    function safeMint(address, uint) external;
    function MAX_SUPPLY() external view returns (uint256);
    function currentTokenId() external view returns (uint256);
}

contract mintOrientation is EIP712, Ownable, ReentrancyGuard {

    // Price per NFT
    uint256 public price;

    // Pause mint
    bool public mintPaused = false;

   /**
        Team Giveaway Mints parameters
     */
    // max in Team giveaway stage
    uint256 private maxTeamMint = 2;
    // max per mint
    uint256 private maxPerMintTeamMember = 1;
    // max each can hold
    uint256 private maxPerTeamMemberCanHold = 2;
    uint256 private numTeamMinted = 0;
    mapping(address => uint256) public teamMap;

    /**
        Whitelists parameters
     */
     // max amount in whitelist stage
    uint256 private maxWhitelistMint = 5;
    // max amount per mint
    uint256 private maxPerMintWhitelister = 1;
    // max each can hold
    uint256 private maxPerWhitelisterCanHold = 2;
    uint256 private numWhitelistMinted = 0;
    mapping(address => uint256) public whitelistMap;

     /**
        Public Sell
     */
    uint256 public maxPerPublicMint = 1;
    uint256 private numPublicMinted;
    mapping(address => uint256) public publicMap;

    

    // connect to the mint contact.To call the function in the interface
    // mintApi.safeMint(address, uint)
    mint public mintApi;

    //Setting a wallet address for receiving payment (i.e. Owner's Wallet)
    address payable public reserve; 

    /**
        EIP-712
        for authorize the address that can mint (using signature)
    */
    // Coupon signed with the approved address
    enum CouponType {
    teamMembers,
    whitelist
    }

    // for the team members giveaway addresses 
    bytes32 public constant TEAMGIVEAWAY_TYPEHASH =
        keccak256("SignTeamGiveaway(address receiver,uint256 amount,uint256 couponType)");
    struct SignTeamGiveaway {
        address receiver;
        uint256 amount;
        uint256 couponType; 
    }

    // for the whitelist addressess
    bytes32 public constant WHITELIST_TYPEHASH =
        keccak256("Signwhitelist(address receiver,uint256 amount,uint256 couponType)");
    struct Signwhitelist {
        address receiver;
        uint256 amount;
        uint256 couponType; 
    }
    
    /** 
       Sale Stage
    */
    enum SalePhase {
    locked,
    PreSale,
    PublicSale
    }
    SalePhase constant defaultSaleStage = SalePhase.locked;
    SalePhase public saleStage = defaultSaleStage;

    /**
        Scheduling
     */
    //uint256 public giveawayOpeningHours = 1650628800; // Friday, April 22, 2022 10:00:00 PM GMT+08:00
    //uint256 public openingHours = 1650686400; // Saturday, April 23, 2022 12:00:00 PM GMT+08:00
    //uint256 public constant operationSecondsForStage1 = 3600 * 4; // 4 hours
    //uint256 public constant operationSecondsForStage2 = 3600 * 4; // 4 hours
    //uint256 public constant operationSecondsForStage3 = 3600 * 4; // 4 hours

    
    constructor(
        address _mintContractAddress,
        address _receiverAddress
    ) EIP712("mintOrientation", "1") {
        //1 ether (if 0.2 ether, can write 0.2 ether here)
        // 0.01 ether 1*10**16; 1 ether = 1*10**18
        price = 5*10**15; 
        mintApi = mint(_mintContractAddress);
        reserve = payable(_receiverAddress);

    }

    /**
        Declaring the Modifier 
    */
    modifier whenNotPaused() {
        require(
            !mintPaused,
            "Store is closed"
        );
        _;
    }

    modifier preSaleOpened() {
        require(
            saleStage == SalePhase.PreSale,
            "It is not opened for the PreSale yet."
        );
        _;
    }

    modifier publicOpened() {
        require(
            saleStage == SalePhase.PublicSale,
            "It is not opened to public sale yet."
            );
        _;
    }

    /**
        Setting Parameters
    */ 
    function setmintPause() external onlyOwner {
        mintPaused = !mintPaused;
    }

    function setSalePhasePreSale() external onlyOwner {
        saleStage = SalePhase.PreSale;
    }

    function setSalePhasePublicSale() external onlyOwner {
        saleStage = SalePhase.PublicSale;
    }

    function setSalePhaseDefault() external onlyOwner {
        saleStage = defaultSaleStage;
    }

    // Max token can be minted in Team giveaway stage
    function setMaxTeamMint (uint256 _maxTeamMint) external onlyOwner {
        maxTeamMint = _maxTeamMint;
    }

    // max token a team member can mint per calling minting function
    function setMaxPerMintTeamMember(uint256 _maxPerMintTeamMember) external onlyOwner {
        maxPerMintTeamMember = _maxPerMintTeamMember;
    }

    // max token a team member can hold 
    function setMaxPerTeamMemberCanHold(uint256 _maxPerTeamMemberCanHold) external onlyOwner {
        maxPerTeamMemberCanHold = _maxPerTeamMemberCanHold;
    }

    // Max token can be minted in whitelist stage
    function setMaxWhitelistMint(uint256 _maxWhitelistMint) external onlyOwner {
        maxWhitelistMint = _maxWhitelistMint;
    }

    // max token a whitelister can mint per calling minting function
    function setMaxPerMintWhitelister(uint256 _maxPerMintWhitelister) external onlyOwner {
        maxPerMintWhitelister = _maxPerMintWhitelister;
    }

    // max token a whitelister can hold 
    function setMaxPerWhitelisterCanHold(uint256 _maxPerWhitelisterCanHold) external onlyOwner {
        maxPerWhitelisterCanHold = _maxPerWhitelisterCanHold;
    }

    /**
        Minting
    */
    // Mint to team members
    // NFT will be mint by another EIP-721 contract
    function mintToTeamMembers(
        address _to,
        uint256 _nftAmount,
        uint8 _vSig,
        bytes32 _rSig,
        bytes32 _sSig
    ) public payable whenNotPaused preSaleOpened nonReentrant {

        uint256 _currentTokenId = mintApi.currentTokenId();
        uint256 _maxSupply = mintApi.MAX_SUPPLY();
        
        uint256 teamMemberToken = teamMap[_to];
        require(teamMemberToken + _nftAmount <= maxPerTeamMemberCanHold, "Over max capacity a person can hold");
        require(_nftAmount > 0, "has to buy at least one NFT");
        require(_nftAmount <= maxPerMintTeamMember, "exceed maxium buying amount");
        require(numTeamMinted + _nftAmount <= maxTeamMint, "Max number of giveaways reached");
        require(_currentTokenId + _nftAmount <= _maxSupply, "not enough supply of NFTs");
        
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(TEAMGIVEAWAY_TYPEHASH, _to, _nftAmount, uint(CouponType.teamMembers))));
        
        address signer = ecrecover(digest, _vSig, _rSig, _sSig);

        require(signer == owner(), "Your action is not authorized by the owner (check mint amount/Coupon)");

        mintApi.safeMint(_to, _nftAmount);

        numTeamMinted += _nftAmount; //update who total number of token minted under team minted stage

        teamMap[_to] = _nftAmount; //update who has claimed their teamMint

    }

    // Mint by Whitelist
    // the payment will be injected in this smart contract and 
    // NFT will be mint by another EIP-721 contract
    function mintToWhitelist(
        uint256 _nftAmount,
        uint8 _vSig,
        bytes32 _rSig,
        bytes32 _sSig
    ) public payable whenNotPaused preSaleOpened nonReentrant {

        uint256 _currentTokenId = mintApi.currentTokenId();
        uint256 _maxSupply = mintApi.MAX_SUPPLY();
        
        uint256 whitelisterToken = whitelistMap[msg.sender];
        require(whitelisterToken + _nftAmount <= maxPerWhitelisterCanHold, "Over max capacity a person can hold");
        require(_nftAmount > 0, "has to buy at least one NFT");
        require(_nftAmount <= maxPerMintWhitelister, "exceed maxium buying amount");
        require(numWhitelistMinted + _nftAmount <= maxWhitelistMint, "Whitelist limit reached");
        require(_currentTokenId + _nftAmount <= _maxSupply, "not enough supply of NFTs");
        require(price * _nftAmount <= msg.value, "wrong ETH amount");
        
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(WHITELIST_TYPEHASH, msg.sender, _nftAmount, uint(CouponType.whitelist))));
        
        address signer = ecrecover(digest, _vSig, _rSig, _sSig);

        require(signer == owner(), "Your action is not authorized by the owner (check mint amount/Coupon)");

        mintApi.safeMint(msg.sender, _nftAmount);

        numWhitelistMinted += _nftAmount; //update who total number of token minted under team minted stage

        whitelistMap[msg.sender] = _nftAmount; //update who has claimed their teamMint

        // Refund changes
        uint256 changes = msg.value - (price * _nftAmount);
    
        if (changes > 0) {
            payable(msg.sender).transfer(changes);
        }

    }

    function mintPublic(uint256 _nftAmount) public payable whenNotPaused publicOpened {

        uint256 _maxSupply = mintApi.MAX_SUPPLY();

        require(_nftAmount <= maxPerPublicMint, "Cannot exceed max nft per mint");

        require(numPublicMinted + numWhitelistMinted + numTeamMinted + _nftAmount <= _maxSupply, "Mints exceeds max supply");

        require(price * _nftAmount <= msg.value, "wrong ETH amount");

        mintApi.safeMint(msg.sender, _nftAmount);

        numPublicMinted += _nftAmount; //update who total number of token minted under team minted stage

        publicMap[msg.sender] = _nftAmount; 


        // Refund changes
        uint256 changes = msg.value - (price * _nftAmount);
    
        if (changes > 0) {
            payable(msg.sender).transfer(changes);
        }
    }

    // withdraw eth for sold NTR
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        //send ETH to designated receiver only
        reserve.transfer(balance);
    }
    
    function balanceof() external view onlyOwner returns(uint256){
        return address(this).balance;
    }

    function getCurrentTokenId() external view returns(uint256){
        return mintApi.currentTokenId();
    }

    function getMaxSupply() external view returns(uint256){
        return mintApi.MAX_SUPPLY();
    }


}