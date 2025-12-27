import { CMSContent } from "types";

/**
 * Default CMS content values used as fallbacks when event-specific data is missing.
 * This ensures the application always has valid data to render, even if an event
 * configuration is incomplete.
 */
export const DEFAULT_CMS: Partial<CMSContent> = {
  general: {
    id: 'DEFAULT',
    name: 'Event',
    description: "Annual Christian Faith Conference",
    marketingCopy: 'Empowering Through Faith',
    contactEmailAddress: '',
    logo: undefined,
    logoAlt: undefined,
  },
  home: {
    heroImage: "/images/panelists.jpeg",
    heroImageAlt: "Conference Panelists",
    heroImages: [
      "/images/panelists.jpeg",
      "/images/ladies.JPG",
      "/images/support.JPG",
    ],
    carouselImages: [
      "/images/volunteer.jpeg",
      "/images/panelists.jpeg",
      "/images/ladies.JPG",
      "/images/support.jpeg",
    ],
    mainLogo: undefined,
    mainLogoAlt: undefined,
    verse: "And to know the love of Christ which passes knowledge; that you might be filled with all the fullness of God. - Ephesians 3:19",
    eventDate: "TBD",
    host: "Hosted by Event Organizers",
    rsvpUrl: "https://rsvpify.com/",
  },
  about: {
    heroImage: "/images/ladies.JPG",
    heroImageAlt: "Community",
    heroTitle: "About",
    heroSubtitle: "Empowering Through Faith",
    paragraphs: [],
    features: [],
  },
  support: {
    heroImage: "/images/support.jpeg",
    heroImageAlt: "Support",
    heroTitle: "Support Us",
    heroSubtitle: "Get Involved",
    paragraphs: [],
    cards: [],
  },
  error404: {
    image: "/images/404.png",
    imageAlt: "404",
    title: "We don't have this page",
    message: "Your URL is probably invalid. Make sure you have the correct one.",
    buttonText: "Return Home",
    buttonLink: "/",
  },
};

/**
 * Deep merge utility that merges source object into target, with source taking precedence.
 * Only merges objects, arrays are replaced entirely.
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key] as Partial<T[Extract<keyof T, string>]>);
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}

/**
 * Merges event-specific CMS content with defaults, ensuring all required fields are present.
 * Event data takes precedence over defaults.
 */
export function mergeWithDefaults(eventCMS: CMSContent): CMSContent {
  return deepMerge(DEFAULT_CMS as CMSContent, eventCMS);
}

