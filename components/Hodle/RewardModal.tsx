import Modal, { Props as ModalProps } from '../Modal'
import {
  useAccount,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
import { getAccount } from '@wagmi/core';


export type Props = Pick<ModalProps, 'open' | 'onClose'>

export default function HelpModal(props: Props) {
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })

  const otherAccount = getAccount()
  console.log("ACCOUNTS")
  console.log(account) 
  console.log(otherAccount)

  return (
    <Modal title="Claim Your Reward" open={props.open} onClose={props.onClose}>
      <section className="grid gap-4">
        <header className="grid gap-2 md:gap-3">
          <p className="text-sm text-slate-800 dark:text-slate-200">
            It's not built yet but you'll be able to win daily prizes of ETH. There'll be a limited amount of rewards each day, so make sure you earn your ETH before it runs out!
          </p>
        </header>
        {
          account ? (
            <div className="grid gap-4 py-4">
              {
                ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />
              }
              <div>
                {ensName ? `${ensName} (${account.address})` : account.address}
              </div>
              <div>Connected to {account?.connector?.name}</div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              Connect your wallet before claiming your reward.
            </div>
          )
        }
      </section>
    </Modal>
  )
}