import Modal, { Props as ModalProps } from '../Modal'
import {
  useAccount,
} from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { trackGoal } from 'fathom-client';

export type Props = Pick<ModalProps, 'open' | 'onClose'>

export default function HelpModal(props: Props) {
  const { data: account } = useAccount() 
  const [transactionHash, setTransactionHash] = useState("")
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [noRewards, setNoRewards] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadRewards() {
      
        const res = await fetch("/api/matic", {
            body: JSON.stringify({
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });

        const response = await res.json();
        const noRewards = response.amount === 0;
        setNoRewards(noRewards)
    }
    loadRewards()
  })

  async function claimReward() {
    const address = account?.address;
    const reward = 1;
    setTransactionLoading(true)

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("/api/reward", {
        body: JSON.stringify({
          address,
          reward
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal
      });
      clearTimeout(id)

      const response = await res.json();
      const transactionHash = response.transactionHash;
      setTransactionHash(transactionHash)
      setTransactionLoading(false)
      trackGoal("2PYDAEBY", 0);
    } catch {
      setTransactionLoading(false)
      setError(true)
      const wallet: string = process.env.WALLET_ID || ""
      setTransactionHash(wallet)
      trackGoal("2BKN2Q8G", 0);
    }    
  }

  function playAgain() {
    window.location.reload();
  }

  return (
    <Modal title="Claim Your Reward" open={props.open} onClose={props.onClose}>
      <section className="grid gap-4">
        {
          !noRewards && transactionHash === "" &&  (
            <header className="grid gap-2 md:gap-3">
              <p className="text-sm text-slate-800 dark:text-slate-200 pb-2">
                Right now we are sending you 1 $MATIC! It may take a minute or so to get there.
              </p>
            </header>
          )
        }

        {
          account ? (
            <>
            {
              transactionLoading ? (
                <button onClick={() => alert("Hold tight! MATIC it on it's way. ")} className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded relative">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-4 border-white-900"></div>
                  </div>
                </button>
              ) : (
                <>
                  {
                    transactionHash !== "" ? (
                      <>
                        <button onClick={() => playAgain()} className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded">
                          <p>Play again</p>
                        </button>
                      </>
                    ) : (
                      <>
                      {
                        noRewards ? (
                          <div className=''>
                            <p>No rewards right now but there's more where that came from. Check back tomorrow.</p>
                            <button onClick={() => playAgain()} className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded mt-6 w-full">
                              <p>Play again</p>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => claimReward()} className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded">
                            <p>Claim 1 $MATIC</p>
                          </button>
                        )
                      }
                      </>

                    )
                  }
                </>
              )
            }
            </>
          ) : (
            <div className='bg-pink-500 hover:bg-pink-400 text-white text-lg font-bold py-0 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded mx-auto'>
               <ConnectButton />
            </div>
          )
        }
      </section>
    </Modal>
  )
}