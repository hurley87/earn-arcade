import Link from 'next/link'
import Unauthenticated from '../components/Unathenticated'

const IndexPage = () => {
  return (
    <Unauthenticated>
      <div className="text-center pt-8">
        <h1 className="text-4xl md:text-6xl font-bold max-w-xl mx-auto pt-2 px-6">
          Get Paid to Play Games Online
        </h1>
        <p className="text-xl md:text-2xl pt-4">
          Create your wallet to get started.
        </p>
        <div className="max-w-md mx-auto">
          <Link href="/games">
            <button className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded mt-6 shadow-xl mr-4">
              Create wallet
            </button>
          </Link>
        </div>
      </div>
    </Unauthenticated>
  )
}

export default IndexPage
