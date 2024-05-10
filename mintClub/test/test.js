const { expect } = require('chai');

var chai = require('chai');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

// declaring gobal variables for passing
// data from beforeEach to it
let TMsignature_r
let TMsignature_v
let TMsignature_s

let WLsignature_r
let WLsignature_v
let WLsignature_s

let firstAccountAddress
let secondAccountAddress


describe('Mint Club Contract Unit Test', function () {
  before(async function () {
   
  // deploying mintClubContract 
  MintClubContract = await ethers.getContractFactory("contracts/mint.sol:mint");
   mintClubContract = await MintClubContract.deploy(
   "mintClub", 
   "MC",
   "ipfs://QmPmFQf23RJwixt9nZaFjpEd8N58SsSTGTDfSeSdXfxD2a/0.json",
   20);
   await mintClubContract.deployed();

   console.log("Mint Contract deployed to:", mintClubContract.address)
   const addressparameter = mintClubContract.address


  // obtaining deployer address and additional account user1 and user2
  const [deployer, user1, user2] = await ethers.getSigners()
  firstAccountAddress = user1.address
  secondAccountAddress = user2.address

  // For deploying the mintOrientationContract
   MintOrientationContract = await ethers.getContractFactory("contracts/mintOrientation.sol:mintOrientation");
   mintOrientationContract = await MintOrientationContract.deploy(
     addressparameter,
     deployer.address
     ); // could add gasLimit here.{ gasLimit: 30000000 }
  
  // For estimating gas spent 
  deployer.getBalance().then((balance) => {
      // convert a currency unit from wei to ether
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log(`balance: ${balanceInEth} ETH`)
      //console.log(`${typeof(balanceInEth)}`)
  })

  await mintOrientationContract.deployed();
  console.log("Orientation Contract deployed to:", mintOrientationContract.address)
  console.log("Signer Address:", deployer.address)


  //setting the StoreKeeper in mintClubContract (connecting mintClub to mint Orientation)
  const storeKeeperAddress = mintOrientationContract.address
  await mintClubContract.setStoreKeeper(storeKeeperAddress);



  });





  beforeEach(async function () {

    const storeKeeperAddress = mintOrientationContract.address

    // This is the EIP712 standard for TeamMint members
    const couponSignatureTeamMint = async () => {

      //const ethersjs = require('ethers');

      //the domain infromation has to matach the contract you deploy
      // name and version was declared at the contructor
      // This is EIP-712 standard
      const domain = {
        name: "mintOrientation",
        version: "1",
        verifyingContract: storeKeeperAddress,
        chainId: "31337",
      };

      // It declares the name and type of variables in the message
      // The name has to be as same as the dataname defined in the smart contract
      
      //The one particularly for mataching Enum declared in the smart conttract
      const CouponTypeEnum = {
        teamMembers: 0,
        whiteList: 1
      }

      const types = {
        SignTeamGiveaway:[
          {name: 'receiver', type: 'address'},
          {name: 'amount', type: 'uint256'},
          {name: 'couponType', type:'uint256'}
        ]
      };

      // the data itself
      const message = {
        receiver: firstAccountAddress,
        amount: 1,
        couponType: CouponTypeEnum['teamMembers']
      };


    // create signer using the private key of the owner/deployer
    const wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    )

    // sign the data
    const signature = await wallet._signTypedData(domain, types, message);

    // obtain RSV data from the signature
    const { r, s, v } = await ethers.utils.splitSignature(signature);

    return{ signature, r, s, v }

    }

    
    /*
    This is the EIP712 standard for whitelist mint
    */
        const couponSignatureWLmint = async () => {

          //the domain infromation has to matach the contract you deploy
          // name and version was declared at the contructor
          // This is EIP-712 standard
          const domain = {
            name: "mintOrientation",
            version: "1",
            verifyingContract: storeKeeperAddress,
            chainId: "31337",
          };
    
          // It declares the name and type of variables in the message
          // The name has to be as same as the dataname defined in the smart contract
          
          //The one particularly for mataching Enum declared in the smart conttract
          const CouponTypeEnum = {
            teamMembers: 0,
            whiteList: 1
          }
    
          const types = {
            Signwhitelist:[
              {name: 'receiver', type: 'address'},
              {name: 'amount', type: 'uint256'},
              {name: 'couponType', type:'uint256'}
            ]
          };
    
          // the data itself
          const message = {
            receiver: secondAccountAddress,
            amount: 1,
            couponType: CouponTypeEnum['whiteList']
          };
    
    
        // create signer using the private key of the owner/deployer
        const wallet = new ethers.Wallet(
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        )
    
        // sign the data
        const signature = await wallet._signTypedData(domain, types, message);
    
        // obtain RSV data from the signature
        const { r, s, v } = await ethers.utils.splitSignature(signature);
    
        return{ signature, r, s, v }
    
        }
    

    // To obtain the signature for TeamMint
    const signatureForTM = await couponSignatureTeamMint()
    TMsignature_r = signatureForTM.r
    TMsignature_s = signatureForTM.s
    TMsignature_v = signatureForTM.v

    // To obtain the signature for whiteList
    const signatureForWL = await couponSignatureWLmint()
    WLsignature_r = signatureForWL.r
    WLsignature_s = signatureForWL.s
    WLsignature_v = signatureForWL.v


  });




  it('name', async function () {
    expect((await mintClubContract.name())).to.equal('mintClub');
  });

  it('mint  price', async function () {
    expect((await mintOrientationContract.price()).toString()).to.equal('5000000000000000');
  });

  it('the orientation access to the mintClub contract', async function () {
    expect((await mintOrientationContract.getMaxSupply()).toString()).to.equal('20');
  });

  it('mints for team member during preSale period', async function () {
    await mintOrientationContract.setSalePhasePreSale();
    await mintOrientationContract.mintToTeamMembers(
      firstAccountAddress,
      1,
      TMsignature_v,
      TMsignature_r,
      TMsignature_s
    );
    expect((await mintClubContract.ownerOf(0)).toString()).to.equal(firstAccountAddress);
  });

  it('mints for whitelist member during preSale period', async function () {
    const [deployer, user1, user2] = await ethers.getSigners()
    await mintOrientationContract.setSalePhasePreSale()
    const price = await mintOrientationContract.price()
    // overrides can send price 
    /*
    EXAMPLES:
    const overrides = {
    gasLimit: estimatedGas,
    gasPrice,
    value: ethers.utils.parseEther("0"),
  }
    */
    const overrides = {
      value:price,
    }
    await mintOrientationContract.connect(user2).mintToWhitelist(
      1,
      WLsignature_v,
      WLsignature_r,
      WLsignature_s,
      overrides
    );
    expect((await mintClubContract.ownerOf(1)).toString()).to.equal(secondAccountAddress);
    
    // For estimating gas spent 
    user2.getBalance().then((balance) => {
    // convert a currency unit from wei to ether
    const balanceInEth2 = ethers.utils.formatEther(balance)
    console.log(`balance: ${balanceInEth2} ETH`)
    //console.log(`${typeof(balanceInEth)}`)
    })
  });

  /*
  // to test error, you need to put the error function into a function first before putting it into
  // the expect. and use to.throw. 
  // but currently does not work with async function
  it('does not allow whitelist member to use team mint during preSale period', async function () {
    const [deployer, user1, user2] = await ethers.getSigners()
    await mintOrientationContract.setSalePhasePreSale()
    expect(async function () {
      await mintOrientationContract.connect(user2).mintToTeamMembers(
      secondAccountAddress,
      1,
      WLsignature_v,
      WLsignature_r,
      WLsignature_s);
    }).to.throw('Your action is not authorized by the owner (check mint amount/Coupon)')
  });
  */

  

});