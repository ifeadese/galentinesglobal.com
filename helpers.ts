import { useEffect, useState } from "react";
import { GALENTINESGLOBAL } from "data/galentinesglobal/index";
import { WINDSOFCHANGE } from "data/windsofchange/index";
import { mergeWithDefaults } from "data/defaults";
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

export function getCMSById(id: string | undefined): CMSContent {
    let eventCMS: CMSContent;
    switch (id) {
        case 'WINDSOFCHANGE':
            eventCMS = WINDSOFCHANGE;
            break;
        default:
            eventCMS = GALENTINESGLOBAL;
    }
    // Merge with defaults to ensure all fields are present
    return mergeWithDefaults(eventCMS);
}

/**
 * Get the event date as a Date object from CMS content
 * Parses date as 10:00 AM EST/EDT (America/Toronto - Ottawa timezone)
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
    
    // Try EST first (UTC-5): 10am EST = 3pm UTC (15:00)
    let estDate = new Date(`${isoDateStr}T15:00:00Z`);
    
    // Verify this gives us 10am in America/Toronto timezone
    let verifyStr = estDate.toLocaleString('en-US', {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // If not 10:00, try EDT (UTC-4): 10am EDT = 2pm UTC (14:00)
    if (verifyStr !== '10:00') {
      estDate = new Date(`${isoDateStr}T14:00:00Z`);
      verifyStr = estDate.toLocaleString('en-US', {
        timeZone: 'America/Toronto',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      // If still not 10:00, fall back to EST
      if (verifyStr !== '10:00') {
        estDate = new Date(`${isoDateStr}T15:00:00Z`);
      }
    }
    
    return estDate;
  } catch {
    return null;
  }
}
