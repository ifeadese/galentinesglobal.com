import React from "react";
import Image from "next/legacy/image";
import Layout from "components/layout";
import { getBusinessById } from "helpers";
import { Business } from "types";
import styles from "./support.module.scss";

interface SupportPageProps {
  business: string;
}

export default function SupportPage({ business: stringifiedBusinessObj }: SupportPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      {/* Hero Section with Background Image */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image 
            src="/images/support.jpeg" 
            alt="Support Galentines" 
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>To the Willing Hearted</h1>
          <p className={styles.heroSubtitle}>Work With Us</p>
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
            The Love of God Conference is made possible through the generous support of willing-hearted individuals and organizations who share our vision of empowering women through faith.
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1rem', 
            lineHeight: '1.75rem' 
          }}>
            Partner with us to create a transformative experience where women encounter the love of Jesus Christ. Your sponsorship provides exceptional teaching, worship, and fellowship while keeping the conference accessible to all.
          </p>
        </div>

        <div className={styles.supportCards}>
          <div 
            className={styles.featureCard}
            style={{
              backgroundImage: `url('/images/volunteer.jpeg')`
            }}
            onClick={() => window.open('https://galentines.fillout.com/volunteers', '_blank')}
          >
            <div className={styles.overlay}></div>
            <h3 className={styles.cardTitle}>Volunteer With Us</h3>
          </div>

          <div 
            className={styles.featureCard}
            style={{
              backgroundImage: `url('https://media.gettyimages.com/id/1481369151/photo/female-manager-leading-a-meeting-about-sustainability-and-ethnicity-with-her-multiethnic.jpg?b=1&s=2048x2048&w=0&k=20&c=WFD6-6VUSvtbGsZLqgJtlL79j_lXFACTZ4PQTLO_rM0=')`
            }}
            onClick={() => window.location.href = '/contact'}
          >
            <div className={styles.overlay}></div>
            <h3 className={styles.cardTitle}>Partner With Us</h3>
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
