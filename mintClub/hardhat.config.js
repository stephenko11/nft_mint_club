require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-truffle5");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const privateKey = process.env.PRIVATE_KEY;
const url_rinkeby = process.env.URL_rinkeby;
const url_matic = process.env.URL_matic;
const url_kovan = process.env.URL_kovan;

module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
  hardhat:{
      allowUnlimitedContractSize: true,
      gasPrice: 1100000000,
      },
   rinkeby: {
     url: url_rinkeby, //Infura url with projectId
     accounts: [privateKey], // add the account that will deploy the contract (private key)
     gasPrice: 1100000000,  
    },
    matic: {
      url: url_matic,
      accounts: [privateKey],
      gasPrice: 35000000000,
    },
    kovan: {
      url: url_kovan, //Infura url with projectId
      accounts: [privateKey], // add the account that will deploy the contract (private key)
      allowUnlimitedContractSize: true,
    },
  }
};
