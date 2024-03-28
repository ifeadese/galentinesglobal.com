import * as strings from "data/phils-vision/strings";
import { PriceType } from "types";
import { ServiceIDs } from "data/phils-vision/services/ids";
const { HOURLY, FIXED, STARTING } = PriceType;

export const eventCoverage = [
  {
    id: ServiceIDs.WEDDING_COVERAGE_PHOTO,
    name: strings.WEDDING_COVERAGE_PHOTO,
    description:
      "Every shot needs to tell a story of love and devotion. From the exchanging of vows to the joyous celebrations, we'll document every detail of your special day and ensure your memories are preserved with elegance. Trust us to deliver stunning images that you'll cherish for a lifetime.",
    pagePath: `/services/${ServiceIDs.EVENT_COVERAGE}/${ServiceIDs.WEDDING_COVERAGE_PHOTO}`,
    featuredImage: {
      path: require("data/phils-vision/images/wedding-coverage-4.jpeg"),
      altText: "",
    },
    price: { value: 500, type: STARTING },
    prices: [
      { name: 'Elopement Package', value: 500, type: FIXED },
      { name: 'Silver Package', value: 2000, type: FIXED },
      { name: 'Gold Package', value: 2500, type: FIXED },
      { name: 'Platinum Package', value: 2900, type: FIXED },
    ],
  },
  {
    id: ServiceIDs.WEDDING_COVERAGE_VIDEO,
    name: strings.WEDDING_COVERAGE_VIDEO,
    description:
      "Every frame is a piece of your love story. Let's help you relive the magic of your wedding day by capturing the raw emotion and authentic moments that make your day unforgettable. We'll create a captivating film that turns your most cherished wedding moments into a timeless masterpiece.",
    pagePath: `/services/${ServiceIDs.EVENT_COVERAGE}/${ServiceIDs.WEDDING_COVERAGE_VIDEO}`,
    featuredImage: {
      path: require("data/phils-vision/images/wedding-coverage-3.jpeg"),
      altText: "",
    },
    price: { value: 500, type: STARTING },
    prices: [
      { name: 'Elopement Package', value: 500, type: FIXED },
      { name: 'Silver Package', value: 2000, type: FIXED },
      { name: 'Gold Package', value: 2500, type: FIXED },
      { name: 'Platinum Package', value: 2900, type: FIXED },
    ],
  },
  {
    id: ServiceIDs.WEDDING_COVERAGE_COMBO,
    name: strings.WEDDING_COVERAGE_COMBO,
    description:
      "This comprehensive package ensures your special day is beautifully documented by combining the artistry of photography and the storytelling of videography. You get to experience the best of both worlds.",
    pagePath: `/services/${ServiceIDs.EVENT_COVERAGE}/${ServiceIDs.WEDDING_COVERAGE_COMBO}`,
    featuredImage: {
      path: require("data/phils-vision/images/wedding-coverage.jpeg"),
      altText: "",
    },
    price: { value: 900, type: STARTING },
    prices: [
      { name: 'Elopement Package', value: 900, type: FIXED },
      { name: 'Silver Package', value: 3600, type: FIXED },
      { name: 'Gold Package', value: 4500, type: FIXED },
      { name: 'Platinum Package', value: 5220, type: FIXED },
    ],
  }
];
