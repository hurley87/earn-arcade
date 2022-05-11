import React, { ReactNode } from 'react'
import Head from 'next/head'
import Logo from './Logo';

import { ConnectButton } from '@rainbow-me/rainbowkit';


type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Arcade | Play games and earn $MATIC' }: Props) => (
  <div className='h-screen'>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className='flex justify-between w-full md:w-11/12 mx-auto py-4 px-2'>
      <Logo />
      <ConnectButton />
    </div>
    <div className='w-full md:w-11/12 mx-auto text-white'>
      {children}
    </div>
  </div>
)

export default Layout
