import Modal, { Props as ModalProps } from '../Modal'
import {
  useAccount,
} from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';


export type Props = Pick<ModalProps, 'open' | 'onClose'>

export default function HelpModal(props: Props) {
  const { data: account } = useAccount()

  console.log("ACCOUNT")
  console.log(account) 

  return (
    <Modal title="Claim Your Reward" open={props.open} onClose={props.onClose}>
      <section className="grid gap-4">
        <header className="grid gap-2 md:gap-3">
          <p className="text-sm text-slate-800 dark:text-slate-200">
            It's not built yet but you'll be able to win daily prizes of MATIC. There'll be a limited amount of rewards each day, so make sure you earn MATIC before it runs out!
          </p>
        </header>
        {
          account ? (
            <button onClick={() => alert("coming soon")} className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded">
              Claim 1 $MATIC
            </button>
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