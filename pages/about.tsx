import React from "react";
import Layout from "components/layout";
import FounderCard from "components/founder-card";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { SITE_URL } from "../constants";
import styles from "./about.module.scss";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "favorite":
      return FavoriteIcon;
    case "visibility":
      return VisibilityIcon;
    case "directions_walk":
      return DirectionsWalkIcon;
    default:
      return FavoriteIcon;
  }
};

export default function AboutPage() {
  const event = getEventFromCMS(CMS);
  const aboutContent = CMS.about;

  // Founder data - shared with team page
  const founderData = {
    name: "Shile Adeyoyin",
    role: "Founder & Steward",
    image: "/images/founder.jpeg",
    imageAlt: "Shile Adeyoyin, Founder & Steward of Galentines Global",
    description: [
      "Shile is the visionary behind Galentines Global. A lawyer by profession and a worshipper at heart.",
      "Her passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. Her prayer is that the same love of God that found her will find every heart."
    ]
  };

  return (
    <Layout 
      event={event}
      seo={{
        title: "About Us",
        description: "Learn about Galentines Global - a movement where women experience the healing and transforming power of God through prayer, worship and fellowship.",
        image: aboutContent.heroImage || "/images/ladies.JPG",
        url: `${SITE_URL}/about`,
        type: "website",
      }}
    >
      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>{aboutContent.heroTitle!}</h1>
        </div>
        <div className={styles.paragraphsContainer}>
          {aboutContent.paragraphs?.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.aboutCards}>
          {aboutContent.features?.map((feature: Feature, index: number) => {
            const IconComponent = getIconComponent(feature.icon);
            return (
              <div key={index} className={styles.featureCard}>
                <div className={styles.iconContainer}>
                  <IconComponent sx={{ fontSize: '2.5rem', color: 'var(--color-primary)' }} />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <FounderCard
          title="Meet The Founder"
          name={founderData.name}
          role={founderData.role}
          image={founderData.image}
          imageAlt={founderData.imageAlt}
          description={founderData.description}
        />
      </section>
    </Layout>
  );
}

