import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "data/cms-types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import styles from "./about.module.scss";

interface AboutPageProps {
  cms: string;
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

export default function AboutPage({ cms: stringifiedCMS }: AboutPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const aboutContent = cms.about;

  return (
    <Layout event={event}>
      <TitleHero
        image={aboutContent.heroImage || "/images/ladies.jpeg"}
        imageAlt={aboutContent.heroImageAlt || "Galentines Community"}
        title={aboutContent.heroTitle || "About Galentines"}
        subtitle={aboutContent.heroSubtitle || "Empowering Women Through Faith"}
      />

      {/* Content Section */}
      <section style={{ 
        padding: '2rem 5%',
        background: `linear-gradient(180deg, rgba(255, 192, 203, 0.1) 0%, transparent 50%, rgba(255, 192, 203, 0.05) 100%)`
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto 2rem', textAlign: 'center' }}>
          {aboutContent.paragraphs?.map((paragraph, index) => (
            <p key={index} style={{ 
              fontSize: '0.875rem', 
              marginBottom: '1rem', 
              lineHeight: '1.75rem' 
            }}>
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
    </Layout>
  );
}

export const getStaticProps = () => {
  return {
    props: {
      cms: JSON.stringify(getCMSById(process.env.EVENT_ID)),
    },
  };
};
