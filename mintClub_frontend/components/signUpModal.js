import React, { useEffect, useState, useContext } from "react"
import { mcContext } from "../context/mcContext"
import ReactDOM from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faExclamation,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"

import Transition from "./transition"
import Button from "./button"
import Input from "./inputGroup_mod"
import ChevronDots from '../components/chevronDots_mod'
//import Link from "next/link"

import { IoIosClose } from 'react-icons/io'
import { BounceLoader } from 'react-spinners'
import validator from 'validator'
import { ConnectButton } from '@web3uikit/web3'
import "react-step-progress-bar/styles.css";
//import { ProgressBar, Step } from "react-step-progress-bar";



function signUpModal({
  className = "",
  title = "",
  text = "",
  confirmButtonText = "OK",
  showCancelButton = false,
  cancelButtonText = "Cancel",
  type = "",
  reverseButtons = false,
  onClose = () => {},
  confirmButtonFunction = () => {},
  ...newProps
}) {

  const [show, setShow] = useState(false)
  const [inputError, setInputError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const {
    isAuthenticated,
    currentAccount,
    isLoading,
    setIsLoading,
    transactionSent, 
    setTransactionSent,
    etherscanLink, 
    setEtherscanLink,
    emailAddress, 
    setEmailAddress,
    warning,
    setWarning,
    signUpSuccess,
    setSignUpSuccess,
    signUp,


  } =
  useContext(mcContext)


  useEffect(() => {
    //checkInput(emailAddress)
    setTimeout(() => setShow(true), 1)
    document.body.style.overflow = "hidden"
    return () => (document.body.style.overflow = "unset")
  }, [emailAddress, inputError])

  const slowClose = (result = false) => {
    setShow(false)
    setTimeout(() => onClose(result), 150)
  }


  /*const checkInput = (emailInput) => {
    (validator.isEmail(emailInput)) ? (
      setInputError('')
    ):(
      setInputError('Invalid email')
    )
  }*/

  const sendTransaction = (emailInput, walletAddressInput) => {
    if ((validator.isEmail(emailInput)) == true) {
        signUp(emailInput, walletAddressInput)
        setIsLoading(true)
        setTransactionSent(true)
        setInputError('')
        setCurrentStep(1)
    } else {
        setInputError('Invalid email')
    }
  }


  const signUpModalPage = () => {

    if (isLoading == true){

      return (
        <div
          className="bg-white w-11/12 max-w-md h-3/6 flex items-center justify-center rounded-lg"
        >
              <BounceLoader color='green'/>
              <p1 className='ml-2'> Signing Up.... </p1>
        </div>
      )
    }
    else {

      if (!isAuthenticated){

        return(

          <div
            className={`${className} bg-white w-11/12 max-w-md text-center rounded-lg shadow-lg`}
            {...newProps}
          >
            <div className="w-full h-[50px] flex items-center justify-end mb-[20px]">
              <IoIosClose
                onClick={() => {
                    setEmailAddress('')
                    setEtherscanLink('')
                    setInputError('')
                    setTransactionSent(false)
                    setCurrentStep(1)
                    onClose()
                    slowClose()
                }}
                fontSize={50}
                className='cursor-pointer'
              />
            </div>
            
            

            <div className="w-1/2 mx-auto">
                <ChevronDots
                steps={["Connect Wallet", "SignUp"]}
                currentStep={currentStep}
                //onStepClick={step => setCurrentStep(step)}
                />
            </div>

            <div className="pt-12"></div>
            
            <div className="px-4 mb-4">
                <h2 className="text-3xl font-medium">Connect your wallet</h2>
                    <p className="mt-2 w-10/12 max-w-6xl max-w-full mx-auto text-gray-800 text-base">
                     Please use the connect wallet button to connect your wallet
                    </p>
            </div>
            <div className="w-12 h-12 rounded-sm flex justify-center items-center mb-4 mx-auto">
  
                <ConnectButton />
            </div>

          </div>

        )

      } else {

        switch(true){

          case warning.length != 0:
            return(
              <div className={`${className} bg-white w-11/12 max-w-md text-center rounded-lg shadow-lg`}
              {...newProps}>
                <div className="pt-12"></div>
                <div className="w-12 h-12 rounded-sm flex justify-center items-center bg-red-300 mb-4 mx-auto">
                  <FontAwesomeIcon icon={faTimes} className="text-2xl text-red-700" />
                </div>
                <div className="px-4 mb-4">
                  <h2 className="text-3xl font-medium">Unsuccessful</h2>
                    <p className="mt-2 w-10/12 max-w-6xl max-w-full mx-auto text-gray-800 text-base">
                        {warning}
                    </p>
                </div>
                <div
                  className={`flex mt-10 justify-center py-4 px-4 border-t border-gray-300 ${
                    reverseButtons && " flex-row-reverse"
                  }`}
                >
                  {showCancelButton && (
                    <Button
                      onClick={slowClose}
                      text={cancelButtonText}
                      className="mx-4"
                      type="secondary"
                    />
                  )}
                  <Button
                    onClick={() =>{
                      onClose()
                      slowClose()
                      setWarning('')
                      setEtherscanLink('')}
                    }
                    text='OK'
                    className={`mx-4 ${!showCancelButton && " w-full"}`}
                    type="primary"
                  />
                </div>
              </div>
            )
          
          case signUpSuccess:
            return (
              <div
                className={`${className} bg-white w-11/12 max-w-md text-center pt-10 rounded-sm shadow-lg`}
                {...newProps}
              >
                <div className="w-12 h-12 rounded-sm flex justify-center items-center bg-green-300 mb-4 mx-auto">
                  <FontAwesomeIcon icon={faCheck} className="text-2xl text-green-700" />
                </div>
                <div className="px-4 mb-4">
                  <h2 className="text-3xl font-medium">Successful</h2>
                    <p className="mt-2 w-10/12 max-w-6xl max-w-full mx-auto text-gray-800 text-base">
                        You have successfully Signed Up the whitelist!
                    </p>
                </div>
                <div
                  className={`flex mt-10 justify-center py-4 px-4 border-t border-gray-300 ${
                    reverseButtons && " flex-row-reverse"
                  }`}
                >
                  {showCancelButton && (
                    <Button
                      onClick={slowClose}
                      text={cancelButtonText}
                      className="mx-4"
                      type="secondary"
                    />
                  )}
                  <Button
                    onClick={() => {
                      onClose()
                      slowClose()
                      setSignUpSuccess(false)
                      setEtherscanLink('')}
                    }
                    text='OK'
                    className={`mx-4 ${!showCancelButton && " w-full"}`}
                    type="primary"
                  />
                </div>


            </div>

            )
          
          default:
            return (
              <div
                className={`${className} bg-white w-11/12 max-w-md text-center  rounded-lg shadow-lg`}
                {...newProps}
              >
                <div className="w-full h-[50px] flex items-center justify-end mb-[20px]">
                  <IoIosClose
                    onClick={() => {
                        setEmailAddress('')
                        slowClose()
                        setEtherscanLink('')
                        setInputError('')
                        setTransactionSent(false)
                        setCurrentStep(1)
                        onClose()
    
                    }}
                    fontSize={50}
                    className='cursor-pointer'
                  />
                </div>
    
                <div className="w-1/2 mx-auto">
                    <ChevronDots
                    steps={["Connect Wallet", "SignUp"]}
                    currentStep={2}
                    //onStepClick={step => setCurrentStep(step)}
                    />
                </div>
    
                <div className="pt-12"></div>
    
                {
                  <div className="px-4 mb-4">
                    <h2 className="text-3xl font-medium">Join our whitelist here!</h2>
                    
                      <p className="mt-2 w-10/12 max-w-6xl max-w-full mx-auto text-gray-800 text-base">
                        Please enter your email address
                      </p>
                 
    
                    <Input
                        name="email"
                        //label="Email Address"
                        className = "mt-2"
                        onChange={e => setEmailAddress(e.target.value)}
                        value={emailAddress}
                        errorText={inputError}
                      />
    
                      <p className="mt-2 w-10/12 max-w-6xl max-w-full mx-auto text-gray-800 text-base">
                        {currentAccount ? (`Address to be registered: ${currentAccount}`):(``)}
                      </p>
                  </div>
                }
                <div
                  className={`flex mt-10 justify-center py-4 px-4 border-t border-gray-300 ${
                    reverseButtons && " flex-row-reverse"
                  }`}
                >
                  {showCancelButton && (
                    <Button
                      onClick={slowClose}
                      text={cancelButtonText}
                      className="mx-4"
                      type="secondary"
                    />
                  )}
                  <Button
                    onClick={() => {
                        sendTransaction(emailAddress, currentAccount)
                        }}
                    text={confirmButtonText}
                    className={`mx-4 ${!showCancelButton && " w-full"}`}
                    type="primary"
                    //disabled = {inputError}
                  />
                </div>
              </div>
            )

          


        }

        

      }


    }

  }

  const el = (

    <>
      <Transition show={show}>
        <Transition
          enter="transition-opacity duration-150 linear transform"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150 linear transform"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed top-0 left-0 w-screen h-screen z-50 bg-blue-800 bg-opacity-75 origin-center flex justify-center items-center"
          >
            <Transition
              enter="transition-transform duration-300 ease-out transform"
              enterFrom="-translate-y-64"
              enterTo="translate-y-0"
              leave="transition-transform duration-300 ease-out transform"
              leaveFrom="-translate-y-64"
              leaveTo="translate-y-0"
            >

            {signUpModalPage()}

            </Transition>
          </div>
        </Transition>
      </Transition>
    </>
  )
  return ReactDOM.createPortal(el, document.body)
}

export default signUpModal