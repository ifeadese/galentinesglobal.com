import { google } from 'googleapis';
import { getAuthenticatedClient } from './google-oauth';
import { readConfig } from './token-storage';

/**
 * Formats a date into a human-readable string like "January 12, 2025 at 7:32pm"
 * Uses EST/EDT timezone (America/Toronto - Ottawa timezone) to match event timezone
 */
function formatReadableTimestamp(date: Date = new Date()): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Format date in EST/EDT timezone (America/Toronto)
  const estDateStr = date.toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Parse the formatted string: "MM/DD/YYYY, HH:mm:ss"
  const [datePart, timePart] = estDateStr.split(', ');
  const [monthStr, dayStr, yearStr] = datePart.split('/');
  const [hourStr, minuteStr] = timePart.split(':');

  const month = months[parseInt(monthStr) - 1];
  const day = parseInt(dayStr);
  const year = parseInt(yearStr);
  
  let hours = parseInt(hourStr);
  const minutes = parseInt(minuteStr);
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  
  return `${month} ${day}, ${year} at ${hours}:${minutesStr}${ampm}`;
}

export async function appendToSheet(data: Record<string, any>): Promise<void> {
  const auth = await getAuthenticatedClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const config = await readConfig();
  
  if (!config?.sheetId) {
    throw new Error('No sheet configured');
  }

  try {
    // Get existing headers
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: 'Sheet1!1:1',
    });

    const existingHeaders = headersResponse.data.values?.[0] || [];
    const dataKeys = Object.keys(data);

    // Build complete header list: existing + new data keys + timestamp (if missing)
    const allHeaders = [...existingHeaders];
    const newHeaders = dataKeys.filter(key => !allHeaders.includes(key));
    allHeaders.push(...newHeaders);
    
    // Ensure timestamp column exists
    if (!allHeaders.includes('timestamp')) {
      allHeaders.push('timestamp');
    }

    // Update header row if there are new headers
    if (newHeaders.length > 0 || !existingHeaders.includes('timestamp')) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: config.sheetId,
        range: 'Sheet1!1:1',
        valueInputOption: 'RAW',
        requestBody: { values: [allHeaders] },
      });
    }

    // Create row data matching header order
    const rowData = allHeaders.map(header => 
      header === 'timestamp' ? formatReadableTimestamp() : (data[header] || '')
    );

    // Append row
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheetId,
      range: 'Sheet1!A:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowData] },
    });
  } catch (error: any) {
    // Re-throw with more context for API errors
    if (error.message?.includes('has not been used') || error.message?.includes('is disabled')) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export async function listUserSheets(): Promise<Array<{ id: string; name: string }>> {
  const auth = await getAuthenticatedClient();
  const drive = google.drive({ version: 'v3', auth });
  
  const response = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: 'files(id, name)',
    orderBy: 'modifiedTime desc',
    pageSize: 20,
  });
  
  return (response.data.files || []).map(file => ({
    id: file.id!,
    name: file.name!,
  }));
}

export async function createSheet(name: string): Promise<string> {
  const auth = await getAuthenticatedClient();
  const drive = google.drive({ version: 'v3', auth });
  const sheets = google.sheets({ version: 'v4', auth });
  
  const file = await drive.files.create({
    requestBody: {
      name: name,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    },
    fields: 'id',
  });

  const sheetId = file.data.id!;

  // Initialize with timestamp header
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: { values: [['timestamp']] },
  });

  return sheetId;
}
