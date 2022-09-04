import { useContext } from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { magic } from '../lib/magic'
import Logo from './Logo'
import { useRouter } from 'next/router'
import { UserContext } from '../lib/UserContext'
import * as blockies from 'blockies-ts'
import Web3 from 'web3'
import toast from 'react-hot-toast'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
  const router = useRouter()
  const [user, setUser] = useContext(UserContext)

  const showWallet = () => {
    try {
      magic.connect.showWallet().catch((e) => console.log(e))
    } catch {}
  }

  const login = async () => {
    const provider: any = magic.rpcProvider
    const web3 = new Web3(provider)
    try {
      const accounts = await web3.eth.getAccounts()
      const address = accounts[0]
      const balance = await web3.eth.getBalance(address)
      setUser({ loading: false, address, balance })
    } catch {
      toast.error('Create a wallet first.')
      setUser({ loading: false })
    }
  }

  const navigation = [
    // { name: 'About', href: '/about' },
    { name: 'Games', href: '/games' },
    { name: 'Rewards', href: '/rewards' },
    // { name: 'Challenges', href: '/challenges' },
  ]

  return (
    <Disclosure as="nav" className="bg-transparent">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white border border-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Logo />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          router.asPath === item.href
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={
                          router.asPath === item.href ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    {user?.loading ? (
                      <div className="animate-pulse h-8 w-8 rounded-full bg-gray-500"></div>
                    ) : user?.address ? (
                      <Menu.Button
                        onClick={() => showWallet()}
                        className="bg-transparent flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        <span className="sr-only">Open user menu</span>

                        <img
                          className="h-8 w-8 rounded-full"
                          src={blockies
                            .create({ seed: user.address })
                            .toDataURL()}
                          alt=""
                        />
                      </Menu.Button>
                    ) : (
                      <Menu.Button
                        onClick={() => login()}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-pink-600 text-white"
                      >
                        Get Started
                      </Menu.Button>
                    )}
                  </div>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    router.asPath === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={
                    router.asPath === item.href ? 'page' : undefined
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
