
import { StaticImageData } from "next/legacy/image";

export interface AppImage {
  path: StaticImageData | string;
  altText: string;
}

export interface PageContent {
  title?: string;
  subtitle?: string;
  image?: string;
  altText?: string;
  paragraphs?: string[];
  [key: string]: any; // Allow additional properties for flexibility
}

export interface CMSContent {
  general: {
    id: string;
    name: string;
    description: string;
    marketingCopy: string;
    contactEmailAddress: string;
    logo?: string; // Logo image path (e.g., "/images/logo.svg")
    logoAlt?: string; // Logo alt text
    facebookPageUrl?: string;
    instagramPageUrl?: string;
  };
  home: PageContent & {
    slideshowImages?: string[]; // Array of image paths for home page slideshow
    mainLogo?: string; // Main logo/branding image for home page (e.g., "/images/the-love-of-god.svg")
    mainLogoAlt?: string; // Main logo alt text
  };
  about: PageContent;
  support: PageContent;
  error404: PageContent;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  marketingCopy: string;
  pagePath: string;
  heroImage: AppImage;
  logo?: string; // Logo image path for navigation/footer
  logoAlt?: string; // Logo alt text
  calendlyLink?: string;
  contactEmailAddress: string;
  facebookPageUrl?: string;
  instagramPageUrl?: string;
}
