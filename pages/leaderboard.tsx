import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import type { Transaction, Player } from "../interfaces"
import Web3 from 'web3';

interface Props {
    transactions: Transaction[]
}

function formatWallet(wallet: string) {
    return wallet.slice(0, 4) + "..." + wallet.slice(-4);
}
  
  
export default function Leaderboard({ transactions }: Props) {
    const data: {[key:string]: number} = {}
    for (const i in transactions) {
        const transactionTo:string = transactions[i].to;
        if (data[transactionTo]) {
          data[transactionTo] += 1;
        } else {
          data[transactionTo] = 1;
        }
    }

    const players: Player[] = []
    Object.keys(data).map(key => {
        if(key !== "") {
            players.push({
                wallet: key,
                score: data[key]
            })
        }
    })

    return (
        <Layout title="Leaderboard | See where you rank">
            <div className="max-w-sm mx-auto w-full px-1 pb-36 pt-6 md:pt-0">
                <div className='bg-pink-500 w-full flex justify-between text-white text-2xl rounded-md p-2 mb-4'>
                    <p className='text-left font-bold'>Total</p>
                    <p className='text-right font-bold'>{players.reduce((a, b) => a + b.score, 0)} $MATIC</p>
                </div>
                <div className='flex justify-between text-xl border-b-4 border-white pb-1 mb-4'>
                    <p className='text-left font-bold'>Player</p>
                    <p className='text-right font-bold'>Earnings</p>
                </div>
                {
                    players.sort((a, b) => {
                        return b.score - a.score;
                      }).map((player, i) => (
                        <div key={i} className='flex justify-between pb-4 border-b-1 border-white'>
                            <p className='text-left'><span className='w-8 inline-block'>{i + 1}</span> {formatWallet(player.wallet)}</p>
                            <p className='text-right'>{player.score}</p>
                        </div>
                    ))
                }
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async ({  }) => {
    const web3 = new Web3('https://polygon-rpc.com')
    const POLY_API_KEY = process.env.POLY_API_KEY;

    let transactions = []

    try {
        const API_URL = `https://api.polygonscan.com/api?module=account&action=txlist&address=0x1A8912a243C2b70204f607F6CC20B94543664C30&startblock=0&endblock=99999999&page=1&sort=des&apikey=${POLY_API_KEY}`
        const res = await fetch(API_URL, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        });
    
        const response = await res.json();
        transactions = response.result.filter((transaction: Transaction) => transaction.from === "0x1a8912a243c2b70204f607f6cc20b94543664c30").map((transaction: Transaction)  => {
            const value = parseInt(web3.utils.fromWei(transaction['value'], 'ether'))
            return {
                to: transaction['to'],
                from: transaction['from'],
                value,
                timeStamp: transaction['timeStamp'],
            }
        })
        
    } catch(e) {
        console.log(e)
    }


    return {
        props: {
            transactions,
        }
    }
}
  