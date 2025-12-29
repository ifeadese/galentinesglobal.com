import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from 'lib/admin-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAdmin();
    res.json({ authorized: true });
  } catch (error) {
    res.status(403).json({ authorized: false, error: 'Unauthorized access' });
  }
}

