import { useContext } from 'react'
import { UserContext } from '../lib/UserContext'
import Unauthenticated from '../components/Unathenticated'

const About = () => {
  const [user] = useContext(UserContext)

  return (
    <Unauthenticated title="Arcade Games">
      <div className="max-w-7xl p-8 mx-auto space-y-4 lg:py-16">
        <h3 className="text-lg font-extrabold">
          TODO: explain games, rewards and challenges. Include FAQ.
        </h3>
      </div>
    </Unauthenticated>
  )
}

export default About
