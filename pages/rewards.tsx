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
      <div className="max-w-7xl p-8 mx-auto space-y-4 lg:py-16">
        <h3 className="text-lg font-extrabold">
          {matic} $MATIC available. Occasionally, more rewards will be added.
        </h3>
      </div>
    </Authenticated>
  )
}

export default Rewards
