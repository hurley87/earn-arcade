import { useContext, useEffect, useState } from 'react'
import Grid from '../components/W3rdle/Grid'
import Keyboard, { isMappableKey } from '../components/W3rdle/Keyboard'
import { findLastNonEmptyTile } from '../utils/Hodle/helpers'
import { makeEmptyGrid, getRowWord, getNextRow } from '../utils/Hodle/helpers'
import * as api from '../utils/Hodle/api'
import { flatten } from 'ramda'
import Authenticated from '../components/Authenticated'
import { trackGoal } from 'fathom-client'
import toast from 'react-hot-toast'
import RewardModal from '../components/W3rdle/RewardModal'
import { UserContext } from '../lib/UserContext'
import { ethers } from 'ethers'
import { magic } from '../lib/magic'
import Head from 'next/head'

export default function W3rdle() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const game = day + '-' + month + '-' + year + '-w3rdle'
  const [user, setUser] = useContext(UserContext)
  const emptyGrid = makeEmptyGrid()
  const [grid, setGrid] = useState(emptyGrid)
  const [cursor, setCursor] = useState({ y: 0, x: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [secret, setSecret] = useState('')
  const [isWinner, setIsWinner] = useState(false)
  const [startTime, setStartTime] = useState(date.getTime())
  const [endTime, setEndTime] = useState(date.getTime())
  const [rewardModal, setRewardModal] = useState(false)
  const [hasMatic, setHasMatic] = useState(false)

  useEffect(() => {
    async function loadGame() {
      setIsLoading(true)
      const result = await api.getSecretWord()
      setSecret(result.secret)
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      setIsLoading(false)
    }
    loadGame()
  }, [user])

  function insert(key: string) {
    const newGrid = grid
    const row = grid[cursor.y]
    const tile = row[cursor.x]
    const isLastColumn = cursor.x === row.length - 1

    newGrid[cursor.y][cursor.x] = {
      ...tile,
      children: key,
    }
    setGrid([...newGrid])

    if (!isLastColumn) {
      const newCursor = {
        y: cursor.y,
        x: cursor.x + 1,
      }
      setCursor(newCursor)
    }
  }

  function deleteGuess() {
    const newGrid = grid
    const lastNonEmptyTile = findLastNonEmptyTile(grid[cursor.y])

    if (!lastNonEmptyTile) {
      return
    }

    const newCursor = lastNonEmptyTile.cursor
    setCursor(newCursor)
    const { y, x } = newCursor
    const target = newGrid[y][x]

    target['children'] = ''
    target['variant'] = 'empty'

    setGrid([...newGrid])
  }

  async function handleKeyPress(key: string) {
    if (!isMappableKey(key)) {
      insert(key)
      return
    }
    switch (key) {
      case 'backspace':
        deleteGuess()
        break
      case 'enter':
        await guess()
        break
    }
  }

  async function guess() {
    if (cursor.x !== grid[0].length - 1) {
      return { status: 'playing' }
    }

    const guessWord = getRowWord(grid[cursor.y])

    if (guessWord.length !== 5) {
      return {
        status: 'playing',
      }
    }

    try {
      const result = await api.verifyWord(guessWord)
      if (!result.valid) {
        toast.error(`Not in word list: ${guessWord}`, {
          position: 'top-center',
        })
        return {
          status: 'playing',
        }
      }
    } catch {}

    const won = secret === guessWord
    const attempts = cursor.y + 1
    const isLastRow = cursor.y === grid.length - 1
    const newGrid = grid

    newGrid[cursor.y] = getNextRow(newGrid[cursor.y], secret)

    setGrid([...newGrid])

    if (!isLastRow) {
      const newCursor = {
        y: cursor.y + 1,
        x: 0,
      }
      setCursor(newCursor)
    }

    if (won) {
      toast.success('You win!')
      if (hasMatic) {
        setIsWinner(true)
        const date = new Date()
        setEndTime(date.getTime())
      } else {
        resetGame()
        setRewardModal(true)
      }

      trackGoal('0KPWBU3S', 0)
    } else {
      if (isLastRow) {
        toast.error(`The word was ${secret}.`)
        resetGame()
        trackGoal('C5K6H6HH', 0)
      }
    }

    return {
      status: !isLastRow && !won ? 'playing' : won ? 'win' : 'loss',
      guess: guessWord,
      attempts,
    }
  }

  async function resetGame() {
    const emptyGrid = makeEmptyGrid()
    setGrid(emptyGrid)
    setCursor({ y: 0, x: 0 })
    const result = await api.getSecretWord()
    setSecret(result.secret)
    setIsLoading(false)
    trackGoal('UPZ0IHDT', 0)
  }

  const usedKeys = []
  const allKeys = flatten(grid)
  for (const i in allKeys) {
    const tile = allKeys[i]
    if (tile.children !== '' && tile.variant !== 'empty') usedKeys.push(tile)
  }

  // async function startGame() {
  //   admitMutation
  //   .mutateAsync()
  //   .catch((e) => toast.error(`Payment failed. Please try again.`))

  //   const date = new Date()
  //   const startTime = date.getTime()
  //   setStartTime(startTime)
  // }

  // function submitYourScore() {
  //   submitMutation
  //     .mutateAsync({
  //       game,
  //       answer: secret,
  //       start: startTime,
  //       end: endTime,
  //     })
  //     .catch(() => toast.error(`There was a error submitting your score.`))
  // }

  console.log(secret)

  return (
    <Authenticated>
      <Head>
        <title>Two Sums</title>
        <meta name="description" content="fun math game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="m-auto flex max-w-lg flex-1 flex-col justify-between px-1 py-4 md:py-0">
        <Grid data={grid} />
        <div className="flex-1 md:hidden"></div>
        <Keyboard
          usedKeys={usedKeys}
          disabled={isLoading}
          onKeyPress={handleKeyPress}
        />
      </main>
      <RewardModal open={rewardModal} onClose={() => setRewardModal(false)} />
    </Authenticated>
  )
}
