import React, { useEffect, useState, useContext } from "react"
import { mcContext } from "../context/mcContext"

import {
  ModalProvider,
  Modal,
  useModal,
  ModalTransition,
} from 'react-simple-hook-modal'

import Card from "./simplecard_onClick"
import SignUpModal from "./signUpModal"
import MintModal from "./mintModal"

export default function landingAction() {

  const useModal = () => {
    const [isShowing, setIsShowing] = useState(false);
  
    const toggle = () => {
      setIsShowing(!isShowing);
    }
  
    return [toggle, isShowing];
  }

  const [ modalToggleSignUp, isModalOpenSignUp ] = useModal()
  const [ modalToggleMint, isModalOpenMint ] = useModal()

  

  const {


  } =
  useContext(mcContext)

  


  return (
    <ModalProvider>
      <div className="flex flex-wrap gap-4 py-4 content-center items-center justify-center flex-grow">
            <div className="px-4 lg:px-0 lg:mx-auto">
              <Card
                title="Sign Up To Allowlist"
                text="Join the Founding Feathers today!"
                buttonText="SignUp"
                className="mt-4 border-8 outline-offset-4"
                onClickFunction1={modalToggleSignUp}
              />
              

            <Modal isOpen={isModalOpenSignUp} transition={ModalTransition.SCALE}>
              <SignUpModal
                //confirmButtonFunction={signUp}
                confirmButtonText = "Sign Up!"
                onClose={modalToggleSignUp}
                />
            </Modal>
            </div>

 


            <div className="px-4 lg:px-0 lg:mx-auto">
              <Card
                title="Mint NFT"
                text="Connect your wallet and mint ours NFTs"
                buttonText="Mint"
                className="mt-4 border-8 outline-offset-4"
                onClickFunction1={modalToggleMint}
              />

              <Modal isOpen={isModalOpenMint} transition={ModalTransition.SCALE}>
                <MintModal
                  //confirmButtonFunction={mint}
                  title = "Join our whitelist here!"
                  text =  "Please enter your email address"
                  confirmButtonText = "Mint"
                  onClose={modalToggleMint}
                  />
              </Modal>
  
            </div>

            <div className="px-4 lg:px-0 lg:mx-auto">
              <Card
                title="View MintClub NFT Collection"
                text="1st Generation on Opensea"
                buttonText="View Collection"
                buttonLink="https://testnets.opensea.io/collection/mint-club"
                className="mt-4 border-8 outline-offset-4"
              />
            </div>
          </div>
    </ModalProvider>
  )}