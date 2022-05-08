import React, { ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Earn Arcade' }: Props) => (
  <div className='flex flex-col h-screen justify-between'>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
    <footer className='h-15'>
      <div className='text-center w-full lg:w-11/12 mx-auto px-2 text-white'>
        <p className='text-xs md:text-lg pb-4'>Built with help from <a className='text-pink-500 border-b-2 border-pink-500' href="https://www.milkroad.com/subscribe?ref=u40ryDPPBO" target="_blank">Milk Road</a></p>
      </div>
    </footer>
  </div>
)

export default Layout
