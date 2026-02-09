import { CMSContent } from "types";

export const CMS: CMSContent = {
  general: {
    id: 'GALENTINESGLOBAL',
    name: 'Galentines: The Love of God Conference',
    description: "Annual Ladies' Christian Faith Conference",
    marketingCopy: 'Empowering Women Through Faith',
    contactEmailAddress: 'galentineglobal@gmail.com',
    logo: "/images/galentines-gradient-logo.svg",
    logoAlt: "Galentines Global",
    instagramPageUrl: "https://www.instagram.com/galentineglobal",
  },
  home: {
    heroImage: "/images/panelists.jpeg",
    heroImageAlt: "Galentines Conference Panelists",
    heroImages: [
      "/images/panelists.jpeg",
      "/images/ladies.JPG",
      "/images/2024-stage.JPG",
      "/images/selfie.JPG",
      "/images/held-hands.jpg",
    ],
    carouselImages: [
      "/images/anu.jpeg",
      "/images/whitney.jpeg",
      "/images/volunteer.jpeg",
      "/images/prayer.jpg",
      "/images/dance.jpeg",
      "/images/worship.jpeg",
      "/images/joy.jpg",
    ],
    mainLogo: "/images/the-love-of-god.svg",
    mainLogoAlt: "The Love of God",
    verse: "..to know the love of Christ which passes knowledge; that you might be filled with all the fullness of God.\" - Ephesians 3:19",
    eventDate: "Every February",
    venueAddress: "Ottawa, ON",
  },
  about: {
    heroTitle: "About Galentines",
    heroSubtitle: "Empowering Women Through Faith",
    heroImage: "/images/ladies.JPG",
    heroImageAlt: "Galentines Community",
    paragraphs: [
      "Galentines Global is more than a love month gathering. It is a movement, where women experience the healing & transforming power of God through prayer, worship and fellowship.",
      "By God's beautiful grace, Galentines Global has held annually since 2023. We've explored several powerful themes such as boldness, purpose and newness, but our vision remains the same — to bring women into the revelation of the Fathers love and the fullness of who they truly are in God."
    ],
    features: [
      {
        icon: "favorite",
        title: "Healing Hurting Hearts",
        description: "Through prayer, worship, and authentic fellowship, we create a space where women find healing and restoration in God's perfect love."
      },
      {
        icon: "visibility",
        title: "Revealing The Fathers Love",
        description: "We help women encounter the unconditional, transformative love of the Father that reveals their true identity and worth in Christ."
      },
      {
        icon: "directions_walk",
        title: "Walking in Purpose",
        description: "Empowering women to discover and walk confidently in their God-given purpose, living out their calling with boldness and faith."
      }
    ]
  },
  support: {
    heroTitle: "To the Willing Hearted",
    heroSubtitle: "Work With Us",
    heroImage: "/images/support.jpeg",
    heroImageAlt: "Support Galentines",
    paragraphs: [
      "The Love of God Conference is made possible through the generous support of willing-hearted individuals and organizations who share our vision of empowering women through faith.",
      "Partner with us to create a transformative experience where women encounter the love of Jesus Christ. Your sponsorship provides exceptional teaching, worship, and fellowship while keeping the conference accessible to all."
    ],
    cards: [
      {
        title: "Volunteer With Us",
        image: "/images/volunteer.jpeg",
        link: "/volunteer",
        openInNewTab: false
      },
      {
        title: "Partner With Us",
        image: "https://media.gettyimages.com/id/1481369151/photo/female-manager-leading-a-meeting-about-sustainability-and-ethnicity-with-her-multiethnic.jpg?b=1&s=2048x2048&w=0&k=20&c=WFD6-6VUSvtbGsZLqgJtlL79j_lXFACTZ4PQTLO_rM0=",
        link: "/contact",
        openInNewTab: false
      }
    ]
  },
  error404: {
    title: "We don't have this page",
    message: "Your URL is probably invalid. Make sure you have the correct one.",
    image: "/images/404.png",
    imageAlt: "404",
    buttonText: "Return Home",
    buttonLink: "/"
  }
};


