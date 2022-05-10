import { useEffect, useState } from "react";
import Grid from "../components/Hodle/Grid";
import RewardModal from "../components/Hodle/RewardModal";
import Keyboard, { isMappableKey } from "../components/Hodle/Keyboard";
import { findLastNonEmptyTile } from "../utils/Hodle/helpers";
import { makeEmptyGrid, getRowWord, getNextRow } from "../utils/Hodle/helpers";
import * as api from "../utils/Hodle/api"
import { flatten } from "ramda";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../components/Layout";


export default function Hodle() {
  const emptyGrid = makeEmptyGrid()
  const [grid, setGrid] = useState(emptyGrid)
  const [cursor, setCursor] = useState({ y: 0, x: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [secret, setSecret] = useState("")
  const [rewardModal, setRewardModal] = useState(false)

  useEffect(() => {
    async function loadGame() {
        setIsLoading(true)
        const result = await api.getSecretWord();
        setSecret(result.secret)
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
    } catch (error) {
        console.log("Failed to verify word: %e", error);
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
      setIsLoading(true)
      toast.success(`You win a reward! 🎉`, {
          position: "top-center",
          onClose: function() {
            resetGame()
            setRewardModal(true)
          }
      });
    } else {
      if (isLastRow) {
        toast.error(`The word was ${secret}.`, {
            position: "top-center",
            onClose: function() {
              resetGame()
            }
        });
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
  }

  const usedKeys = []
  const allKeys = flatten(grid)
  for(const i in allKeys) {
    const tile = allKeys[i]
    if(tile.children !== "" && tile.variant !== 'empty') usedKeys.push(tile)
  }

  return (
    <Layout>
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
      <ToastContainer />
    </Layout>
  );
}