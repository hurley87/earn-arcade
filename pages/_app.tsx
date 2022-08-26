import type { AppProps } from 'next/app'
import '../styles/index.css'
import * as Fathom from 'fathom-client'
import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { UserContext } from '../lib/UserContext'
import { ThemeProvider } from '@magiclabs/ui'
import { Toaster } from 'react-hot-toast'

Router.events.on('routeChangeComplete', () => {
  Fathom.trackPageview()
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [user, setUser] = useState({})

  useEffect(() => {
    Fathom.load('JYEJRHHV', {
      includedDomains: ['earnarcade.xyz', 'www.earnarcade.xyz'],
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  return (
    <ThemeProvider>
      <UserContext.Provider value={[user, setUser]}>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default MyApp
