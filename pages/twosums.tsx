import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import RewardModal from '../components/W3rdle/RewardModal'
import Authenticated from '../components/Authenticated'

interface Keypad {
  status: string
  number: number
}

const calculateTimeLeft = (startTime: number) => {
  return startTime === 0 ? 0 : startTime + 1
}

const Home: NextPage = () => {
  const [numbers, setNumbers] = useState<number[]>([])
  const [keypad, setKeypad] = useState<Keypad[]>([
    { status: 'unknown', number: 0 },
    { status: 'unknown', number: 1 },
    { status: 'unknown', number: 2 },
    { status: 'unknown', number: 3 },
    { status: 'unknown', number: 4 },
    { status: 'unknown', number: 5 },
    { status: 'unknown', number: 6 },
    { status: 'unknown', number: 7 },
    { status: 'unknown', number: 8 },
    { status: 'unknown', number: 9 },
  ])
  const [picks, setPicks] = useState<number[]>([])
  const [displayPicks, setDisplayPicks] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState<number>(9)
  const [rewardModal, setRewardModal] = useState<boolean>(false)

  useEffect(() => {
    const numbers = [
      Math.floor(Math.random() * 8) + 1,
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ]
    setNumbers(numbers)
  }, [])

  useEffect(() => {
    if (picks.length > 0 && picks.length <= 6 && displayPicks.includes('_')) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(timeLeft))
      }, 1000)
      console.log(timer)
      return () => clearTimeout(timer)
    }
  })

  function pickNumber(number: number) {
    if (picks.length === 0) setTimeLeft(0)
    const picksToDisplay: string[] = []
    picks.push(number)
    numbers.map((number) =>
      picks.includes(number)
        ? picksToDisplay.push(number.toString())
        : picksToDisplay.push('_')
    )
    setRewardModal(!picksToDisplay.includes('_'))
    setPicks([...picks])
    setDisplayPicks([...picksToDisplay])
    if (numbers.includes(number)) {
      const updatedKeypad = keypad
      updatedKeypad[number]['status'] = 'right'
      setKeypad([...updatedKeypad])
    } else {
      const updatedKeypad = keypad
      updatedKeypad[number]['status'] = 'wrong'
      setKeypad([...updatedKeypad])
    }
  }

  function resetGame() {
    setNumbers([
      Math.floor(Math.random() * 8) + 1,
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 9),
    ])
    setDisplayPicks([])
    setPicks([])
    setKeypad([
      { status: 'unknown', number: 0 },
      { status: 'unknown', number: 1 },
      { status: 'unknown', number: 2 },
      { status: 'unknown', number: 3 },
      { status: 'unknown', number: 4 },
      { status: 'unknown', number: 5 },
      { status: 'unknown', number: 6 },
      { status: 'unknown', number: 7 },
      { status: 'unknown', number: 8 },
      { status: 'unknown', number: 9 },
    ])
    setTimeLeft(60)
  }

  function activeGame() {
    return picks.length < 6 && picks.length > 0 && displayPicks.includes('_')
  }

  function winner() {
    return picks.length > 0 && picks.length <= 6 && !displayPicks.includes('_')
  }

  function picksUI() {
    return !winner()
      ? displayPicks.map((pick, i) => (
          <span
            className={
              !numbers.includes(parseInt(pick)) && !activeGame()
                ? 'text-red-600'
                : ''
            }
            key={i}
          >
            {!numbers.includes(parseInt(pick)) && !activeGame()
              ? `${numbers[i]} `
              : pick + ' '}
          </span>
        ))
      : displayPicks.join(' ')
  }

  function startAgainBtn() {
    return (
      <span
        onClick={() => resetGame()}
        className="cursor-pointer text-pink-500 font-semibold border-b-2 border-pink-500"
      >
        Start again
      </span>
    )
  }

  return (
    <Authenticated>
      <Head>
        <title>Two Sums</title>
        <meta name="description" content="fun math game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center pt-8 max-w-xl mx-auto">
        <p className="text-md md:text-xl pt-4 mx-auto text-white px-6">
          Guess the number in six or fewer guesses. <br /> The{' '}
          <span className="text-pink-600">
            sum of the first three digits is{' '}
            <b>
              {numbers.slice(0, 3).reduce((partialSum, a) => partialSum + a, 0)}
            </b>
          </span>
          . <br /> The{' '}
          <span className="text-pink-600">
            sum of all five is{' '}
            <b>{numbers.reduce((partialSum, a) => partialSum + a, 0)}</b>
          </span>
          .
        </p>
        <div className="m-auto max-w-sm">
          <p className="text-6xl my-8">
            {displayPicks.length === 0 ? '_ _ _ _ _' : picksUI()}
          </p>
        </div>
        <div className="mb-8 grid grid-cols-5 gap-2 px-10 md:px-20">
          {keypad.map((key) => (
            <button
              key={key.number}
              onClick={() => pickNumber(key.number)}
              className={`${
                key.status === 'wrong'
                  ? 'bg-gray-700'
                  : key.status === 'right'
                  ? 'bg-green-500'
                  : 'bg-pink-700 hover:bg-pink-500'
              } md:p-3 p-2 py-4 rounded-md lg:text-xl sm:text-sm md:text-md font-bold transition-all md:min-w-[2.5rem] min-w-[1.85rem] text-white mt-1 mr-1`}
              disabled={
                key.status !== 'unknown' ||
                !(picks.length >= 0 && picks.length < 6) ||
                (picks.length > 0 && !displayPicks.includes('_'))
              }
            >
              {key.number}
            </button>
          ))}
        </div>
        <div className="text-md text-white">
          {picks.length === 0 ? null : activeGame() ? (
            <p>
              {6 - picks.length} {picks.length === 4 ? 'pick' : 'picks'}{' '}
              remaining.
            </p>
          ) : winner() ? (
            <div>You won! {startAgainBtn()}</div>
          ) : (
            <div>You lose! {startAgainBtn()}</div>
          )}
        </div>
      </div>
      <RewardModal open={rewardModal} onClose={() => setRewardModal(false)} />
    </Authenticated>
  )
}

export default Home
