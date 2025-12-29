/**
 * Sanitizes form data to prevent XSS attacks and limit input length
 * @param data - Form data object to sanitize
 * @returns Sanitized form data object
 */
export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .trim()
        .slice(0, 1000); // Limit to 1000 characters
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
