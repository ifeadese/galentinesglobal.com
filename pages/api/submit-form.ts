import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeFormData } from 'lib/sanitize';
import { submitToFormspree } from 'lib/formspree';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = sanitizeFormData(req.body);
    
    // This API route requires an endpoint to be provided in the request body
    // Note: This route is currently unused - all forms submit directly to Formspree
    const endpoint = req.body._endpoint;
    
    if (!endpoint) {
      return res.status(503).json({ 
        error: 'Form submissions are temporarily unavailable. Please provide an endpoint.' 
      });
    }
    
    // Validate endpoint to prevent SSRF attacks - only allow Formspree endpoints
    // Formspree endpoints follow the pattern: https://formspree.io/f/[alphanumeric]
    const FORMSPREE_ENDPOINT_PATTERN = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;
    if (!FORMSPREE_ENDPOINT_PATTERN.test(endpoint)) {
      console.error('[API] Invalid endpoint format attempted:', endpoint);
      return res.status(400).json({ 
        error: 'Invalid endpoint format. Only Formspree endpoints are allowed.' 
      });
    }
    
    const result = await submitToFormspree(data, { endpoint });
    
    if (!result.success) {
      return res.status(503).json({ 
        error: result.error || 'Form submission failed. Please try again later or contact the event organizer.' 
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
