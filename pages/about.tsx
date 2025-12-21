import React from "react";
import Layout from "components/layout";
import { getBusinessById } from "helpers";
import { Business } from "types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import styles from "./about.module.scss";

interface AboutPageProps {
  business: string;
}

export default function AboutPage({ business: stringifiedBusinessObj }: AboutPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      <section style={{ 
        padding: '5rem 5%',
        background: 'linear-gradient(180deg, rgba(255, 182, 193, 0.1) 0%, transparent 50%, rgba(255, 182, 193, 0.05) 100%)'
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto 4rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem', 
            letterSpacing: '2px',
            background: 'linear-gradient(135deg, rgb(54, 5, 8) 0%, rgb(255, 107, 107) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(255, 107, 107, 0.2))'
          }}>
            About Galentines
          </h1>
          <p style={{ 
            fontSize: '0.875rem',
            marginBottom: '2rem',
            fontWeight: 500,
            color: 'rgb(255, 107, 107)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Empowering Women Through Faith
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1rem', 
            lineHeight: '1.75rem' 
          }}>
            Galentines is a faith-based organization founded by Shile Adeyoyin, dedicated to hosting powerful annual gatherings that bring women together in celebration of God&apos;s love and sisterhood.
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1rem', 
            lineHeight: '1.75rem' 
          }}>
            Every February, Galentines hosts a signature event that creates a sacred space for women to worship, connect, and experience spiritual renewal. Each year features a unique theme designed to address the spiritual needs and aspirations of women seeking deeper intimacy with Christ.
          </p>
        </div>

        <div className={styles.aboutCards}>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <FavoriteIcon sx={{ fontSize: '2.5rem', color: 'rgb(255, 107, 107)' }} />
            </div>
            <h3 className={styles.cardTitle}>Our Mission</h3>
            <p className={styles.cardDescription}>
              To create transformative experiences where women encounter the healing, delivering, and transforming love of Jesus Christ.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <PeopleIcon sx={{ fontSize: '2.5rem', color: 'rgb(255, 107, 107)' }} />
            </div>
            <h3 className={styles.cardTitle}>Our Community</h3>
            <p className={styles.cardDescription}>
              A sisterhood of women from diverse backgrounds united by faith, supporting one another in spiritual growth and kingdom purpose.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <CalendarTodayIcon sx={{ fontSize: '2.5rem', color: 'rgb(255, 107, 107)' }} />
            </div>
            <h3 className={styles.cardTitle}>Annual Event</h3>
            <p className={styles.cardDescription}>
              Every February, we gather for a powerful day of worship, teaching, and fellowship centered on a transformative biblical theme.
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
