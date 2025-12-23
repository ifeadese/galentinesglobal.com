
import { StaticImageData } from "next/legacy/image";

export interface AppImage {
  path: StaticImageData | string;
  altText: string;
}

export interface Action {
  href: string;
  text?: string;
}

export enum PriceType {
  FIXED = "fixed",
  HOURLY = "hourly",
  STARTING = "starting"
}

export interface Price {
  value: number;
  type: PriceType;
  name?: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  pagePath: string;
  featuredImage: AppImage;
  services?: Service[];
  price?: Price;
  prices?: Price[]
  calendlyEventURL?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  marketingCopy: string;
  pagePath: string;
  heroImage: AppImage;
  calendlyLink?: string;
  contactEmailAddress: string;
  facebookPageId?: string;
  facebookPageUrl?: string;
  instagramPageUrl?: string;
}
