import React from "react";

export default function content() {
  return (
    <div className="flex flex-wrap min-h-fit lg:gap-2 flex-grow">
          <div className="hidden lg:block w-5/12 min-h-full">
            <img
              src="https://images.unsplash.com/photo-1500672860114-9e913f298978?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full lg:min-h-fit lg:w-5/12 py-8 lg:py-32 flex-grow relative">
            <div className="container relative mx-auto">
              <div className="w-full lg:w-8/12 lg:px-4 lg:ml-auto lg:mr-auto lg:text-left text-center">
                
                <h1 className="text-white font-semibold text-5xl">
                      Mint your NFT with us today.
                </h1>
                <div className=" lg:hidden h-64 py-4 flex-grow mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1500672860114-9e913f298978?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="mt-2 text-lg text-gray-300">
                          This is a very special and unique NFT collaborated with Crazy Shit.
                </p>
              </div>
            </div>
          </div>
        </div>

  )}