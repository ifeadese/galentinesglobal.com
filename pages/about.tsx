import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import Image from "next/legacy/image";
import Link from "next/link";
import Button from "components/button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import styles from "./about.module.scss";

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

  const founderData = {
    name: "Meet The Founder",
    role: "Shile Adeyoyin",
    image: "/images/founder.jpeg",
    imageAlt: "Shile Adeyoyin, Founder & Steward of Galentines Global",
    description: [
      "Shile is the visionary behind Galentines Global. A lawyer by profession and a worshipper at heart.",
      "Her passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. Her prayer is that the same love of God that found her will find every heart."
    ]
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://galentinesglobal.com";

  return (
    <Layout 
      event={event}
      seo={{
        title: "About Us",
        description: "Learn about Galentines Global - a movement where women experience the healing and transforming power of God through prayer, worship and fellowship.",
        image: aboutContent.heroImage || "/images/ladies.JPG",
        url: `${siteUrl}/about`,
        type: "website",
      }}
    >
      <TitleHero
        image={aboutContent.heroImage!}
        imageAlt={aboutContent.heroImageAlt!}
        title={aboutContent.heroTitle!}
        subtitle={aboutContent.heroSubtitle!}
      />

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.paragraphsContainer}>
          {aboutContent.paragraphs?.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.aboutCards}>
          {aboutContent.features?.map((feature: any, index: number) => {
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
      </section>

      {/* Founder Section */}
      <section className={styles.founderSection}>
        <div className={styles.founderContainer}>
          <div className={styles.founderCard}>
            <div className={styles.founderImageWrapper}>
              <Image
                src={founderData.image}
                alt={founderData.imageAlt}
                layout="fill"
                objectFit="cover"
                objectPosition="center top"
                className={styles.founderImage}
              />
            </div>
            <div className={styles.founderContent}>
              <h2 className={styles.founderName}>{founderData.name}</h2>
              <p className={styles.founderRole}>{founderData.role}</p>
              <div className={styles.founderDescription}>
                {founderData.description.map((paragraph, index) => (
                  <p key={index} className={styles.founderDescriptionParagraph}>
                    {paragraph}
                  </p>
                ))}
                <div className={styles.founderButton}>
                  <Link href="/team/founder" legacyBehavior>
                    <Button variant="secondary">Learn More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

