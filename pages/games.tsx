import Authenticated from '../components/Authenticated'

const Games = () => {
  return (
    <Authenticated title="Arcade Games">
      <div className="max-w-7xl p-4 lg:px-8 mx-auto space-y-4 lg:py-16">
        <h3 className="text-lg font-extrabold">Games</h3>
        <div className="relative grid grid-cols-1 gap-8 py-4 mx-auto xs:grid-cols-2 md:grid-cols-4">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-600 rounded-lg shadow-inner"></div>
            <div className="relative h-full transition-translate ease-out duration-100 hover:translate-x-2 hover:translate-y-2">
              <a className="shadow-xl" href="/w3rdle">
                <div className="overflow-hidden rounded-lg bg-gray-800 h-full shadow-xl">
                  <div className="p-3 space-y-2">
                    <h3 className="font-bold truncate text-md">W3rdle</h3>
                    <p className="text-xs text-white">
                      In this tutorial we'll walk you through how to set up a
                      wallet and more importantly, what is a wallet.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-pink-600 rounded-lg shadow-inner"></div>
            <div className="relative h-full transition-translate ease-out duration-100 hover:translate-x-2 hover:translate-y-2">
              <a className="shadow-xl" href="/twosums">
                <div className="overflow-hidden rounded-lg bg-gray-800 h-full shadow-xl">
                  <div className="p-3 space-y-2">
                    <h3 className="font-extrabold truncate text-md">
                      Two Sums
                    </h3>
                    <p className="text-xs text-white">
                      In this tutorial we'll walk you through how to set up a
                      wallet and more importantly, what is a wallet.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default Games
