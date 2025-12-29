import { google } from 'googleapis';
import { readTokens, saveTokens, deleteTokens } from './token-storage';

const REDIRECT_URI = `${process.env.BASE_URL}/api/auth/google/callback`;

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

export function getAuthUrl(forceConsent = false): string {
  return getOAuth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file', // For creating/listing sheets
      'https://www.googleapis.com/auth/userinfo.email', // For admin email check
    ],
    prompt: forceConsent ? 'consent' : 'select_account',
  });
}

export async function handleOAuthCallback(code: string): Promise<void> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  await saveTokens(tokens);
}

export async function getAuthenticatedClient() {
  const tokens = await readTokens();
  if (!tokens) {
    throw new Error('Not connected');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // Auto-refresh if expired
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    if (!tokens.refresh_token) {
      await deleteTokens();
      throw new Error('REAUTH_NEEDED');
    }
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await saveTokens(credentials);
      oauth2Client.setCredentials(credentials);
    } catch (error: any) {
      await deleteTokens();
      throw new Error('REAUTH_NEEDED');
    }
  }

  return oauth2Client;
}

