import type { NextApiRequest, NextApiResponse } from 'next'

import data from '../../db/db.json'
import { randomInt } from 'crypto'

export type SecretApiResponse = {
  secret: string,
}

export type Request = NextApiRequest

export default async function handler(
  req: Request,
  res: NextApiResponse<SecretApiResponse>
) {
  const { length, items } = data

  const secret = items[randomInt(length)]

  res.status(200).json({ secret })
}
