import type { NextApiRequest, NextApiResponse } from 'next';
import { handleOAuthCallback } from 'lib/google-oauth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.redirect('/admin?error=no_code');
    }
    await handleOAuthCallback(code);
    res.redirect('/admin?success=true');
  } catch (error: any) {
    res.redirect(`/admin?error=${encodeURIComponent(error.message || 'oauth_failed')}`);
  }
}

