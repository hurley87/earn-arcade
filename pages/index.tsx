import Layout from '../components/Layout'


const IndexPage = () => {
  return (
    <Layout title="Arcade">
      <h1 className='text-5xl md:text-6xl'>Get Paid to Play Games Online</h1>
      <p className='text-xl md:text-2xl pt-2'>Imagine a world where you can get paid to play games like Wordle.</p>
      <p className='text-xl md:text-2xl'>That's the world we're building. <b>Launching May 8th.</b></p>
      <p className='text-xl md:text-2xl pt-8'>Check out our first game called, <a className='text-blue-500 border-b-2 border-blue-500' href="/hodle">hodle</a>. Follow <a className='text-blue-500 border-b-2 border-blue-500' href="https://twitter.com/davidhurley87" target="_blank">@davidhurley87</a> for the latest.</p>
    </Layout>
  )
}

export default IndexPage
