import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import type { Transaction, Player } from "../interfaces"
import Web3 from 'web3';
import { useState } from 'react';

interface Props {
    transactions: Transaction[]
    price: number
}

function formatWallet(wallet: string) {
    return wallet.slice(0, 4) + "..." + wallet.slice(-4);
}
  
export default function Leaderboard({ transactions, price }: Props) {
    const [denomination, setDenomination] = useState<string>("MATIC")

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

    function changeDenomination() {
        denomination === 'MATIC' ? setDenomination('USD') : setDenomination('MATIC')
    }

    const total = players.reduce((a, b) => a + b.score, 0)

    return (
        <Layout title="Leaderboard | See where you rank">
            <div className="max-w-sm mx-auto w-full px-1 pb-36 pt-6 md:pt-0">
                <div className='mx-4'>
                    <div onClick={() => changeDenomination()} className='bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded flex justify-between text-white text-md rounded-md p-2 md:mb-8 cursor-pointer shadow-xl'>
                        <p className='text-left font-bold'>Total Earnings</p>
                        <p className='text-right font-bold'>{denomination === 'MATIC' ? total : (total * price).toFixed(2)} ${denomination}</p>
                    </div>
                </div>
                <div className='flex justify-between text-xl border-b-4 border-white pb-1 mb-4 mx-4 mt-4'>
                    <p className='text-left font-bold'>Player</p>
                    <p className='text-right font-bold'>Earnings</p>
                </div>
                <div className='md:h-96 md:overflow-y-auto px-4'>
                {
                    players.sort((a, b) => {
                        return b.score - a.score;
                      }).map((player, i) => (
                        <div key={i} className='flex justify-between pb-4 border-b-1 border-white'>
                            <p className='text-left'><span className='w-8 inline-block'>{i + 1}</span> {formatWallet(player.wallet)}</p>
                            <p className='text-right'>${denomination === 'MATIC' ? player.score : (player.score*price).toFixed(2)}</p>
                        </div>
                    ))
                }
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async ({  }) => {
    const web3 = new Web3('https://polygon-rpc.com')
    const POLY_API_KEY = process.env.POLY_API_KEY;

    let transactions = []
    try {
        const API_URL = `https://api.polygonscan.com/api?module=account&action=txlist&address=${process.env.WALLET_ID}&startblock=0&endblock=99999999&page=1&sort=des&apikey=${POLY_API_KEY}`
        const res = await fetch(API_URL, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        });
    
        const response = await res.json();
        transactions = response.result.filter((transaction: Transaction) => transaction.from === process.env.WALLET_ID).map((transaction: Transaction)  => {
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

    let price = 0.8
    try {
        const API_URL = `https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=${POLY_API_KEY}`
        const res = await fetch(API_URL, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        });
        const response = await res.json();
        price = parseFloat(response.result.maticusd)
    } catch(e) {
        console.log(e)
    }

    return {
        props: {
            transactions,
            price
        }
    }
}
  