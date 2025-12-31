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

  // Set up automatic token refresh using Google's built-in mechanism
  // This listener will be called automatically when tokens are refreshed during API calls
  oauth2Client.on('tokens', async (newTokens) => {
    try {
      // Merge new tokens with existing ones (preserve refresh_token if new one not provided)
      const currentTokens = await readTokens() || tokens;
      const updatedTokens = {
        ...currentTokens,
        ...newTokens,
        // Preserve refresh_token if not in new tokens
        refresh_token: newTokens.refresh_token || currentTokens.refresh_token || tokens.refresh_token,
      };
      await saveTokens(updatedTokens);
    } catch (error) {
      // Don't throw - token saving shouldn't break the API call
      console.error('[OAuth] Failed to save refreshed tokens:', error);
    }
  });

  // Proactively refresh if token is expired or will expire within the next 5 minutes
  // This prevents unnecessary refresh attempts while still being proactive before expiration
  const expiryBuffer = 5 * 60 * 1000; // 5 minutes
  if (tokens.expiry_date && tokens.expiry_date < Date.now() + expiryBuffer) {
    if (tokens.refresh_token) {
      try {
        // Try proactive refresh, but don't fail hard if it doesn't work
        const { credentials } = await oauth2Client.refreshAccessToken();
        // Set credentials immediately after refresh succeeds (before saving to storage)
        // This ensures the client has fresh tokens even if saveTokens() fails
        oauth2Client.setCredentials(credentials);
        // Save to storage (don't fail if this errors - credentials are already set)
        try {
          await saveTokens(credentials);
        } catch (saveError) {
          // Log but don't throw - credentials are already set on the client
          console.error('[OAuth] Failed to save refreshed tokens to storage, but credentials are set:', saveError);
        }
      } catch (error: any) {
        // Log but don't throw - the API call will handle authentication errors
        // This prevents REAUTH_NEEDED from being thrown prematurely
        console.warn('[OAuth] Proactive token refresh failed, will rely on automatic refresh during API call:', error.message);
      }
    }
  }

  return oauth2Client;
}

