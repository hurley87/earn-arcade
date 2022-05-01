import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
    <footer>
      <p>Built with help from Milk Road. <a href="https://www.milkroad.com/subscribe?ref=u40ryDPPBO" target="_blank">Subscribe to Milk Road</a> for their smart, no-bullshit crypto updates that you can read in less than 5 minutes.</p>
    </footer>
  </div>
)

export default Layout
