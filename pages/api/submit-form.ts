import type { NextApiRequest, NextApiResponse } from 'next';
import { appendToSheet } from 'lib/google-sheets';
import { sendSubmitterEmail, sendOwnerEmail } from 'lib/email';
import { readConfig } from 'lib/token-storage';
import { sanitizeFormData } from 'lib/sanitize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = sanitizeFormData(req.body);
    
    // Save to sheets
    await appendToSheet(data);
    
    // Send emails (don't wait)
    const config = await readConfig();
    if (data.email) {
      sendSubmitterEmail(data.email, data).catch(console.error);
    }
    if (config?.ownerEmail) {
      sendOwnerEmail(config.ownerEmail, data).catch(console.error);
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Form submission error:', error);
    
    // Check for specific Google API errors
    let errorMessage = error.message || 'Failed to submit form';
    
    if (error.message?.includes('has not been used') || error.message?.includes('is disabled')) {
      errorMessage = 'Google Sheets API is not enabled. Please enable it in Google Cloud Console and try again.';
    } else if (error.message?.includes('No sheet configured')) {
      errorMessage = 'No Google Sheet is configured. Please set up your sheet in the admin panel.';
    } else if (error.message?.includes('Permission denied') || error.code === 403) {
      errorMessage = 'Permission denied. Please check your Google account permissions.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
}
