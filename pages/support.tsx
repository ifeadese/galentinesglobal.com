import React from "react";
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
      <section style={{ 
        padding: '3rem 5%',
        background: `linear-gradient(180deg, rgba(255, 192, 203, 0.1) 0%, transparent 50%, rgba(255, 192, 203, 0.05) 100%)`
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto 2rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem', 
            letterSpacing: '2px',
            background: `linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary) 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px var(--shadow-soft))'
          }}>
            To the Willing Hearted
          </h1>
          <p style={{ 
            fontSize: '0.875rem',
            marginBottom: '2rem',
            fontWeight: 500,
            color: 'var(--color-primary)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Partner with Us
          </p>
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
              backgroundImage: `url('https://media.gettyimages.com/id/1408412107/photo/storing-the-donations.jpg?b=1&s=2048x2048&w=0&k=20&c=IKgHUEXDjvXQo1S2A_rk0AFEpzislJZ0oHF5VJxl9cA=')`
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
