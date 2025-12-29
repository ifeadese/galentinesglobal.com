import type { NextApiRequest, NextApiResponse } from 'next';
import { readTokens } from 'lib/token-storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokens = await readTokens();
  res.json({
    connected: !!tokens,
    hasRefreshToken: !!tokens?.refresh_token,
  });
}

