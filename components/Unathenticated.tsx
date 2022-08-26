import React, { ReactNode } from 'react'
import Head from 'next/head'
import Nav from './Navigation'

type Props = {
  children?: ReactNode
  title?: string
  user?: any
}

const Unauthenticated = ({
  children,
  title = 'Arcade | Play games and earn $MATIC',
}: Props) => {
  return (
    <div className="h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav />
      <div className="w-full md:w-11/12 mx-auto text-white pt-6 md:pt-0">
        {children}
      </div>
    </div>
  )
}

export default Unauthenticated
