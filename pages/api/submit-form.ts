import type { NextApiRequest, NextApiResponse } from 'next';
import { appendToSheet } from 'lib/google-sheets';
import { sendSubmitterEmail, sendOwnerEmail, isEmailConfigured } from 'lib/email';
import { readConfig } from 'lib/token-storage';
import { sanitizeFormData } from 'lib/sanitize';
import { getCMSById } from 'helpers';
import { submitToFormspree, isFormspreeConfigured } from 'lib/formspree';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = sanitizeFormData(req.body);
    
    // Submit to Formspree if configured (do this first, before Google Sheets)
    // Formspree will handle email notifications automatically
    let formspreeSuccess = false;
    if (isFormspreeConfigured()) {
      formspreeSuccess = await submitToFormspree(data);
      if (formspreeSuccess) {
        console.log('[Formspree] Successfully submitted to Formspree - emails will be sent by Formspree');
      } else {
        console.warn('[Formspree] Submission failed, but continuing with Google Sheets save');
        // Don't fail the entire submission if Formspree fails
      }
    }
    
    // Save to sheets
    await appendToSheet(data);
    
    // Send emails only if Formspree is not handling them
    // (i.e., Formspree is not configured or submission failed)
    if (isEmailConfigured() && !formspreeSuccess) {
      const config = await readConfig();
      const submitterEmail = data.email;
      const cms = getCMSById(process.env.EVENT_ID);
      
      // Log for debugging
      console.log('[Email] Attempting to send emails:', {
        hasSubmitterEmail: !!submitterEmail,
        submitterEmail: submitterEmail,
        hasOwnerEmail: !!config?.ownerEmail,
        ownerEmail: config?.ownerEmail,
      });
      
      if (submitterEmail) {
        sendSubmitterEmail(submitterEmail, data, cms).catch((error) => {
          console.error('[Email] Failed to send confirmation to submitter:', {
            email: submitterEmail,
            error: error.message,
            code: error.code,
            response: error.response,
          });
        });
      } else {
        console.warn('[Email] No submitter email found in form data. Available fields:', Object.keys(data));
      }
      
      if (config?.ownerEmail) {
        sendOwnerEmail(config.ownerEmail, data, cms).catch((error) => {
          console.error('[Email] Failed to send notification to owner:', {
            ownerEmail: config.ownerEmail,
            error: error.message,
            code: error.code,
            response: error.response,
          });
        });
      }
    } else if (!isEmailConfigured() && !formspreeSuccess) {
      // Only warn if email is not configured AND Formspree didn't handle emails
      // (If Formspree succeeded, emails are handled by Formspree, so no warning needed)
      console.warn('[Email] Email not configured. Skipping email notifications. Set EMAIL_FROM and EMAIL_PASSWORD in Vercel.');
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Form submission error:', error);
    
    // Check for specific Google API errors
    let errorMessage = error.message || 'Failed to submit form';
    let statusCode = 500;
    
    // Check for authentication errors from Google API
    const isAuthError = 
      error.message === 'Not connected' ||
      error.code === 401 ||
      error.response?.status === 401 ||
      error.message?.includes('Invalid Credentials') ||
      error.message?.includes('invalid_grant') ||
      error.message?.includes('Token has been expired or revoked');
    
    if (isAuthError) {
      errorMessage = 'Google account connection expired. Please reconnect in the admin panel.';
      statusCode = 401;
    } else if (error.message?.includes('has not been used') || error.message?.includes('is disabled')) {
      errorMessage = 'Google Sheets API is not enabled. Please enable it in Google Cloud Console and try again.';
    } else if (error.message?.includes('No sheet configured')) {
      errorMessage = 'No Google Sheet is configured. Please set up your sheet in the admin panel.';
    } else if (error.message?.includes('Permission denied') || error.code === 403) {
      errorMessage = 'Permission denied. Please check your Google account permissions.';
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
}
