import { useEffect, useState } from "react";
import Grid from "../components/Hodle/Grid";
import Keyboard, { isMappableKey } from "../components/Hodle/Keyboard";
import { findLastNonEmptyTile } from "../utils/Hodle/helpers";
import { makeEmptyGrid, getRowWord, getNextRow } from "../utils/Hodle/helpers";
import * as api from "../utils/Hodle/api"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Hodle() {
  const emptyGrid = makeEmptyGrid()
  const [grid, setGrid] = useState(emptyGrid)
  const [cursor, setCursor] = useState({ y: 0, x: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [secret, setSecret] = useState("")

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
        toast.success(`Damn you good! 🎉`, {
            position: "top-center",
            onClose: function() {
              resetGame()
            }
        });
        

        setTimeout(async function() {

        }, 5000);

      } else {
        if (isLastRow) {
            toast.error(`Not today, my dude =/"`, {
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
    setIsLoading(true)
    setGrid(emptyGrid)
    setCursor({ y: 0, x: 0 })
    const result = await api.getSecretWord();
    setSecret(result.secret)
    setIsLoading(false)
  }

  return (
    <div className="m-auto flex h-screen w-full flex-col dark:bg-gray-700">
      <main className="m-auto flex max-w-lg flex-1 flex-col justify-between p-4 pb-32">
        <Grid data={grid} />
        <div className="flex-1 md:hidden"></div>
        <Keyboard
          data={grid}
          disabled={isLoading}
          onKeyPress={handleKeyPress}
        />
      </main>
      <ToastContainer />
    </div>
  );
}