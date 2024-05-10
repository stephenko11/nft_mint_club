import React from "react"

import Button from "./button"

function SimpleCard({
  className = "",
  image = "",
  title = "",
  text = "",
  buttonText = null,
  buttonLink = "",
  html = null,
  onClickFunction1 = ()=>{},
  onClickFunction2 = ()=>{},
  ...newProps
}) {
  let finalClass = `${className} w-72 max-w-full border border-gray-300 rounded-lg bg-white`
  return (
    <div className={finalClass}>
      {image && (
        <div className="w-full h-48">
          <img src={image} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        {title && <h5 className="text-lg font-medium">{title}</h5>}
        {text && <p className={`${title && "mt-2"}`}>{text}</p>}
        {html}
        {buttonText && (
          <div className="mt-4 flex">
            <Button 
            text={buttonText} 
            link={buttonLink} 
            full="true"
            className="bg-green-500"
            onClick = {()=>{
              onClickFunction1()
              onClickFunction2()
            }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleCard