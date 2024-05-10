import React from "react"

import Header from "../components/header"
import Landing from "../components/landing"
import Content from "../components/content"
import LandingAction from "../components/landingAction"




const styles = {
  background: `min-h-screen w-full bg-gray-900 flex`,
  container: `container mx-auto bg-gray-900`,

}

export default function Home() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>

        <Header/>
        
        <div className="flex flex-wrap min-h-fit mx-auto">
          <Landing />
          <Content/>
          <LandingAction/>
        </div>


      </div>
    </div>
  )
}
