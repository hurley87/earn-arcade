import data from './db.json'

export async function getSecretWord() {
  const { items } = data
  const secret = items[Math.floor(Math.random() * items.length)];

  return {secret};
}

export async function verifyWord(word: string) {
  const { items } = data;
  const valid =
    word && word.length === 5 ? items.includes(word) : false;

  return {valid};
}


