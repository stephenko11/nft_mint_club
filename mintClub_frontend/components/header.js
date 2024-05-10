import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faBars,
  faTimes,
  faBriefcase,
  faBookmark,
  faUser,
  faClockRotateLeft,

} from "@fortawesome/free-solid-svg-icons"


import { ConnectButton } from '@web3uikit/web3'


const navigation = [
  { title: "Home", icon: faHome, path: "/" },
  { title: "About", icon: faBriefcase, path: "/" },
  { title: "NFTs", icon:faBookmark, path: "/" },
  { title: "MC Coins", icon:faUser, path: "/" },
  { title: "News", icon:faClockRotateLeft, path: "/" }
]

function header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex items-center h-20 px-6 justify-between shadow-sm bg-white relative z-50 sticky top-0">
      <a className="flex-1 no-underline block h-8 min-w-fit">
        <img
          src="https://gustui.s3.amazonaws.com/gustlogo.png"
          className="h-full"
        />
      </a>

      <div className="flex-none hidden lg:flex lg:justify-center lg:h-full ">
      {
          navigation.map((item, idx) => {
            return (
              <a
                  key={idx}
                  href={item.path}
                  className="block h-full flex items-center mx-1 px-2 border-b-2 border-transparent transition-colors duration-300 ease-in-out hover:text-blue-400"
              >
                  <FontAwesomeIcon icon={item.icon} key = {item.title} className="mr-4 mt-1" />
                    {item.title}
                  </a>
                  )
              })
        }  
      </div>

      <div className="flex-1 items-center justify-end hidden lg:flex">
        <ConnectButton/>
      </div>



      <FontAwesomeIcon
        icon={mobileOpen ? faTimes : faBars}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="text-black text-3xl cursor-pointer lg:hidden"
      />
      {mobileOpen && (
        <div className="bg-white absolute top-full left-0 flex flex-col w-full py-8 shadow-sm lg:hidden">
          <div className="flex-1 flex flex-col items-center text-xl">
          {
            navigation.map((item, idx) => {
              return (
                <a
                    key={idx}
                    href={item.path}
                    className="no-underline px-2 my-2 font-medium hover:text-blue-400"
                >
                    <FontAwesomeIcon icon={item.icon} key = {item.title} className="mr-4 mt-1" />
                      {item.title}
                    </a>
                    )
                })
          } 
            
            <ConnectButton />
          </div>
        </div>
      )}
    </div>
  )
}

export default header