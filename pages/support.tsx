import React from "react";
import Layout from "components/layout";
import Button from "components/button";
import { getBusinessById } from "helpers";
import { Business } from "types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HandshakeIcon from "@mui/icons-material/Handshake";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import styles from "./support.module.scss";

interface SupportPageProps {
  business: string;
}

export default function SupportPage({ business: stringifiedBusinessObj }: SupportPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      {/* First Section: To the Willing Hearted */}
      <section style={{ 
        padding: '5rem 5%', 
        background: 'linear-gradient(to bottom right, #f5f5f5, white, #f5f5f5)' 
      }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '2px' }}>
            To the Willing Hearted
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.75rem' }}>
            The Love of God Conference is made possible through the generous support of willing-hearted individuals and organizations who share our vision of empowering women through faith.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.75rem' }}>
            Partner with us to create a transformative experience where women encounter the love of Jesus Christ. Your sponsorship provides exceptional teaching, worship, and fellowship while keeping the conference accessible to all.
          </p>
        </div>
      </section>

      {/* Second Section: Volunteer with Us */}
      <section style={{ padding: '3rem 5%', background: 'white' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className={styles.supportGrid}>
            <div className={styles.imageContainer}>
              <img 
                alt="Women volunteers working together" 
                src="https://media.gettyimages.com/id/1408412107/photo/storing-the-donations.jpg?b=1&s=2048x2048&w=0&k=20&c=IKgHUEXDjvXQo1S2A_rk0AFEpzislJZ0oHF5VJxl9cA="
              />
            </div>
            <div>
              <div className={styles.supportIconLeft} style={{ marginBottom: '1.5rem' }}>
                <FavoriteIcon sx={{ fontSize: '3rem', color: 'rgb(255, 107, 107)' }} />
              </div>
              <h2 className={styles.supportTextLeft} style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem', 
                letterSpacing: '2px'
              }}>
                Volunteer with Us
              </h2>
              <p className={styles.supportTextLeft} style={{ 
                fontSize: '0.875rem', 
                color: '#666', 
                marginBottom: '1.5rem', 
                lineHeight: '1.75rem'
              }}>
                Help us create a joy-filled, transformative experience for women at The Love of God Conference.
              </p>
              <p className={styles.supportTextLeft} style={{ 
                fontSize: '0.875rem', 
                color: '#666', 
                marginBottom: '2rem', 
                lineHeight: '1.75rem'
              }}>
                Opportunities to serve: Set up & Take down, Communications, Social Media, Hospitality, Project Management, Event Decoration, Guest Experience, Guest Ministers Care/Gifts, and Photography/Videography.
              </p>
              <div className={styles.supportButtonLeft}>
                <Button
                  variant="primary"
                  onClick={() => window.open('https://galentines.fillout.com/volunteers', '_blank')}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '1.125rem',
                    padding: '1rem 2rem'
                  }}
                >
                  Volunteer at Galentines
                  <OpenInNewIcon sx={{ fontSize: '1.25rem' }} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section: Become a Partner */}
      <section style={{ 
        padding: '3rem 5%', 
        background: 'linear-gradient(to bottom right, rgb(255, 107, 107), #ffb6c1, #ffb6c1)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div className={styles.supportGrid}>
            <div>
              <div className={styles.supportIconRight} style={{ marginBottom: '1.5rem' }}>
                <HandshakeIcon sx={{ fontSize: '3rem', color: 'white' }} />
              </div>
              <h2 className={styles.supportTextRight} style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem', 
                letterSpacing: '2px',
                color: 'white'
              }}>
                Become a Partner
              </h2>
              <p className={styles.supportTextRight} style={{ 
                fontSize: '0.875rem', 
                marginBottom: '2rem', 
                lineHeight: '1.75rem',
                opacity: 0.9,
                color: 'white'
              }}>
                Join us through sponsorship, volunteering, or custom partnership. Together, we can create an unforgettable experience that draws women closer to the love of God.
              </p>
              <div className={styles.supportButtonRight}>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/contact'}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    fontSize: '1.125rem',
                    padding: '1rem 2rem'
                  }}
                >
                  Sponsor Galentines
                </Button>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <img 
                alt="Women collaborating in partnership" 
                src="https://media.gettyimages.com/id/1481369151/photo/female-manager-leading-a-meeting-about-sustainability-and-ethnicity-with-her-multiethnic.jpg?b=1&s=2048x2048&w=0&k=20&c=WFD6-6VUSvtbGsZLqgJtlL79j_lXFACTZ4PQTLO_rM0="
              />
            </div>
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
