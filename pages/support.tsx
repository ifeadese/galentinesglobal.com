import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import Layout from "components/layout";
import Button from "components/button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import styles from "./support.module.scss";

// Move tierCards outside component to prevent recreation on every render
const getTierCards = (emailAddress: string) => [
  {
    icon: "💰",
    title: "Make Donations",
    description1: `Your financial generosity via Interac transfers to <strong>${emailAddress}</strong> makes it possible for us to allocate funds to the expenses necessary for the event.`,
    description2: "Funds may be allocated to expenses such as venue booking, technical equipment rentals, refreshments and hospitality care supplies, shuttle services, travel expenses etc."
  },
  {
    icon: "🏛️",
    title: "Provide a Venue",
    description1: "A safe and ideal space where women can gather, worship, and encounter God uninterruptedly. Your venue becomes a sacred space where lives are changed.",
    description2: "We're open to support from churches, event centers or community halls that can accommodate our attendees comfortably and provide the atmosphere needed for transformation."
  },
  {
    icon: "🎁",
    title: "Provide Resources",
    description1: "By providing resources, gifts, or branded materials, you're extending the experience into their daily lives and creating lasting reminders of God's faithfulness.",
    description2: "These could be free services, care packages, devotionals and books, journals for reflection, branded resources and materials etc. Your contribution helps women continue their journey long after the event ends."
  },
  {
    icon: "🍽️",
    title: "Provide Hospitality",
    description1: "By providing meals and refreshments, you're creating moments of connection and care for our attendees. Food brings people together and creates opportunities for meaningful conversations.",
    description2: "These could be ready-made meals, hot or cold drinks, pastries, snacks at refreshment stations during the event. Your hospitality ensures that physical needs are met so attendees remain refreshed."
  }
];

export default function SupportPage() {
  const event = getEventFromCMS(CMS);
  const [currentTierIndex, setCurrentTierIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize tierCards to prevent recreation on every render
  const tierCards = useMemo(() => getTierCards(event.contactEmailAddress), [event.contactEmailAddress]);

  // Detect mobile viewport (carousel on tablet and mobile screens)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    
    // Debounce resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoize navigation functions to prevent unnecessary re-renders
  const goToPreviousTier = useCallback(() => {
    setCurrentTierIndex((prev) => 
      prev === 0 ? tierCards.length - 1 : prev - 1
    );
  }, [tierCards.length]);

  const goToNextTier = useCallback(() => {
    setCurrentTierIndex((prev) => 
      prev === tierCards.length - 1 ? 0 : prev + 1
    );
  }, [tierCards.length]);


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
      {/* Impact Story Section */}
      <section className={styles.impactStory}>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Support Galentines</h1>
          <p className={styles.contentSubtitle}>Together, We Change Lives</p>
        </div>
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
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
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
                    {/* Real cards only - simple loop */}
                    {tierCards.map((card, index) => (
                      <div key={index} className={styles.tierCard}>
                        <div className={styles.iconContainer}>{card.icon}</div>
                        <h3>{card.title}</h3>
                        {index === 0 ? (
                          <>
                            <p>Your financial generosity via Interac transfers to <strong>{event.contactEmailAddress}</strong> makes it possible for us to allocate funds to the expenses necessary for the event.</p>
                            <p>{card.description2}</p>
                          </>
                        ) : (
                          <>
                            <p>{card.description1}</p>
                            <p>{card.description2}</p>
                          </>
                        )}
                      </div>
                    ))}
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
                <div className={styles.tierCard}>
                  <div className={styles.iconContainer}>💰</div>
                  <h3>Make Donations</h3>
                  <p>Your financial generosity via Interac transfers to <strong>{event.contactEmailAddress}</strong> makes it possible for us to allocate funds to the expenses necessary for the event.</p>
                  <p>Funds may be allocated to expenses such as venue booking, technical equipment rentals, refreshments and hospitality care supplies, shuttle services, travel expenses etc.</p>
                </div>

                <div className={styles.tierCard}>
                  <div className={styles.iconContainer}>🏛️</div>
                  <h3>Provide a Venue</h3>
                  <p>A safe and ideal space where women can gather, worship, and encounter God uninterruptedly. Your venue becomes a sacred space where lives are changed.</p>
                  <p>We&apos;re open to support from churches, event centers or community halls that can accommodate our attendees comfortably and provide the atmosphere needed for transformation.</p>
                </div>

                <div className={styles.tierCard}>
                  <div className={styles.iconContainer}>🎁</div>
                  <h3>Provide Resources</h3>
                  <p>By providing resources, gifts, or branded materials, you&apos;re extending the experience into their daily lives and creating lasting reminders of God&apos;s faithfulness.</p>
                  <p>These could be free services, care packages, devotionals and books, journals for reflection, branded resources and materials etc. Your contribution helps women continue their journey long after the event ends.</p>
                </div>

                <div className={styles.tierCard}>
                  <div className={styles.iconContainer}>🍽️</div>
                  <h3>Provide Hospitality</h3>
                  <p>By providing meals and refreshments, you&apos;re creating moments of connection and care for our attendees. Food brings people together and creates opportunities for meaningful conversations.</p>
                  <p>These could be ready-made meals, hot or cold drinks, pastries, snacks at refreshment stations during the event. Your hospitality ensures that physical needs are met so attendees remain refreshed.</p>
                </div>
              </div>
            )}
          </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaImageContainer}>
          <Image 
            src="/images/support-2.JPG"
            alt="Women gathering in faith and community"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
          <div className={styles.ctaOverlay}></div>
        </div>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Thank You!</h2>
          <p className={styles.ctaText}>Your support is an act of faith. Whether time, talent, or treasure—every contribution matters and is deeply appreciated.</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className={styles.ctaButtonLink}>
              <Button variant="primary">
                Contact Us
              </Button>
            </Link>
            <Link href="/volunteer" className={styles.ctaButtonLink}>
              <Button variant="secondary">
                Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}


