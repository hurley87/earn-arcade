import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from 'web3';

export type Request = NextApiRequest

export default async function handler(
  req: Request,
  res: NextApiResponse
) {
    const { address, reward } = req.body;
    const web3 = new Web3('https://polygon-rpc.com')
    let privateKey:string = process.env.PRIVATE_KEY || '';
    web3.eth.accounts.wallet.add(privateKey);
    
    if (!address) {
      return res.status(400).json({ error: "Wallet is required" });
    }

    try {
        const receipt = await web3.eth
        .sendTransaction({
          from: web3.eth.accounts.wallet[0].address,
          to: address,
          value: web3.utils.toWei(reward.toString(), 'ether'),
          gas: '314150',
          gasPrice: await web3.eth.getGasPrice(),
        })
        .catch(err => {
          console.log(err)
          if (
            err.message ===
            'Returned error: insufficient funds for gas * price + value'
          ) {
            throw new Error(
              'Faucet balance is too low, please try again later or consider donating (please!)',
            );
          }
          throw err;
        });
      
      const transactionHash = receipt.transactionHash
      console.log(transactionHash)

      res.status(200).json({ transactionHash })
    } catch {
        return res.status(400).json({ error: "Wallet is required" });
    }
}
