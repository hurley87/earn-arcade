export async function getSecretWord() {
  return await fetch("/api/secret").then((x) => x.json());
}

export async function verifyWord(word: string) {
  return await fetch(`/api/verify/${word}`).then((x) => x.json());
}
