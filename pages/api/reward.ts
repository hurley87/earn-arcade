import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from 'web3';

export type Request = NextApiRequest

export default async function handler(
  req: Request,
  res: NextApiResponse
) {
    const { address, reward } = req.body;
    const web3 = new Web3('https://polygon-rpc.com')
    let privateKey:string = process.env.BANK_MONEY || '';
    web3.eth.accounts.wallet.add(privateKey);
    
    if (!address) {
      return res.status(400).json({ error: "Wallet is required" });
    }

    console.log(web3.eth.accounts.wallet[0].address)
    console.log(web3.utils.toWei(reward.toString(), 'ether'))

    const value = web3.utils.toWei(reward.toString(), 'ether')
    const from =  web3.eth.accounts.wallet[0].address;
    let gasPrice = await web3.eth.getGasPrice()
    console.log('GAS')
    console.log(gasPrice)
    gasPrice = parseInt((parseInt(gasPrice) * 1.2).toString()).toString()

    try {

      const transaction = {
        from,
        to: address,
        value,
        gas: 314150,
        gasPrice,
      }
      console.log(transaction)
      const receipt = await web3.eth
        .sendTransaction(transaction)
        .catch(err => {
          if (
            err
          ) {
            console.log("COOL ERROR")
            console.log(err)
            return res.status(400).json({ error: "No rewards are left today. Check back tomorrow!" });
          }
          throw err;
        });
      
      if(receipt) {
        const transactionHash = receipt.transactionHash
        res.status(200).json({ transactionHash })
      }
    } catch(e) {
      console.log('ERROR')
      console.log(e)
      return res.status(400).json({ error: "Wallet is required" });
    }
}
