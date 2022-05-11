import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from 'web3';

export type Request = NextApiRequest

export default async function handler(
  req: Request,
  res: NextApiResponse
) {
    const web3 = new Web3('https://polygon-rpc.com')
    let privateKey:string = process.env.PRIVATE_KEY || '';
    web3.eth.accounts.wallet.add(privateKey);

    try {
        const balance = await web3.eth.getBalance(
            web3.eth.accounts.wallet[0].address
        );
        const amount = parseInt(web3.utils.fromWei(balance, 'ether'))
        return res.status(200).json({ amount });
    } catch {
        return res.status(400).json({ amount: 0 });
    }
}
