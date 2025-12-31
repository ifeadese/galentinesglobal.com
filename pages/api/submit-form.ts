import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeFormData } from 'lib/sanitize';
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
    
    // Submit to Formspree - handles form submission and email notifications
    if (!isFormspreeConfigured()) {
      return res.status(503).json({ 
        error: 'Form submissions are temporarily unavailable. Please try again later or contact the event organizer.' 
      });
    }
    
    const formspreeSuccess = await submitToFormspree(data);
    
    if (!formspreeSuccess) {
      return res.status(503).json({ 
        error: 'Form submission failed. Please try again later or contact the event organizer.' 
      });
    }
    
    console.log('[Formspree] Successfully submitted to Formspree - emails will be sent by Formspree');
    res.json({ success: true });
  } catch (error: any) {
    console.error('Form submission error:', error);
    return res.status(503).json({ 
      error: 'Form submissions are temporarily unavailable. Please try again later or contact the event organizer.' 
    });
  }
}
