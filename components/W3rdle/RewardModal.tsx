import Modal, { Props as ModalProps } from '../Modal'
import { useContext, useEffect, useState } from 'react'
import { trackGoal } from 'fathom-client'
import { UserContext } from '../../lib/UserContext'
import Link from 'next/link'

export type Props = Pick<ModalProps, 'open' | 'onClose'>

export default function HelpModal(props: Props) {
  const [user] = useContext(UserContext)
  const [transactionHash, setTransactionHash] = useState('')
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [noRewards, setNoRewards] = useState(false)

  useEffect(() => {
    async function loadRewards() {
      const res = await fetch('/api/matic', {
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const response = await res.json()
      const noRewards = response.amount === 0
      setNoRewards(noRewards)
    }
    loadRewards()
  })

  async function claimReward() {
    const address = user?.address
    const reward = 1
    setTransactionLoading(true)

    try {
      const res = await fetch('/api/reward', {
        body: JSON.stringify({
          address,
          reward,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const response = await res.json()
      console.log(response)
      setTransactionLoading(false)
      const transactionHash = response.transactionHash
      setTransactionHash(transactionHash)
      trackGoal('2PYDAEBY', 0)
    } catch (e) {
      console.log(e)
      setTransactionLoading(false)
      const wallet: string = process.env.WALLET_ID || ''
      setTransactionHash(wallet)
      trackGoal('2BKN2Q8G', 0)
    }
  }

  function playAgain() {
    window.location.reload()
  }

  return (
    <Modal title="Claim Your Reward" open={props.open} onClose={props.onClose}>
      <section className="grid gap-4">
        {!noRewards && transactionHash === '' && (
          <header className="grid gap-2 md:gap-3">
            <p className="text-sm text-slate-800 dark:text-slate-200 pb-2">
              Right now we are sending you 1 $MATIC! It may take a minute or so
              to get there.
            </p>
          </header>
        )}

        {user.balance > 5 ? (
          <>
            <p className="pb-2">
              You have enough to challenge someone! You can challenge a friend{' '}
              <Link href="/challenges">
                <span className="border-b-2 border-pink-500 text-pink-500 cursor-pointer">
                  here
                </span>
              </Link>
              .
            </p>
          </>
        ) : (
          <>
            {transactionLoading ? (
              <button
                onClick={() => alert("Hold tight! MATIC it on it's way. ")}
                className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded relative"
              >
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-4 border-white-900"></div>
                </div>
              </button>
            ) : (
              <>
                {transactionHash !== '' ? (
                  <>
                    <p className="pb-2">
                      Money sent! You can verify your reward by taking a look at
                      the{' '}
                      <a
                        target={'_blank'}
                        className="border-b-2 border-pink-500 text-pink-500"
                        href={`https://polygonscan.com/tx/${transactionHash}`}
                      >
                        reward transaction on Polygon.
                      </a>
                    </p>
                    <button
                      onClick={() => playAgain()}
                      className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded"
                    >
                      <p>Play again</p>
                    </button>
                  </>
                ) : (
                  <>
                    {noRewards ? (
                      <div className="">
                        <p>
                          No rewards right now but there's more where that came
                          from. Check back tomorrow.
                        </p>
                        <button
                          onClick={() => playAgain()}
                          className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded mt-6 w-full"
                        >
                          <p>Play again</p>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => claimReward()}
                        className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded"
                      >
                        <p>Claim 1 $MATIC</p>
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </section>
    </Modal>
  )
}
