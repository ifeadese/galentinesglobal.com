import { useEffect, useState } from "react";
import { GALENTINESGLOBAL } from "data/galentinesglobal/index";
import { WINDSOFCHANGE } from "data/windsofchange/index";
import { CMSContent } from "data/cms-types";
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
      path: cms.home.heroImage || "/images/panelists.jpeg",
      altText: cms.home.heroImageAlt || "Galentines Conference Panelists",
    },
    contactEmailAddress: cms.general.contactEmailAddress,
    facebookPageId: cms.general.facebookPageId,
    facebookPageUrl: cms.general.facebookPageUrl,
    instagramPageUrl: cms.general.instagramPageUrl,
  };
}

export function getCMSById(id: string): CMSContent {
    switch (id) {
        case 'WINDSOFCHANGE':
        case 'PHILSVISION': // Legacy ID support
            return WINDSOFCHANGE;
        case 'GALENTINESGLOBAL':
        case 'LOCTINEER': // Legacy ID support
        default:
            return GALENTINESGLOBAL;
    }
}



export const useScreenSizeDetector = () => {
    const [width, setWidth] = useState(968);
    useEffect(() => {
        const updateWidth = () => setWidth(window.innerWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, []);
    return { isMobile: width <= 968, isTablet: width <= 1024, isDesktop: width > 1024 };
};