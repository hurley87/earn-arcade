// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number
  name: string
}

export type Cursor = {
  y: number;
  x: number;
};

export type GameTile = {
  variant: "empty" | "correct" | "present" | "absent";
  children: string;
  cursor: Cursor;
};

export type GameGrid = GameTile[][];

export type GameStatus = "new" | "won" | "lost";

export type Transaction = {
  to: string
  from: string
  value: string
  timeStamp: string
}

export type Player = {
  wallet: string
  score: number
}
