import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { McProvider } from '../context/mcContext'
import { ModalProvider } from 'react-simple-hook-modal'

function MyApp({ Component, pageProps }) {


  return (

    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_APPID}
      serverUrl={process.env.REACT_APP_SERVERURL}
    >
      <McProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </McProvider>
    </MoralisProvider>

  )
}

export default MyApp
