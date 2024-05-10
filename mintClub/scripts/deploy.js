async function main() {
  
  //const initialSupply = ethers.utils.parseEther("100000")
  //this con be placed into the contractor variable under deploy below
  //this is to ether method under the ethers library, like web3 library

  const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

  console.log("Deploying contracts with the account:", deployer.address);

  /*
  const FactoryContract = await hre.ethers.getContractFactory("contracts/mint.sol:mint"); // Getting the Contract
  const contract = await FactoryContract.deploy(
    "Mint Club",
    "MC",
    "ipfs://QmPmFQf23RJwixt9nZaFjpEd8N58SsSTGTDfSeSdXfxD2a/",
    20,  
  ); 

  //deploying the contract could add { gasLimit: 300000 }. 
  // No need to add 0.json if only one file in the address
  */

  
  const FactoryContract = await hre.ethers.getContractFactory("contracts/mintOrientation.sol:mintOrientation"); // Getting the Contract
  const contract = await FactoryContract.deploy(
    "0x206AC1F2331b2498AE917CA65996A11AD35F1Dbc", 
    "0x356d358f406cC0c197cbb64c3C8Bd281513d931d",  
  ); //deploying the contract could add { gasLimit: 300000 } 

  await contract.deployed(); // waiting for the contract to be deployed

  console.log("Contract deployed to:", contract.address); // Returning the contract address on the rinkeby
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); // Calling the function to deploy the contract