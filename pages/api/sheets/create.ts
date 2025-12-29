import type { NextApiRequest, NextApiResponse } from 'next';
import { createSheet } from 'lib/google-sheets';
import { requireAdmin } from 'lib/admin-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin access
    await requireAdmin();
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Sheet name is required' });
    }

    const sheetId = await createSheet(name);
    res.json({ sheetId, sheetName: name });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create sheet' });
  }
}
