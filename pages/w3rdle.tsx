import { useEffect, useState } from "react";
import Grid from "../components/W3rdle/Grid";
import Keyboard, { isMappableKey } from "../components/W3rdle/Keyboard";
import { findLastNonEmptyTile } from "../utils/Hodle/helpers";
import { makeEmptyGrid, getRowWord, getNextRow } from "../utils/Hodle/helpers";
import * as api from "../utils/Hodle/api"
import { flatten } from "ramda";
import Layout from "../components/Layout";
import { trackGoal } from 'fathom-client';
import toast from "react-hot-toast";
import Submissions from "../components/W3rdle/Submissions";
import useAddSubmission from "../hooks/useAddSubmission";
import useAdmission from "../hooks/useAdmission";
import { useBalance, useAccount } from 'wagmi'
import RewardModal from "../components/W3rdle/RewardModal";
import useSubmissions from "../hooks/useHooks";


export default function W3rdle() {
  const date = new Date();
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear();
  const game = day + "-" + month + "-" + year + "-w3rdle"
  const emptyGrid = makeEmptyGrid()
  const [grid, setGrid] = useState(emptyGrid)
  const [cursor, setCursor] = useState({ y: 0, x: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [secret, setSecret] = useState("")
  const [isWinner, setIsWinner] = useState(false)
  const [startTime, setStartTime] = useState(date.getTime())
  const [endTime, setEndTime] = useState(date.getTime())
  const [matic, setMatic] = useState(0.0)
  const submitMutation = useAddSubmission();
  const admitMutation = useAdmission();
  const { data } = useAccount()
  const balance = useBalance({
    addressOrName: data?.address,
  })
  const [rewardModal, setRewardModal] = useState(false)
  const hasMatic = parseInt(balance?.data?.formatted) > 1
  const submissionsQuery = useSubmissions({ game });

  useEffect(() => {
    async function loadGame() {
        setIsLoading(true)
        const result = await api.getSecretWord();
        setSecret(result.secret)
        const res = await fetch("/api/matic", {
          body: JSON.stringify({
          }),
          headers: {
              "Content-Type": "application/json",
          },
          method: "POST",
      });

      const response = await res.json();
      setMatic(response.amount)
      setIsLoading(false)

    }
    loadGame();
  }, [])

  function insert(key: string) {
      const newGrid = grid
      const row = grid[cursor.y];
      const tile = row[cursor.x];
      const isLastColumn = cursor.x === row.length - 1;

      newGrid[cursor.y][cursor.x] = {
          ...tile,
          children: key
      }
      setGrid([...newGrid])

      if (!isLastColumn) {
        const newCursor = {
            y: cursor.y,
            x: cursor.x + 1
        }
        setCursor(newCursor)
      }
      
  }

  function deleteGuess() {
    const newGrid = grid
    const lastNonEmptyTile = findLastNonEmptyTile(
        grid[cursor.y]
    );

    if (!lastNonEmptyTile) {
      return;
    }

    const newCursor = lastNonEmptyTile.cursor;
    setCursor(newCursor)
    const { y, x } = newCursor;
    const target = newGrid[y][x]

    target['children'] = ""
    target['variant'] = "empty"

    setGrid([...newGrid])
  }

  async function handleKeyPress(key: string) {
      if (!isMappableKey(key)) {
        insert(key);
        return;
      }
      switch (key) {
        case "backspace":
          deleteGuess();
          break;
        case "enter":
          await guess();
          break;
      }
  }

  async function guess() {
    if (cursor.x !== grid[0].length - 1) {
      return { status: "playing" };
    }

    const guessWord = getRowWord(grid[cursor.y]);

    if (guessWord.length !== 5) {
      return {
        status: "playing",
      };
    }

    try {
      const result = await api.verifyWord(guessWord);
      if (!result.valid) {
        toast.error(`Not in word list: ${guessWord}`, {
            position: "top-center",
        });
        return {
          status: "playing",
        };
      }
    } catch {
    }

    const won = secret === guessWord;
    const attempts = cursor.y + 1;
    const isLastRow = cursor.y === grid.length - 1;
    const newGrid = grid

    newGrid[cursor.y] = getNextRow(
        newGrid[cursor.y],
        secret
      );
    
    setGrid([...newGrid])

    if (!isLastRow) {
        const newCursor = {
            y: cursor.y + 1,
            x: 0
        }
        setCursor(newCursor)
    }

    if (won) {

      if(hasMatic) {
        setIsWinner(true)
        toast.success("You win!")
        const date = new Date()
        setEndTime(date.getTime())
      } else {
        resetGame()
        toast.success("You win! If")
        setRewardModal(true)
      }

      trackGoal("0KPWBU3S", 0);
    } else {
      if (isLastRow) {
        toast.error(`The word was ${secret}.`);
        resetGame()
        trackGoal("C5K6H6HH", 0);
      }
    }

    return {
        status: !isLastRow && !won ? "playing" : won ? "win" : "loss",
        guess: guessWord,
        attempts,
    };
  }

  async function resetGame() {
    const emptyGrid = makeEmptyGrid()
    setGrid(emptyGrid)
    setCursor({ y: 0, x: 0 })
    const result = await api.getSecretWord();
    setSecret(result.secret)
    setIsLoading(false)
    trackGoal("UPZ0IHDT", 0);
  }

  const usedKeys = []
  const allKeys = flatten(grid)
  for(const i in allKeys) {
    const tile = allKeys[i]
    if(tile.children !== "" && tile.variant !== 'empty') usedKeys.push(tile)
  }

  async function startGame() {
    admitMutation
    .mutateAsync()
    .catch((e) => toast.error(`Payment failed. Please try again.`))

    const date = new Date()
    const startTime = date.getTime()
    setStartTime(startTime)
  }

  function submitYourScore() {
    submitMutation
      .mutateAsync({
        game,
        answer: secret,
        start: startTime,
        end: endTime,
      })
      .catch(() => toast.error(`There was a error submitting your score.`))
  }

  console.log(secret)

  return (
    <Layout>
      {
        hasMatic ? (
          <div className="mx-auto">
          {
            !submissionsQuery.isSuccess ? (
              <div className="px-2 pt-2 sm:max-w-sm mx-auto">Loading game ...
              <div className="mx-auto max-w-lg text-center mt-4">
                <svg role="status" className="w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
            </div>
            ) :
            (submissionsQuery.data.filter(sub => sub.creator_address === data?.address).length > 0) 
            ? <div className="px-2 pt-2 sm:max-w-xl mx-auto"><Submissions game={game}/></div> 
            : (
              <>
              {
                (admitMutation.isError || admitMutation.isIdle) && (
                  <section className="grid gap-4 pt-10 sm:max-w-xl mx-auto">
                    <div className="grid gap-2 md:gap-3">
                      <p className=" text-slate-800 dark:text-slate-200">
                       Earn 50 $MATIC by solving W3rdle in the fastest time.
                      </p>
                      <button onClick={() => startGame()} className="bg-pink-500 boldest hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded w-full">
                        {admitMutation.isError ? "Try Again" : `Pay $1 MATIC to Play`} 
                      </button>
                    </div>
                    <Submissions game={game}/>
                  </section>
                )
              }
              {
                admitMutation.isLoading && (
                  <div className="px-2 pt-2 sm:max-w-sm mx-auto">Confirm your $1 MATIC admission fee ...
                    <div className="mx-auto max-w-lg text-center mt-4">
                      <svg role="status" className="w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                    </div>
                  </div>
                )
              }
              {
                admitMutation.isSuccess && (
                  <>
                    {
                      isWinner ? (
                        <>
                        {
                          (submitMutation.isIdle || submitMutation.isError) && (
                            <section className="grid gap-4 px-2 pt-10 sm:max-w-sm mx-auto">
                              <div className="grid gap-2 md:gap-3">
                                <p className=" text-slate-800 dark:text-slate-200 pb-2">
                                  Congrats! You guessed {secret} in {((((endTime - startTime)/1000)%3600)%60).toFixed(2)} seconds. Submit your time for a chance to win. 
                                </p>
                                <button onClick={() => submitYourScore()} className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded w-full">
                                  {submitMutation.isError ? "Try Again" : "Submit Time"}
                                </button>
                              </div>
                            </section>
                          )
                        }
                        {
                          (submitMutation.isSuccess) && <div className="px-2 pt-2 sm:max-w-xl mx-auto"><Submissions game={game}/></div>
                        }
                        </>
                      ) : (
                        <main className="m-auto flex max-w-xl flex-1 flex-col justify-between px-1 py-4 md:py-0">
                          <Grid data={grid} />
                          <div className="flex-1 md:hidden"></div>
                          <Keyboard
                            usedKeys={usedKeys}
                            disabled={isLoading}
                            onKeyPress={handleKeyPress}
                          />
                        </main>
                      )
                    }
                    {
                      submitMutation.isLoading && (
                        <div className="px-2 pt-2 sm:max-w-sm mx-auto">Saving your score ...
                        <div className="mx-auto max-w-lg text-center mt-4">
                          <svg role="status" className="w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                        </div>
                      </div>
                      ) 
                    }
                  </>
                )
              }
              </>
            )
          }
          </div>
        ) : (
          <>
            <main className="m-auto flex max-w-lg flex-1 flex-col justify-between px-1 py-4 md:py-0">
              <Grid data={grid} />
              <div className="flex-1 md:hidden"></div>
              <Keyboard
                usedKeys={usedKeys}
                disabled={isLoading}
                onKeyPress={handleKeyPress}
              />
            </main>
            <RewardModal open={rewardModal} onClose={() => setRewardModal(false)}/>
          </>
        )
      }

    </Layout>
  );
}