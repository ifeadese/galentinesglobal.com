import { getAuthenticatedClient } from './google-oauth';
import { google } from 'googleapis';

/**
 * Get the authenticated user's email from Google OAuth
 */
export async function getUserEmail(): Promise<string | null> {
  try {
    const auth = await getAuthenticatedClient();
    const oauth2 = google.oauth2({ version: 'v2', auth });
    const userInfo = await oauth2.userinfo.get();
    return userInfo.data.email || null;
  } catch (error) {
    console.error('Failed to get user email:', error);
    return null;
  }
}

/**
 * Check if the current user is an admin
 * Checks if user's email is in the ADMIN_EMAILS env var (comma-separated list)
 */
export async function isAdmin(): Promise<boolean> {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    // If no admin emails configured, deny access for security
    return false;
  }

  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return false;
    }

    const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
    return allowedEmails.includes(userEmail.toLowerCase());
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
}

/**
 * Check admin access and throw error if not authorized
 */
export async function requireAdmin(): Promise<void> {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error('UNAUTHORIZED');
  }
}
