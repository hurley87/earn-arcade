import Modal, { Props as ModalProps } from '../Modal'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'

export type Props = Pick<ModalProps, 'open' | 'onClose'>

export default function HelpModal(props: Props) {
  const { data: account } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

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
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => disconnect()}>Disconnect</button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                {connectors.filter((c) => c.ready === true).map((connector) => (
                  <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect(connector)}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                  >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isConnecting &&
                      connector.id === pendingConnector?.id &&
                      ' (connecting)'}
                  </button>
                ))}
              </div>
              {error && <div className='w-full text-center'>{error.message}</div>}
            </>
          )
        }
      </section>
    </Modal>
  )
}