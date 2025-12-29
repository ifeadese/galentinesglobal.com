import type { NextApiRequest, NextApiResponse } from 'next';
import { listUserSheets } from 'lib/google-sheets';
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

  try {
    const sheets = await listUserSheets();
    res.status(200).json(Array.isArray(sheets) ? sheets : []);
  } catch (error: any) {
    console.error('Error listing sheets:', error);
    res.status(200).json([]);
  }
}
