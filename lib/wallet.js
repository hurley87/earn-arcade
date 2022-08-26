import { ethers } from 'ethers'
import { Magic } from 'magic-sdk'

const createWallet = () => {
  if (typeof window != 'undefined') {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
    return new ethers.Wallet(process.env.BANK_MONEY, provider)
  }
}

export const wallet = createWallet()
