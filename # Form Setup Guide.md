# Form Setup Guide

This guide will help you set up a contact form that saves submissions to Google Sheets and sends email confirmations.

## Prerequisites

1. A Google account
2. An email account (Gmail or SendGrid account for production)

## Installation

First, install the required dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

### Google Sheets Configuration

```env
# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
GOOGLE_SHEET_ID=your-sheet-id-here
GOOGLE_SHEET_NAME=Sheet1
```

### Email Configuration

Choose one of the following email service options:

#### Option 1: Gmail SMTP (Easiest for testing)

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

**To get a Gmail App Password:**
1. Go to your Google Account settings
2. Enable 2-Step Verification (required)
3. Go to Security > App Passwords
4. Generate a new app password
5. Use that password in `EMAIL_PASSWORD`

#### Option 2: SendGrid (Recommended for production)

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=your-verified-sender@example.com
```

**To set up SendGrid:**
1. Sign up at https://sendgrid.com
2. Verify your sender email address
3. Create an API key in Settings > API Keys
4. Use the API key in `SENDGRID_API_KEY`

#### Option 3: Custom SMTP

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_SECURE=false
EMAIL_FROM=your-email@example.com
```

### Optional Email Customization

```env
EMAIL_SUBJECT=Thank you for your submission!
EMAIL_BODY=<html>Custom HTML email body</html>
```

## Google Sheets Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "form-submissions")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 3: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file
6. Copy the entire contents of the JSON file and paste it into `GOOGLE_SERVICE_ACCOUNT_JSON` in your `.env.local` file

### Step 4: Create and Share Google Sheet

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - The `SHEET_ID_HERE` part is what you need
3. Share the sheet with the service account email:
   - Click "Share" button
   - Add the email address from `client_email` in your service account JSON
   - Give it "Editor" permissions
   - Click "Send"

4. Set `GOOGLE_SHEET_ID` in your `.env.local` to the Sheet ID
5. Set `GOOGLE_SHEET_NAME` to the name of your worksheet (default: "Sheet1")

## Usage

### Basic Usage

```tsx
import ContactForm from "components/contact-form";

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <ContactForm />
    </div>
  );
}
```

### Custom Fields

```tsx
<ContactForm
  fields={[
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: false },
    { name: "message", label: "Your Message", type: "textarea", required: true },
  ]}
  submitButtonText="Send Message"
  onSubmit={(data) => {
    console.log("Form submitted:", data);
  }}
/>
```

### Example Page

Create a new page at `pages/contact.tsx`:

```tsx
import Layout from "components/layout";
import ContactForm from "components/contact-form";
import { getCMSById, getEventFromCMS } from "helpers";

export default function ContactPage({ cms: stringifiedCMS }) {
  const cms = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);

  return (
    <Layout event={event}>
      <section style={{ padding: "4rem 2rem" }}>
        <h1>Contact Us</h1>
        <ContactForm />
      </section>
    </Layout>
  );
}

export const getStaticProps = () => {
  return {
    props: {
      cms: JSON.stringify(getCMSById(process.env.EVENT_ID)),
    },
  };
};
```

## How It Works

1. User fills out the form and clicks submit
2. Form data is sent to `/api/submit-form`
3. The API route:
   - Validates the submission
   - Saves data to Google Sheets (with automatic header creation)
   - Sends email confirmation to the submitter
   - Returns success/error response
4. User sees a success message or error notification

## Troubleshooting

### Google Sheets Errors

- **404 Error**: Make sure the sheet is shared with the service account email
- **Permission Denied**: Check that the service account has "Editor" access
- **Invalid JSON**: Ensure `GOOGLE_SERVICE_ACCOUNT_JSON` is properly escaped (use single quotes in `.env.local`)

### Email Errors

- **Gmail "Less secure app"**: Use App Passwords instead of your regular password
- **SendGrid errors**: Verify your sender email address in SendGrid dashboard
- **SMTP connection errors**: Check your `EMAIL_HOST` and `EMAIL_PORT` settings

### General Issues

- Make sure all environment variables are set in `.env.local`
- Restart your development server after changing environment variables
- Check the server console for detailed error messages

## Security Notes

- Never commit `.env.local` to version control
- Keep your service account JSON and API keys secure
- Use environment variables for all sensitive data
- Consider rate limiting for production use

