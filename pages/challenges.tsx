import Authenticated from '../components/Authenticated'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/UserContext'

const Challenges = () => {
  const [user] = useContext(UserContext)

  console.log(user)

  return (
    <Authenticated title="Arcade Games">
      <h3 className="text-lg font-extrabold">
        You have You need at least 1 $MATIC to create a challenge.
      </h3>
    </Authenticated>
  )
}

export default Challenges
