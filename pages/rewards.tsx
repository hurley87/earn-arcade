import Authenticated from '../components/Authenticated'
import { useEffect, useState } from 'react'

const Rewards = () => {
  const [matic, setMatic] = useState(0.0)

  useEffect(() => {
    async function loadMatic() {
      const res = await fetch('/api/matic', {
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const response = await res.json()
      setMatic(response.amount)
    }
    loadMatic()
  }, [])
  return (
    <Authenticated title="Arcade Games">
      <h3 className="text-4xl py-4 font-TerminalBold">Rewards</h3>
      <p>{matic} $MATIC available. Occasionally, more rewards will be added.</p>
    </Authenticated>
  )
}

export default Rewards
