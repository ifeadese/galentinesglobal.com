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

export async function getAuthUrl(forceConsent = false): Promise<string> {
  // Check if we have existing tokens
  const existingTokens = await readTokens();
  const hasRefreshToken = !!existingTokens?.refresh_token;
  
  // Always use 'consent' if:
  // 1. forceConsent is true (explicit request)
  // 2. No tokens exist (first connection)
  // 3. Tokens exist but no refresh_token (need to get one)
  const shouldForceConsent = forceConsent || !existingTokens || !hasRefreshToken;
  
  return getOAuth2Client().generateAuthUrl({
    access_type: 'offline', // Required to get refresh_token
    scope: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file', // For creating/listing sheets
      'https://www.googleapis.com/auth/userinfo.email', // For admin email check
    ],
    prompt: shouldForceConsent ? 'consent' : 'select_account',
  });
}

export async function handleOAuthCallback(code: string): Promise<void> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  
  // Log token info for debugging (don't log the actual tokens for security)
  console.log('[OAuth] Received tokens:', {
    hasAccessToken: !!tokens.access_token,
    hasRefreshToken: !!tokens.refresh_token,
    hasExpiryDate: !!tokens.expiry_date,
  });
  
  // CRITICAL: Ensure refresh_token is present
  // Google only provides refresh_token on first auth or with prompt: 'consent'
  if (!tokens.refresh_token) {
    // Check if we have an existing refresh_token to preserve
    const existingTokens = await readTokens();
    if (existingTokens?.refresh_token) {
      console.warn('[OAuth] No refresh_token in new tokens, preserving existing refresh_token');
      tokens.refresh_token = existingTokens.refresh_token;
    } else {
      // This is a critical error - we need a refresh_token for long-term stability
      console.error('[OAuth] CRITICAL: No refresh_token received and none exists. User must re-authenticate with consent.');
      throw new Error('No refresh token received. Please reconnect with the "Reconnect" button to ensure proper authorization.');
    }
  }
  
  // Save tokens with refresh_token guaranteed
  await saveTokens(tokens);
  
  // Verify refresh_token was saved
  const savedTokens = await readTokens();
  if (!savedTokens?.refresh_token) {
    console.error('[OAuth] CRITICAL: refresh_token was not saved properly');
    throw new Error('Failed to save refresh token. Please try reconnecting.');
  }
  
  console.log('[OAuth] Tokens saved successfully with refresh_token');
}

export async function getAuthenticatedClient() {
  const tokens = await readTokens();
  if (!tokens) {
    throw new Error('Not connected');
  }

  // Check if refresh_token exists
  if (!tokens.refresh_token) {
    console.error('[OAuth] No refresh_token found in stored tokens. User needs to re-authenticate with force_consent=true');
    throw new Error('No refresh token available. Please reconnect your Google account in the admin panel.');
  }

  const oauth2Client = getOAuth2Client();
  // Ensure all token fields are set, especially refresh_token
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
    token_type: tokens.token_type,
    scope: tokens.scope,
  });

  // Set up automatic token refresh using Google's built-in mechanism
  // This listener will be called automatically when tokens are refreshed during API calls
  oauth2Client.on('tokens', async (newTokens) => {
    try {
      // Merge new tokens with existing ones (preserve refresh_token if new one not provided)
      const currentTokens = await readTokens() || tokens;
      const updatedTokens = {
        ...currentTokens,
        ...newTokens,
        // Preserve refresh_token if not in new tokens (critical!)
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
        // Verify refresh_token is set on client before attempting refresh
        const clientCredentials = oauth2Client.credentials;
        if (!clientCredentials.refresh_token) {
          console.warn('[OAuth] Refresh token not set on OAuth2 client, setting it now');
          oauth2Client.setCredentials({
            ...clientCredentials,
            refresh_token: tokens.refresh_token,
          });
        }
        
        // Try proactive refresh, but don't fail hard if it doesn't work
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        // Ensure refresh_token is preserved in the new credentials
        const credentialsWithRefreshToken = {
          ...credentials,
          refresh_token: credentials.refresh_token || tokens.refresh_token,
        };
        
        // Set credentials immediately after refresh succeeds (before saving to storage)
        // This ensures the client has fresh tokens even if saveTokens() fails
        oauth2Client.setCredentials(credentialsWithRefreshToken);
        
        // Save to storage (don't fail if this errors - credentials are already set)
        try {
          await saveTokens(credentialsWithRefreshToken);
        } catch (saveError) {
          // Log but don't throw - credentials are already set on the client
          console.error('[OAuth] Failed to save refreshed tokens to storage, but credentials are set:', saveError);
        }
      } catch (error: any) {
        // Log but don't throw - the API call will handle authentication errors
        // This prevents REAUTH_NEEDED from being thrown prematurely
        // Note: We already verified refresh_token exists above, so if refresh fails here,
        // it's likely a temporary issue (network, rate limit, etc.) that automatic refresh can handle
        if (error.message?.includes('No refresh token') || error.message?.includes('refresh_token')) {
          console.error('[OAuth] Proactive refresh failed with refresh_token error (will rely on automatic refresh during API call):', error.message);
        } else {
          console.warn('[OAuth] Proactive token refresh failed, will rely on automatic refresh during API call:', error.message);
        }
      }
    } else {
      console.warn('[OAuth] No refresh_token available for proactive refresh');
    }
  }

  return oauth2Client;
}

