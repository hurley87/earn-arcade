import React, { ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className='flex flex-col h-screen justify-between'>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
    <footer className='h-10'>
      <div className='w-11/12 mx-auto px-4'>
        <p>Built with help from Milk Road. <a className='text-pink-500 border-b-2 border-pink-500' href="https://www.milkroad.com/subscribe?ref=u40ryDPPBO" target="_blank">Subscribe to Milk Road</a> for their smart, no-bullshit crypto updates that you can read in less than 5 minutes.</p>
      </div>
    </footer>
  </div>
)

export default Layout
