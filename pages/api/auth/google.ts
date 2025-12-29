import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUrl } from 'lib/google-oauth';
import { deleteTokens } from 'lib/token-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const forceConsent = req.query.force === 'true' || req.query.force_consent === 'true';
  
  if (forceConsent) {
    await deleteTokens();
  }
  
  res.redirect(getAuthUrl(forceConsent));
}

