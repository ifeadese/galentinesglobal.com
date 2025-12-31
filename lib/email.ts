import nodemailer from 'nodemailer';
import { CMSContent } from 'types';
import { getCMSById } from 'helpers';

// Create transporter only if email is configured
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      throw new Error('EMAIL_FROM and EMAIL_PASSWORD must be configured. Please set these environment variables in Vercel.');
    }
    
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as any);
  }
  
  return transporter;
}

// Helper to check if email is configured
export function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_FROM && process.env.EMAIL_PASSWORD);
}

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
  try {
    console.log('[Email] sendEmail called:', { to, subject, from: process.env.EMAIL_FROM });
    const emailTransporter = getTransporter();
    console.log('[Email] Transporter obtained, sending mail...');
    
    const result = await Promise.race([
      emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 15 seconds')), 15000)
      )
    ]) as any;
    
    console.log('[Email] Email sent successfully:', {
      to,
      subject,
      messageId: result.messageId,
    });
  } catch (error: any) {
    // Log detailed error for debugging
    console.error('[Email] Failed to send email:', {
      to,
      subject,
      error: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
      stack: error.stack,
    });
    throw error; // Re-throw so caller can handle it
  }
}

export async function sendSubmitterEmail(email: string, data: any, cms?: CMSContent): Promise<void> {
  console.log('[Email] Sending submitter confirmation email:', { email, dataKeys: Object.keys(data) });
  
  // Get CMS content if not provided
  const eventData = cms || getCMSById(process.env.EVENT_ID);
  const baseUrl = process.env.BASE_URL || 'https://www.galentinesglobal.com';
  const logoUrl = eventData.general.logo ? `${baseUrl}${eventData.general.logo}` : '';
  const eventName = eventData.general.name;
  const eventDate = eventData.home.eventDate;
  const verse = eventData.home.verse;
  const contactEmail = eventData.general.contactEmailAddress || 'galentinesglobal@gmail.com';
  const instagramUrl = eventData.general.instagramPageUrl;
  
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
        `<tr><td style="padding: 8px 0; font-weight: 600; color: rgb(88, 35, 55);">${formatFieldName(key)}:</td><td style="padding: 8px 0; padding-left: 16px; color: rgb(102, 85, 95);">${escapeHtml(String(value))}</td></tr>`
      ).join('')
    : '<tr><td colspan="2" style="padding: 8px 0; color: rgb(102, 85, 95);">Your submission has been received.</td></tr>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: rgb(255, 240, 245);">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgb(255, 240, 245); padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(220, 108, 140, 0.15); max-width: 600px;">
              <!-- Header with gradient -->
              <tr>
                <td style="padding: 40px 40px 30px; background: linear-gradient(135deg, rgb(220, 108, 140) 0%, rgb(200, 85, 115) 100%); text-align: center;">
                  ${logoUrl ? `<img src="${logoUrl}" alt="${eventData.general.logoAlt || eventName}" style="max-width: 200px; height: auto; margin-bottom: 20px;" />` : ''}
                  <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Thank You! 💝</h1>
                  <p style="margin: 0; color: rgba(255, 255, 255, 0.95); font-size: 16px; line-height: 1.5;">We&apos;re so excited to have you join us!</p>
                </td>
              </tr>
              
              <!-- Event details -->
              <tr>
                <td style="padding: 30px 40px; background-color: #ffffff;">
                  <div style="text-align: center; padding: 20px; background-color: rgb(255, 240, 245); border-radius: 8px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 8px 0; color: rgb(88, 35, 55); font-size: 22px; font-weight: 600;">${escapeHtml(eventName)}</h2>
                    ${eventDate ? `<p style="margin: 0 0 12px 0; color: rgb(220, 108, 140); font-size: 18px; font-weight: 500;">${escapeHtml(eventDate)}</p>` : ''}
                    ${verse ? `<p style="margin: 0; color: rgb(102, 85, 95); font-size: 14px; font-style: italic; line-height: 1.6;">${escapeHtml(verse)}</p>` : ''}
                  </div>
                </td>
              </tr>
              
              <!-- Submission details -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: rgb(88, 35, 55);">
                    We&apos;ve successfully received your submission! Here&apos;s a summary of what you submitted:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; border-collapse: collapse; background-color: rgb(255, 240, 245); border-radius: 8px; padding: 20px;">
                    ${fieldsHtml}
                  </table>
                </td>
              </tr>
              
              <!-- Closing message -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: rgb(88, 35, 55);">
                    We&apos;re looking forward to seeing you and celebrating God&apos;s love together. This gathering is designed to bring women into the revelation of the Father&apos;s love and the fullness of who we truly are in Christ.
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: rgb(102, 85, 95);">
                    If you have any questions or need assistance, please don&apos;t hesitate to reach out to us at <a href="mailto:${contactEmail}" style="color: rgb(220, 108, 140); text-decoration: none; font-weight: 500;">${contactEmail}</a>.
                  </p>
                  ${instagramUrl ? `<p style="margin: 0 0 32px 0; font-size: 15px; color: rgb(102, 85, 95);">
                    Follow us on <a href="${instagramUrl}" style="color: rgb(220, 108, 140); text-decoration: none; font-weight: 500;">Instagram</a> for updates and encouragement!
                  </p>` : ''}
                  <p style="margin: 0; padding-top: 24px; border-top: 2px solid rgb(255, 240, 245); font-size: 15px; line-height: 1.6; color: rgb(102, 85, 95);">
                    With love and blessings,<br>
                    <strong style="color: rgb(88, 35, 55);">The ${escapeHtml(eventName)} Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: rgb(88, 35, 55); text-align: center;">
                  <p style="margin: 0; color: rgba(255, 255, 255, 0.8); font-size: 13px; line-height: 1.5;">
                    Empowering Women Through Faith
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
  
  try {
    console.log('[Email] About to call sendEmail for submitter:', email);
    await sendEmail(email, `Thank You For Your Submission - ${eventName}`, html);
    console.log('[Email] sendEmail completed successfully for submitter:', email);
  } catch (error: any) {
    console.error('[Email] Error in sendSubmitterEmail when calling sendEmail:', {
      email,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

export async function sendOwnerEmail(ownerEmail: string, data: any, cms?: CMSContent): Promise<void> {
  // Get CMS content if not provided
  const eventData = cms || getCMSById(process.env.EVENT_ID);
  const baseUrl = process.env.BASE_URL || 'https://www.galentinesglobal.com';
  const logoUrl = eventData.general.logo ? `${baseUrl}${eventData.general.logo}` : '';
  const eventName = eventData.general.name;
  const eventDate = eventData.home.eventDate;
  
  // Format field names for display (handle common variations)
  const formatFieldName = (key: string): string => {
    const nameMap: Record<string, string> = {
      fullName: 'Full Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      message: 'Message',
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
        `<tr><td style="padding: 12px; font-weight: 600; color: rgb(88, 35, 55); border-bottom: 1px solid rgba(220, 108, 140, 0.2); width: 160px; vertical-align: top;">${formatFieldName(key)}</td><td style="padding: 12px; color: rgb(102, 85, 95); border-bottom: 1px solid rgba(220, 108, 140, 0.2); line-height: 1.6;">${escapeHtml(String(value))}</td></tr>`
      ).join('')
    : '<tr><td colspan="2" style="padding: 12px; color: rgb(102, 85, 95);">No fields submitted.</td></tr>';

  // Extract email if available for quick reference
  const submitterEmail = data.email || data.emailAddress || '';
  const submitterName = data.fullName || data.firstName || data.name || 'A potential attendee';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: rgb(255, 240, 245);">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgb(255, 240, 245); padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(220, 108, 140, 0.15); max-width: 600px;">
              <!-- Header with gradient -->
              <tr>
                <td style="padding: 30px 40px; background: linear-gradient(135deg, rgb(88, 35, 55) 0%, rgb(139, 69, 85) 100%); text-align: center;">
                  ${logoUrl ? `<img src="${logoUrl}" alt="${eventData.general.logoAlt || eventName}" style="max-width: 180px; height: auto; margin-bottom: 16px;" />` : ''}
                  <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 26px; font-weight: 600; letter-spacing: -0.3px;">📬 New Form Submission</h1>
                  <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 15px;">You have received a new submission</p>
                </td>
              </tr>
              
              <!-- Event context -->
              <tr>
                <td style="padding: 24px 40px; background-color: rgb(255, 240, 245); border-bottom: 1px solid rgba(220, 108, 140, 0.2);">
                  <div style="text-align: center;">
                    <h2 style="margin: 0 0 6px 0; color: rgb(88, 35, 55); font-size: 20px; font-weight: 600;">${escapeHtml(eventName)}</h2>
                    ${eventDate ? `<p style="margin: 0; color: rgb(220, 108, 140); font-size: 16px; font-weight: 500;">${escapeHtml(eventDate)}</p>` : ''}
                  </div>
                </td>
              </tr>
              
              <!-- Quick summary -->
              <tr>
                <td style="padding: 30px 40px; background-color: #ffffff;">
                  <div style="margin-bottom: 24px; padding: 16px; background-color: rgb(255, 240, 245); border-left: 4px solid rgb(220, 108, 140); border-radius: 4px;">
                    <p style="margin: 0 0 8px 0; font-size: 15px; color: rgb(88, 35, 55); font-weight: 600;">From:</p>
                    <p style="margin: 0; font-size: 16px; color: rgb(102, 85, 95);">${escapeHtml(submitterName)}${submitterEmail ? ` &lt;${escapeHtml(submitterEmail)}&gt;` : ''}</p>
                  </div>
                  
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: rgb(88, 35, 55);">
                    A new submission has been received through your form. All details are listed below:
                  </p>
                  
                  <!-- Submission details table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; border-collapse: collapse; background-color: #ffffff; border: 1px solid rgba(220, 108, 140, 0.2); border-radius: 8px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: rgb(255, 240, 245);">
                        <th style="padding: 14px 12px; text-align: left; font-weight: 600; color: rgb(88, 35, 55); border-bottom: 2px solid rgb(220, 108, 140);">Field</th>
                        <th style="padding: 14px 12px; text-align: left; font-weight: 600; color: rgb(88, 35, 55); border-bottom: 2px solid rgb(220, 108, 140);">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${fieldsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>
              
              <!-- Footer info -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <div style="margin-top: 24px; padding: 20px; background-color: rgb(255, 240, 245); border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgb(102, 85, 95);">
                      <strong style="color: rgb(88, 35, 55);">✓ Saved to Google Sheet</strong><br>
                      This is an automated notification. The submission has been saved and can be viewed in your connected Google Sheet.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: rgb(88, 35, 55); text-align: center;">
                  <p style="margin: 0; color: rgba(255, 255, 255, 0.85); font-size: 13px; line-height: 1.5;">
                    ${escapeHtml(eventName)} • Empowering Women Through Faith
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
  
  await sendEmail(ownerEmail, `New ${eventName} Form Submission - ${submitterName}`, html);
}
