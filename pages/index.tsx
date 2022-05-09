import Layout from '../components/Layout'
import Link from 'next/link'

const IndexPage = () => {
  return (
    <Layout title="Arcade">
      <div className='text-center pt-12'>
        <h1 className='text-4xl md:text-6xl font-bold max-w-xl mx-auto'>Get Paid to Play Games Online</h1>
        <p className='text-xl md:text-2xl pt-4'>Solve Puzzles and Earn $MATIC.</p>
        <Link href="/wordle">
          <button className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded mt-6">
            Solve Wordle and earn 1 $MATIC
          </button>
        </Link>
      </div>
    </Layout>
  )
}

export default IndexPage
