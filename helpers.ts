import { CMSContent } from "types";
import { Event } from "types";

// Convert CMS content to Event type for backward compatibility
export function getEventFromCMS(cms: CMSContent): Event {
  return {
    id: cms.general.id,
    name: cms.general.name,
    description: cms.general.description,
    marketingCopy: cms.general.marketingCopy,
    pagePath: '/',
    heroImage: {
      path: cms.home.heroImage!,
      altText: cms.home.heroImageAlt!,
    },
    logo: cms.general.logo,
    logoAlt: cms.general.logoAlt || cms.general.name,
    contactEmailAddress: cms.general.contactEmailAddress,
    facebookPageUrl: cms.general.facebookPageUrl,
    instagramPageUrl: cms.general.instagramPageUrl,
  };
}

/**
 * Get the event date as a Date object from CMS content
 * Parses date as 1:30 PM EST/EDT (America/Toronto - Ottawa timezone)
 * Returns null if the date cannot be parsed
 */
export function getEventDate(cms: CMSContent): Date | null {
  const dateString = cms.home.eventDate;
  if (!dateString || dateString === 'TBD') {
    return null;
  }
  
  try {
    // Parse the date string (e.g., "February 7, 2026")
    const tempDate = new Date(dateString);
    
    if (isNaN(tempDate.getTime())) {
      return null;
    }
    
    // Get date components
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    const day = tempDate.getDate();
    
    // Create ISO date string: YYYY-MM-DD
    const isoDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Try EST first (UTC-5): 1:30 PM EST = 18:30 UTC (6:30 PM UTC)
    let estDate = new Date(`${isoDateStr}T18:30:00Z`);
    
    // Verify this gives us 13:30 (1:30 PM) in America/Toronto timezone
    let verifyStr = estDate.toLocaleString('en-US', {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // If not 13:30, try EDT (UTC-4): 1:30 PM EDT = 17:30 UTC (5:30 PM UTC)
    if (verifyStr !== '13:30') {
      estDate = new Date(`${isoDateStr}T17:30:00Z`);
      verifyStr = estDate.toLocaleString('en-US', {
        timeZone: 'America/Toronto',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      // If still not 13:30, fall back to EST
      if (verifyStr !== '13:30') {
        estDate = new Date(`${isoDateStr}T18:30:00Z`);
      }
    }
    
    return estDate;
  } catch {
    return null;
  }
}
