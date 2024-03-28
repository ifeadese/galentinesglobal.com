import * as strings from "data/phils-vision/strings";
import { ServiceIDs } from "data/phils-vision/services/ids";
import { eventCoverage } from "./event-coverage";
import { PriceType } from "types";

const { HOURLY, FIXED, STARTING } = PriceType;

export const allServices = [
  {
    id: ServiceIDs.PERSONAL,
    name: strings.PERSONAL,
    description:
      "Our personalized photoshoots capture your unique essence, ensuring you stand out. With attention to detail and a focus on your best angles, our sessions guarantee stunning results. Book a personal photoshoot with us to make a lasting impression.",
    pagePath: `/services/${ServiceIDs.PERSONAL}`,
    featuredImage: {
      path: require("data/phils-vision/images/personal-shoot.jpeg"),
      altText: "",
    },
    price: { value: 75, type: STARTING },
    prices: [
      { name: 'Head Shots', value: 75, type: FIXED },
      { name: 'Portraits', value: 125, type: FIXED },
      { name: 'Birthday Shoot', value: 200, type: HOURLY },
    ],
  },
  {
    id: ServiceIDs.COMMERCIAL,
    name: strings.COMMERCIAL,
    description:
      "From mouth-watering food shots to product photography that sells, and dazzling fashion imagery, we specialize in capturing the essence of your brand. Our content creation services ensure your online presence is captivating and engaging, driving audience interaction and brand loyalty.",
    pagePath: `/services/${ServiceIDs.COMMERCIAL}`,
    featuredImage: {
      path: require("data/phils-vision/images/content-creation.jpeg"),
      altText: "",
    },
    price: { value: 150, type: STARTING },
    prices: [
      { name: 'Food Shoot', value: 150, type: HOURLY },
      { name: 'Product Shoot', value: 150, type: HOURLY },
      { name: 'Fashion Shoot', value: 175, type: HOURLY },
      { name: 'Content Creation', value: 250, type: HOURLY },
    ],
  },
  {
    id: ServiceIDs.FORMAL_EVENT_COVERAGE,
    name: strings.FORMAL_EVENT_COVERAGE,
    description:
      "With a keen eye for detail and a commitment to capturing precious moments, we specialize in immortalizing dinners and corporate events. We ensure seamless coverage, preserving every smile, laugh, and heartfelt moment for generations to come. Trust us to document your event with professionalism, style, and grace.",
    pagePath: `/services/${ServiceIDs.FORMAL_EVENT_COVERAGE}`,
    featuredImage: {
      path: require("data/phils-vision/images/formal-event-coverage.jpeg"),
      altText: "",
    },
    price: { value: 250, type: HOURLY },
  },
  {
    id: ServiceIDs.EVENT_COVERAGE,
    name: strings.EVENT_COVERAGE,
    description:
      "We specialize in immortalizing every romantic moment, from the first kiss to the last dance. With a blend of candid shots and elegant portraits, we'll ensure your wedding memories last a lifetime. Trust us to capture the magic of your special day. ",
    pagePath: `/services/${ServiceIDs.EVENT_COVERAGE}`,
    featuredImage: {
      path: require("data/phils-vision/images/wedding-coverage.jpeg"),
      altText: "",
    },
    services: eventCoverage
  }
];
