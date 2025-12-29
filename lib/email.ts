import nodemailer from 'nodemailer';

// Validate email configuration at module load
if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
  throw new Error('EMAIL_FROM and EMAIL_PASSWORD must be configured');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Escape HTML to prevent XSS in email content
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function sendSubmitterEmail(email: string, data: any): Promise<void> {
  // Format field names for display
  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Filter out timestamp and email (already shown in "To" field)
  const excludeFields = ['timestamp', 'email'];
  const fieldsToShow = Object.entries(data)
    .filter(([key]) => !excludeFields.includes(key))
    .filter(([_, value]) => value != null && value !== '');

  const fieldsHtml = fieldsToShow.length > 0
    ? fieldsToShow.map(([key, value]) => 
        `<tr><td style="padding: 8px 0; font-weight: 600; color: #333;">${formatFieldName(key)}:</td><td style="padding: 8px 0; padding-left: 16px; color: #666;">${escapeHtml(String(value))}</td></tr>`
      ).join('')
    : '<tr><td colspan="2" style="padding: 8px 0; color: #666;">Your submission has been received.</td></tr>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Thank You! 🎉</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    We've successfully received your submission and are so excited to have you join us!
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    Here's a summary of what you submitted:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border-collapse: collapse;">
                    ${fieldsHtml}
                  </table>
                  <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 1.6; color: #333;">
                    We're looking forward to seeing you soon! If you have any questions, feel free to reach out to us.
                  </p>
                  <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #666;">
                    Best regards,<br>
                    The Team
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  await sendEmail(email, 'Thank You For Your Submission!', html);
}

export async function sendOwnerEmail(ownerEmail: string, data: any): Promise<void> {
  // Format field names for display (handle common variations)
  const formatFieldName = (key: string): string => {
    const nameMap: Record<string, string> = {
      fullName: 'Full Name',
      firstName: 'First Name',
      lastName: 'Last Name',
    };
    
    if (nameMap[key]) return nameMap[key];
    
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get all fields except timestamp
  const fieldsToShow = Object.entries(data)
    .filter(([key]) => key !== 'timestamp')
    .filter(([_, value]) => value != null && value !== '');

  const fieldsHtml = fieldsToShow.length > 0
    ? fieldsToShow.map(([key, value]) => 
        `<tr><td style="padding: 10px; font-weight: 600; color: #333; border-bottom: 1px solid #e0e0e0; width: 140px;">${formatFieldName(key)}</td><td style="padding: 10px; color: #666; border-bottom: 1px solid #e0e0e0;">${escapeHtml(String(value))}</td></tr>`
      ).join('')
    : '<tr><td colspan="2" style="padding: 10px; color: #666;">No fields submitted.</td></tr>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 30px 40px; background-color: #4a5568; border-bottom: 3px solid #667eea;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">📬 New Form Submission</h1>
                  <p style="margin: 8px 0 0 0; color: #cbd5e0; font-size: 14px;">You have received a new form submission</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #333;">
                    A new submission has been received through your form. Details are below:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #e9ecef;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #dee2e6;">Field</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #dee2e6;">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${fieldsHtml}
                    </tbody>
                  </table>
                  <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666; line-height: 1.6;">
                    This is an automated notification. The submission has been saved to your Google Sheet.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  await sendEmail(ownerEmail, 'New Form Submission Received', html);
}
