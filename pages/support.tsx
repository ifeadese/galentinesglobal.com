import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import Button from "components/button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import styles from "./support.module.scss";

export default function SupportPage() {
  const event = getEventFromCMS(CMS);
  const [currentTierIndex, setCurrentTierIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport (carousel on tablet and mobile screens)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToPreviousTier = () => {
    setCurrentTierIndex((prev) => 
      prev === 0 ? 3 : prev - 1
    );
  };

  const goToNextTier = () => {
    setCurrentTierIndex((prev) => 
      prev === 3 ? 0 : prev + 1
    );
  };


  return (
    <Layout 
      event={event}
      seo={{
        title: "Support Galentines",
        description: "Partner with us to empower women through faith. Your support makes transformation possible—providing space, resources, and support for women to encounter God and discover their calling.",
        image: "/images/ladies.JPG",
        url: `${SITE_URL}/support`,
        type: "website",
      }}
    >
      <TitleHero
        image="/images/panelists-2.JPG"
        imageAlt="Women gathering in faith and community"
        title="Support Galentines"
        subtitle="Together, We Change Lives"
      />

      {/* Impact Story Section */}
      <section className={styles.impactStory}>
        <div className={styles.storyContent}>
          <p>Since our launch in 2023, Galentines has been a catalyst in enabling women find community, encouragement, and renewed purpose. While we&apos;re still growing and learning, we can testify of God touching lives and hearts in ways that matter.</p>
          <p>We&apos;re also grateful for our volunteers and community for their support. However, making this happen requires real resources: booking venues, equipment rentals, preparing meals, and countless details coordinated.</p>
          <p>We&apos;re doing our best to steward every contribution well. Your support—whether financial, in-kind, or through service—makes it possible for us to continue building something that&apos;s already showing promise. We&apos;re genuinely grateful for your support.</p>
        </div>
      </section>

      {/* Interac e-Transfer Information Section */}
      <section className={styles.makeADonation}>
        <div className={styles.financialLayout}>
          <div className={styles.financialLeftContainer}>
            <div className={styles.logoContainer}>
              <div className={styles.logoWrapper}>
                <Image 
                  src="/images/interac-logo.png"
                  alt="Interac e-Transfer"
                  width={150}
                  height={150}
                  objectFit="contain"
                />
              </div>
              <p className={styles.contributionText}>
                Accepting donations at: <strong className={styles.emailAddress}>{event.contactEmailAddress}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Support Section */}
      <section className={styles.waysToSupport}>
        <div className={styles.tiersIntro}>
          <h2>Ways to Support</h2>
        </div>
        {isMobile ? (
          <>
            <div className={styles.tiersCarousel}>
              <div 
                className={styles.tiersCarouselTrack}
                style={{
                  transform: `translateX(-${currentTierIndex * 100}%)`,
                }}
              >
                <div className={`${styles.tierCard} ${styles.financialCard}`}>
                  <div className={styles.tierIcon}>💰</div>
                  <h3>Make Donations</h3>
                  <p>Your financial generosity via Interac transfers to <strong>{event.contactEmailAddress}</strong> makes it possible for us to allocate funds to the expenses necessary for the event.</p>
                  <p>Funds may be allocated to expenses such as venue booking, technical equipment rentals, refreshments and hospitality care supplies, shuttle services, travel expenses etc.</p>
                </div>

                <div className={`${styles.tierCard} ${styles.venueCard}`}>
                  <div className={styles.tierIcon}>🏛️</div>
                  <h3>Provide a Venue</h3>
                  <p>A safe and ideal space where women can gather, worship, and encounter God uninterruptedly. Your venue becomes a sacred space where lives are changed.</p>
                  <p>We&apos;re open to support from churches, event centers or community halls that can accommodate our attendees comfortably and provide the atmosphere needed for transformation.</p>
                </div>

                <div className={`${styles.tierCard} ${styles.resourcesCard}`}>
                  <div className={styles.tierIcon}>🎁</div>
                  <h3>Provide Resources</h3>
                  <p>By providing resources, gifts, or branded materials, you&apos;re extending the experience into their daily lives and creating lasting reminders of God&apos;s faithfulness.</p>
                  <p>These could be free services, care packages, devotionals and books, journals for reflection, branded resources and materials etc. Your contribution helps women continue their journey long after the event ends.</p>
                </div>

                <div className={`${styles.tierCard} ${styles.hospitalityCard}`}>
                  <div className={styles.tierIcon}>🍽️</div>
                  <h3>Provide Hospitality</h3>
                  <p>By providing meals and refreshments, you&apos;re creating moments of connection and care for our attendees. Food brings people together and creates opportunities for meaningful conversations.</p>
                  <p>These could be ready-made meals, hot or cold drinks, pastries, snacks at refreshment stations during the event. Your hospitality ensures that physical needs are met so attendees remain refreshed.</p>
                </div>
              </div>
            </div>
            <div className={styles.tiersNavigation}>
              <button
                className={styles.navButton}
                onClick={goToPreviousTier}
                aria-label="Previous tier"
              >
                <ArrowBackIosIcon />
              </button>
              <button
                className={styles.navButton}
                onClick={goToNextTier}
                aria-label="Next tier"
              >
                <ArrowForwardIosIcon />
              </button>
            </div>
          </>
        ) : (
          <div className={styles.tiersContainer}>
            <div className={`${styles.tierCard} ${styles.financialCard}`}>
              <div className={styles.tierIcon}>💰</div>
              <h3>Make Donations</h3>
              <p>Your financial generosity via Interac transfers to <strong>{event.contactEmailAddress}</strong> makes it possible for us to allocate funds to the expenses necessary for the event.</p>
              <p>Funds may be allocated to expenses such as venue booking, technical equipment rentals, refreshments and hospitality care supplies, shuttle services, travel expenses etc.</p>
            </div>

            <div className={`${styles.tierCard} ${styles.venueCard}`}>
              <div className={styles.tierIcon}>🏛️</div>
              <h3>Provide a Venue</h3>
              <p>A safe and ideal space where women can gather, worship, and encounter God uninterruptedly. Your venue becomes a sacred space where lives are changed.</p>
              <p>We&apos;re open to support from churches, event centers or community halls that can accommodate our attendees comfortably and provide the atmosphere needed for transformation.</p>
            </div>

            <div className={`${styles.tierCard} ${styles.resourcesCard}`}>
              <div className={styles.tierIcon}>🎁</div>
              <h3>Provide Resources</h3>
              <p>By providing resources, gifts, or branded materials, you&apos;re extending the experience into their daily lives and creating lasting reminders of God&apos;s faithfulness.</p>
              <p>These could be free services, care packages, devotionals and books, journals for reflection, branded resources and materials etc. Your contribution helps women continue their journey long after the event ends.</p>
            </div>

            <div className={`${styles.tierCard} ${styles.hospitalityCard}`}>
              <div className={styles.tierIcon}>🍽️</div>
              <h3>Provide Hospitality</h3>
              <p>By providing meals and refreshments, you&apos;re creating moments of connection and care for our attendees. Food brings people together and creates opportunities for meaningful conversations.</p>
              <p>These could be ready-made meals, hot or cold drinks, pastries, snacks at refreshment stations during the event. Your hospitality ensures that physical needs are met so attendees remain refreshed.</p>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Thank You!</h2>
          <p>Your support is honored beyond partnership. It&apos;s an act of faith which can be expressed in many forms. Whatever you have to offer; time, talent, or treasure—it&apos;ll be greatly appreciated.</p>
          <div className={styles.ctaButtons}>
            <a href={`mailto:${event.contactEmailAddress}?subject=Support Inquiry`} className={styles.ctaButtonLink}>
              <Button variant="primary">
                Contact Us
              </Button>
            </a>
            <a href="https://galentines.fillout.com/volunteers" target="_blank" rel="noopener noreferrer" className={styles.ctaButtonLink}>
              <Button variant="secondary">
                Volunteer
                <OpenInNewIcon sx={{ fontSize: '1rem', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}


