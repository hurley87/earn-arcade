import Authenticated from '../components/Authenticated'

const Games = () => {
  return (
    <Authenticated title="Arcade Games">
      <>
        <h3 className="text-4xl py-4 font-TerminalBold">Games</h3>
        <div className="relative grid grid-cols-1 gap-8 py-4 mx-auto xs:grid-cols-2 md:grid-cols-4">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-600 rounded-lg shadow-inner"></div>
            <div className="relative h-full transition-translate ease-out duration-100 hover:translate-x-2 hover:translate-y-2">
              <a className="shadow-xl" href="/w3rdle">
                <div className="overflow-hidden rounded-lg bg-gray-800 h-full shadow-xl">
                  <div className="p-3 space-y-2">
                    <h3 className="text-2xl font-W95FA">W3rdle</h3>
                    <p className="text-white">
                      Guess the secret word in 6 tries or less. You'll get hints
                      along the way.
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
                    <h3 className="text-2xl font-W95FA">Two Sums</h3>
                    <p className="text-white">
                      Find a random 5 digit number in six or fewer guesses.
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </>
    </Authenticated>
  )
}

export default Games
