import { GetStaticProps } from 'next'
import Authenticated from '../components/Authenticated'
import type { Transaction, Player } from '../interfaces'
import Web3 from 'web3'
import { useEffect, useState } from 'react'

interface Props {
  transactions: Transaction[]
  price: number
}

function formatWallet(wallet: string) {
  return wallet.slice(0, 4) + '...' + wallet.slice(-4)
}

function isTimeStampToday(timeStamp: string) {
  const timeStampDate = new Date(parseInt(timeStamp) * 1000)
  const timeStampDay = timeStampDate.getDate()
  const timeStampMonth = timeStampDate.getMonth()
  const today = new Date()
  const todayDay = today.getDate()
  const todayMonth = today.getMonth()
  return timeStampDay === todayDay && timeStampMonth === todayMonth
}

function convertTransactionsToPlayers(transactions: Transaction[]) {
  const data: { [key: string]: number } = {}
  for (const i in transactions) {
    const transactionTo: string = transactions[i].to
    if (data[transactionTo]) {
      data[transactionTo] += 1
    } else {
      data[transactionTo] = 1
    }
  }

  const players: Player[] = []
  Object.keys(data).map((key) => {
    if (key !== '') {
      players.push({
        wallet: key,
        score: data[key],
      })
    }
  })

  return players
}

export default function Leaderboard({ transactions, price }: Props) {
  const [denomination, setDenomination] = useState<string>('MATIC')
  const [isDaily, setIsDaily] = useState<boolean>(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    setDaily()
  }, [transactions])

  function setLeaderboard(transactions: Transaction[], isDaily: boolean) {
    const players = convertTransactionsToPlayers(transactions)
    const total = players.reduce((a, b) => a + b.score, 0)
    setTotal(total)
    setPlayers(players)
    setIsDaily(isDaily)
  }

  function setDaily() {
    setLeaderboard(
      transactions.filter((transaction) =>
        isTimeStampToday(transaction.timeStamp)
      ),
      true
    )
  }

  function setAllTime() {
    setLeaderboard(transactions, false)
  }

  function changeDenomination() {
    denomination === 'MATIC' ? setDenomination('USD') : setDenomination('MATIC')
  }

  return (
    <Authenticated title="Leaderboard | See where you rank">
      <div className="max-w-sm mx-auto w-full px-1 pb-36 pt-6 md:pt-0">
        <div className="flex rounded-md shadow-sm mb-6 text-center px-4 shadow-xl">
          <div
            onClick={() => setDaily()}
            className={`w-1/2 py-2 text-sm ${
              isDaily
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-white hover:text-gray-200 border-b-2 border-white cursor-pointer'
            }`}
          >
            Daily
          </div>
          <div
            onClick={() => setAllTime()}
            className={`w-1/2 py-2 text-sm ${
              isDaily
                ? 'text-white hover:text-gray-200 border-b-2 border-white cursor-pointer'
                : 'text-pink-500 border-b-2 border-pink-500'
            }`}
          >
            All Time
          </div>
        </div>
        <div className="mx-4">
          <div
            onClick={() => changeDenomination()}
            className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded flex justify-between text-white text-md rounded-md p-2 md:mb-6 cursor-pointer shadow-xl"
          >
            <p className="text-left font-bold">Total Earnings</p>
            <p className="text-right font-bold">
              {denomination === 'MATIC' ? total : (total * price).toFixed(2)} $
              {denomination}
            </p>
          </div>
        </div>
        <div className="flex justify-between text-xl border-b-4 border-white pb-1 mb-4 mx-4 mt-4">
          <p className="text-left font-bold">Player</p>
          <p className="text-right font-bold">Earnings</p>
        </div>
        <div className="md:h-96 md:overflow-y-auto px-4">
          {players
            .sort((a, b) => {
              return b.score - a.score
            })
            .map((player, i) => (
              <div
                key={i}
                className="flex justify-between pb-4 border-b-1 border-white"
              >
                <p className="text-left">
                  <span className="w-8 inline-block">{i + 1}</span>{' '}
                  {formatWallet(player.wallet)}
                </p>
                <p className="text-right">
                  $
                  {denomination === 'MATIC'
                    ? player.score
                    : (player.score * price).toFixed(2)}
                </p>
              </div>
            ))}
        </div>
      </div>
    </Authenticated>
  )
}

export const getStaticProps: GetStaticProps = async ({}) => {
  const web3 = new Web3('https://polygon-rpc.com')
  const POLY_API_KEY = process.env.POLY_API_KEY

  let transactions = []
  try {
    const API_URL = `https://api.polygonscan.com/api?module=account&action=txlist&address=${process.env.WALLET_ID}&startblock=0&endblock=99999999&page=1&sort=des&apikey=${POLY_API_KEY}`
    const res = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    const response = await res.json()
    transactions = response.result
      .filter(
        (transaction: Transaction) => transaction.from === process.env.WALLET_ID
      )
      .map((transaction: Transaction) => {
        const value = parseInt(
          web3.utils.fromWei(transaction['value'], 'ether')
        )

        return {
          to: transaction['to'],
          from: transaction['from'],
          value,
          timeStamp: transaction['timeStamp'],
        }
      })
  } catch {}

  let price = 0.8
  try {
    const API_URL = `https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=${POLY_API_KEY}`
    const res = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const response = await res.json()
    price = parseFloat(response.result.maticusd)
  } catch {}

  return {
    props: {
      transactions,
      price,
    },
  }
}
