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
    facebookPageId?: string;
    facebookPageUrl?: string;
    instagramPageUrl?: string;
  };
  home: PageContent;
  about: PageContent;
  support: PageContent;
  error404: PageContent;
}

