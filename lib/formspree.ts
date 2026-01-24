/**
 * Formspree Integration
 * 
 * Formspree is a form backend service that handles form submissions,
 * email notifications, and webhook integrations.
 * 
 * Each form should provide its own endpoint URL when calling submitToFormspree.
 */

/**
 * Submit form data to Formspree
 * 
 * @param data Form data to submit
 * @param options Optional configuration: endpoint URL, redirect URL
 * @returns Promise with success status and error message if failed
 */
export interface SubmitToFormspreeResult {
  success: boolean;
  error?: string;
}

export async function submitToFormspree(
  data: Record<string, any>,
  options: {
    endpoint: string;
    redirectUrl?: string;
  }
): Promise<SubmitToFormspreeResult> {
  // Endpoint is required - each form should provide its own endpoint
  const submitUrl = options.endpoint;

  try {
    // Add redirect URL to data if provided
    const dataWithRedirect = options?.redirectUrl ? { ...data, _next: options.redirectUrl } : data;
    
    console.log('[Formspree] Submitting form data:', {
      url: submitUrl,
      fields: Object.keys(data),
      hasRedirect: !!options?.redirectUrl,
    });
    
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(dataWithRedirect),
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let responseData: any;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // If not JSON, read as text for error message
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text.substring(0, 100)}`);
      }
    } catch (parseError: any) {
      // If JSON parsing fails, return a structured error
      console.error('[Formspree] Failed to parse response:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        parseError: parseError.message,
      });
      return {
        success: false,
        error: response.ok 
          ? 'Received invalid response from server'
          : `Server error (${response.status}): ${response.statusText}`,
      };
    }

    if (response.ok) {
      console.log('[Formspree] Successfully submitted form:', {
        next: responseData.next,
        message: responseData.message,
      });
      return { success: true };
    } else {
      const errorMessage = responseData.error || 'Form submission failed';
      console.error('[Formspree] Submission failed:', {
        status: response.status,
        statusText: response.statusText,
        errors: responseData.errors,
        error: responseData.error,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error: any) {
    console.error('[Formspree] Error submitting form:', {
      error: error.message,
      stack: error.stack,
    });
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

