/**
 * Formspree Integration
 * 
 * Formspree is a form backend service that handles form submissions,
 * email notifications, and webhook integrations.
 * 
 * To use:
 * 1. Sign up at https://formspree.io
 * 2. Create a form and get your form ID (e.g., "xvgwqkny")
 * 3. Set FORMSPREE_FORM_ID environment variable in Vercel
 */

/**
 * Get Formspree form ID from environment variables
 * Uses NEXT_PUBLIC_ prefix so it's accessible on the client side
 */
export function getFormspreeFormId(): string | null {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || process.env.FORMSPREE_FORM_ID || null;
  if (!formId) {
    console.warn('[Formspree] Form ID not found. Check NEXT_PUBLIC_FORMSPREE_FORM_ID environment variable.');
  }
  return formId;
}

/**
 * Check if Formspree is configured
 */
export function isFormspreeConfigured(): boolean {
  return !!getFormspreeFormId();
}

/**
 * Submit form data to Formspree
 * 
 * @param data Form data to submit
 * @param redirectUrl Optional redirect URL after successful submission
 * @returns Promise<boolean> Success status
 */
export async function submitToFormspree(data: Record<string, any>, redirectUrl?: string): Promise<boolean> {
  const formId = getFormspreeFormId();
  
  if (!formId) {
    console.warn('[Formspree] Not configured. Set FORMSPREE_FORM_ID in environment variables.');
    return false;
  }

  try {
    const submitUrl = `https://formspree.io/f/${formId}`;
    
    // Add redirect URL to data if provided
    const dataWithRedirect = redirectUrl ? { ...data, _next: redirectUrl } : data;
    
    console.log('[Formspree] Submitting form data:', {
      url: submitUrl,
      fields: Object.keys(data),
      hasRedirect: !!redirectUrl,
    });
    
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(dataWithRedirect),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('[Formspree] Successfully submitted form:', {
        next: responseData.next,
        message: responseData.message,
      });
      return true;
    } else {
      console.error('[Formspree] Submission failed:', {
        status: response.status,
        statusText: response.statusText,
        errors: responseData.errors,
        error: responseData.error,
      });
      return false;
    }
  } catch (error: any) {
    console.error('[Formspree] Error submitting form:', {
      error: error.message,
      stack: error.stack,
    });
    return false;
  }
}

