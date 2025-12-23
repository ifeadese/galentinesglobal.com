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
