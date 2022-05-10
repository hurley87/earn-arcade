import React, { ReactNode } from 'react'
import Head from 'next/head'
import {SiApplearcade} from 'react-icons/si'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Earn Arcade' }: Props) => (
  <div className='h-screen'>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className='flex justify-between w-full md:w-11/12 mx-auto py-4 px-2'>
      <Link href="/"><p className='text-2xl text-white text-center flex font-extrabold cursor-pointer'><SiApplearcade style={{position: 'relative', top: '2px', marginRight: '8px'}} />{" "}Arcade</p></Link>
      <ConnectButton />
    </div>
    <div className='w-full md:w-11/12 mx-auto text-white'>
      {children}
    </div>
    <footer className='h-15 absolute bottom-0 left-0 right-0'>
      <div className='text-center w-full lg:w-11/12 mx-auto px-4 text-white'>
        <p className='text-xs md:text-lg pb-4'>Built with help from <a className='text-pink-500 border-b-2 border-pink-500' href="https://www.milkroad.com/subscribe?ref=u40ryDPPBO" target="_blank">Milk Road</a></p>
      </div>
    </footer>
  </div>
)

export default Layout
