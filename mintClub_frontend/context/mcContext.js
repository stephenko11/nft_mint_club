import { useState, createContext, useEffect } from 'react'
import { useMoralis, useMoralisQuery } from 'react-moralis'
import { createHash } from 'crypto'
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

import { mcOrientationAbi, mcOrientationAddress } from '../lib/constants'

//import Toast from '../components/Toast'

//import { amacoinAbi, amacoinAddress } from '../lib/constants'
import { ethers } from 'ethers'


// CreateContext is used to create props to pass down
export const mcContext = createContext()

// define the props to pass (including function to obtain the data)
// APIs feed the raw data here
export const McProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('')
    const [nickname, setNickname] = useState('')
    const [formatAccount, setFormattedAccount] = useState('')
    const [balance, setBalance] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [warning, setWarning] = useState('')
    const [signUpSuccess, setSignUpSuccess] = useState(false)
    const [nftAmount, setnftAmount] = useState(1)
    const [AmountDue, setAmountDue] = useState('')
    const [mintSuccessful, setMintSuccessful] = useState(false)
    
    
    const [transactionSent, setTransactionSent] = useState(false)
    const [etherscanLink, setEtherscanLink] = useState('')
    const [username, setUsername] = useState('')

    
    const {
      authenticate,
      isAuthenticated,
      logout,
      user,
      enableWeb3,
      isWeb3Enabled,
      chainId,
      Moralis, } = useMoralis()
    
    useEffect(() => {
      checkWalletConnection().catch(console.error)
      }, [
        authenticate,
        isAuthenticated,
        currentAccount,
        setCurrentAccount,
        chainId,
      ])

    const checkWalletConnection = async () => {
      if (isAuthenticated) {
        console.log(chainId)
        const account = await user?.get('ethAddress')
        setCurrentAccount(account)
        const formatAccount = account.slice(0, 5) + '...' + account.slice(-5)
        setFormattedAccount(formatAccount)
          } else {
              setCurrentAccount('')
              setBalance('')
          }
        }
      
    const connectWallet = async () => {
      let user = Moralis.User.current();
        if (!user) {
          try {
              await authenticate({
                signingMessage: 'Log in using Moralis',
              })
              await enableWeb3()
              } catch (error) {
                console.error(error)
              }
          }
        }    
    


    const signUp = async(emailAddressData, walletAddressData) => {
      try{
        if (!isAuthenticated) return 

        setIsLoading(true)
        await enableWeb3()

        const hash = createHash('sha256').update(emailAddressData).digest('hex')

        const ApprovedList = Moralis.Object.extend('approvedList')
        const queryApprovedList = new Moralis.Query(ApprovedList)
        queryApprovedList.equalTo('email', emailAddressData)
        const approvedListFetch = await queryApprovedList.find()

        const Whitelist = Moralis.Object.extend("whitelist")
        const queryEmail = new Moralis.Query(Whitelist)
        queryEmail.equalTo('email', emailAddressData)
        const emailFetch = await queryEmail.find()


        const queryWalletAddress = new Moralis.Query(Whitelist)
        queryWalletAddress.equalTo('address', walletAddressData)
        const addressFetch = await queryWalletAddress.find()

        if (!(approvedListFetch.length == 1)) {
          setWarning("You are not approved!")
        } else if (emailFetch.length == 0 && addressFetch.length == 0 && approvedListFetch.length == 1) {
          const whitelist = new Whitelist()
          whitelist.set('email', emailAddressData)
          whitelist.set('address', walletAddressData)
          await whitelist.save().catch(err => console.error(err))
          setSignUpSuccess(true)
        } else {
          setWarning("Email or Wallet Address was used")
        }
        
        setIsLoading(false)
      
      } catch (error){
        console.log(error)
        setIsLoading(false)
        }
    }

    const mint = async (_amount) => {
      try{

        if (!isAuthenticated) return

        setIsLoading(true)

        const amount = ethers.BigNumber.from(_amount)
        const price =  ethers.BigNumber.from('5000000000000000')
        const calPrice = amount.mul(price)

        let options = {
          contractAddress: mcOrientationAddress,
          functionName: 'mintPublic',
          abi: mcOrientationAbi,
          msgValue: calPrice,
          params: {
            _nftAmount: amount,
          },
        }
  
        const transaction = await Moralis.executeFunction(options)
        const receipt = await transaction.wait()
        setIsLoading(false)
        setMintSuccessful(true)
        setEtherscanLink(`https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`)
        
        console.log(receipt)

      } catch (error) {
      setWarning(getParsedEthersError(error).context)
      //setWarning(error.error.message)
      console.log(warning)
      setIsLoading(false)
     
      }

    }


        const handleSetUsername = () => {
            try{
              if (user) {
                if (nickname) {
                  if (nickname.length < 16){
                    user.set('nickname', nickname)
                    user.save()
                    setNickname('')
                  } else {
                    console.log("Nickname too long. Has to less than 15 characters")
                    setWarning("Nickname too long. Has to less than 15 characters")
                  }
                } else {
                  console.log("Can't set empty nickname")
                  setWarning("Can't set empty nickmame")
                }
              } else {
                console.log('No user')
                setWarning("No user")
              }
            } catch(e) {
              console.error(e)
            }
          }

    

    

    return(
        <mcContext.Provider
            value={{
                authenticate,
                isAuthenticated,
                logout,
                user,
                enableWeb3,
                isWeb3Enabled,
                chainId,
                Moralis,
                currentAccount,
                setCurrentAccount,
                emailAddress, 
                setEmailAddress,
                isLoading, 
                setIsLoading,
                warning,
                setWarning,
                signUpSuccess,
                setSignUpSuccess,
                nftAmount,
                setnftAmount,
                AmountDue, 
                setAmountDue,
                mintSuccessful,
                setMintSuccessful,
                etherscanLink, 
                setEtherscanLink,
                signUp,
                mint,
                transactionSent, 
                setTransactionSent,



                }}
              >
                {children}
          </mcContext.Provider>
    )

    
}