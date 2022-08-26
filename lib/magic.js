import { Magic } from 'magic-sdk'
import { ConnectExtension } from '@magic-ext/connect'

const createMagic = (key) => {
  const customNodeOptions = {
    rpcUrl: 'https://polygon-rpc.com', // Polygon RPC URL
    chainId: 137, // Polygon chain id
  }
  return (
    typeof window != 'undefined' &&
    new Magic(key, {
      network: customNodeOptions,
      extensions: [new ConnectExtension()],
    })
  )
}

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
