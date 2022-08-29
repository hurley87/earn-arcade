import React, { ReactNode, useContext, useEffect } from 'react'
import Head from 'next/head'
import { UserContext } from '../lib/UserContext'
import { magic } from '../lib/magic'
import Web3 from 'web3'
import Loading from './Loading'
import toast from 'react-hot-toast'
import Nav from './Navigation'
import { ethers } from 'ethers'

type Props = {
  children?: ReactNode
  title?: string
  user?: any
}

const Layout = ({
  children,
  title = 'Arcade | Play games and earn $MATIC',
}: Props) => {
  const [user, setUser] = useContext(UserContext)

  useEffect(() => {
    setUser({ loading: true })
    login()
  }, [])

  const login = async () => {
    const provider: any = magic.rpcProvider
    const web3 = new Web3(provider)
    try {
      const accounts = await web3.eth.getAccounts()
      const address = accounts[0]
      const maticBalance = await web3.eth.getBalance(address)
      const balance = parseFloat(ethers.utils.formatEther(maticBalance))
      setUser({ loading: false, address, balance })
    } catch {
      toast.error('Create a wallet first.')
      setUser({ loading: false })
    }
  }

  return (
    <div className="h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav />

      {user.address && (
        <div className="w-full md:w-11/12 mx-auto text-white pt-6 md:pt-0">
          {children}
        </div>
      )}

      {user && user.loading && (
        <div className="h-screen flex items-center justify-center pb-32">
          <div className="mx-auto max-w-md">
            <Loading />
          </div>
        </div>
      )}

      {user && !user.loading && !user.address && (
        <div className="text-center pt-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold max-w-xl mx-auto pt-2">
            You'll need a wallet for rewards.
          </h1>
          <p className="text-xl md:text-2xl pt-4 max-w-md mx-auto">
            You can create a wallet using your email or existing crypto wallet.
          </p>
          <div className="max-w-md mx-auto">
            <button
              onClick={login}
              className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded mt-6 shadow-xl mr-4"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
