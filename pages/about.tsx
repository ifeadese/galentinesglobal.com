import React from "react";
import Image from "next/legacy/image";
import Layout from "components/layout";
import { getBusinessById } from "helpers";
import { Business } from "types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import styles from "./about.module.scss";

interface AboutPageProps {
  business: string;
}

export default function AboutPage({ business: stringifiedBusinessObj }: AboutPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      {/* Hero Section with Background Image */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image 
            src="/images/ladies.jpeg" 
            alt="Galentines Community" 
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About Galentines</h1>
          <p className={styles.heroSubtitle}>Empowering Women Through Faith</p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ 
        padding: '2rem 5%',
        background: `linear-gradient(180deg, rgba(255, 192, 203, 0.1) 0%, transparent 50%, rgba(255, 192, 203, 0.05) 100%)`
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto 2rem', textAlign: 'center' }}>
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1rem', 
            lineHeight: '1.75rem' 
          }}>
            Galentines is more than a love month gathering. It is a movement, where women experience the healing & transforming power of God through prayer, worship and fellowship.
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1rem', 
            lineHeight: '1.75rem' 
          }}>
By Gods beautiful grace, Galentines has held annually since 2023. We’ve explored several powerful themes such as boldness, purpose and newness, but our vision remains the same — to bring women into the revelation of the Fathers love and the fullness of who they truly are in God.
          </p>
        </div>

        <div className={styles.aboutCards}>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <FavoriteIcon sx={{ fontSize: '2.5rem', color: 'var(--color-primary)' }} />
            </div>
            <h3 className={styles.cardTitle}>Healing Hurting Hearts</h3>
            <p className={styles.cardDescription}>
              Through prayer, worship, and authentic fellowship, we create a space where women find healing and restoration in God&apos;s perfect love.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <VisibilityIcon sx={{ fontSize: '2.5rem', color: 'var(--color-primary)' }} />
            </div>
            <h3 className={styles.cardTitle}>Revealing The Fathers Love</h3>
            <p className={styles.cardDescription}>
              We help women encounter the unconditional, transformative love of the Father that reveals their true identity and worth in Christ.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <DirectionsWalkIcon sx={{ fontSize: '2.5rem', color: 'var(--color-primary)' }} />
            </div>
            <h3 className={styles.cardTitle}>Walking in Purpose</h3>
            <p className={styles.cardDescription}>
              Empowering women to discover and walk confidently in their God-given purpose, living out their calling with boldness and faith.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps = () => ({
  props: {
    business: JSON.stringify(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  },
});
