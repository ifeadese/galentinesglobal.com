import type { NextApiRequest, NextApiResponse } from 'next';
import { saveConfig, readConfig } from 'lib/token-storage';
import { requireAdmin } from 'lib/admin-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check admin access
    await requireAdmin();
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  if (req.method === 'GET') {
    const config = await readConfig();
    res.json(config || {});
  } else if (req.method === 'POST') {
    await saveConfig(req.body);
    res.json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

