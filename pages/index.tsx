import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import Button from "components/button";
import Layout from "components/layout";
import CardCarousel from "components/card-carousel";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "types";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import styles from "pages/index.module.scss";

interface HomePageProps {
  cms: string;
}

export default function HomePage({ cms: stringifiedCMS }: HomePageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const homeContent = cms.home;
  const heroImages = homeContent.heroImages || [];
  const carouselImages = homeContent.carouselImages || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://galentinesglobal.com";
  const ogImage = homeContent.heroImages?.[0] || homeContent.mainLogo || event.logo || "/images/panelists.jpeg";
  
  // Extract year from event date if it's a valid date (not "TBD")
  const eventDate = homeContent.eventDate;
  const isValidDate = eventDate && eventDate !== "TBD";
  
  // Extract year from various date formats:
  // - "February 7, 2026" -> split on comma
  // - "2026-02-07" -> split on hyphen
  // - "02/07/2026" -> split on slash
  let eventYear: string | null = null;
  if (isValidDate) {
    if (eventDate.includes(',')) {
      // Format: "February 7, 2026"
      eventYear = eventDate.split(',')[1]?.trim() || null;
    } else if (eventDate.includes('-')) {
      // Format: "2026-02-07" or "2026-02-07T..."
      const yearMatch = eventDate.match(/^(\d{4})/);
      eventYear = yearMatch ? yearMatch[1] : null;
    } else if (eventDate.includes('/')) {
      // Format: "02/07/2026" or "2/7/2026"
      const parts = eventDate.split('/');
      const lastPart = parts[parts.length - 1]?.trim();
      if (lastPart && /^\d{4}$/.test(lastPart)) {
        eventYear = lastPart;
      }
    } else {
      // Try to extract 4-digit year from anywhere in the string
      const yearMatch = eventDate.match(/\b(\d{4})\b/);
      eventYear = yearMatch ? yearMatch[1] : null;
    }
  }
  
  const seoTitle = eventYear 
    ? `The Love of God Conference ${eventYear}` 
    : undefined;

  return (
    <Layout 
      event={event}
      seo={{
        title: seoTitle,
        description: isValidDate 
          ? `${event.description} Join us on ${eventDate} for an empowering gathering of women in faith.`
          : `${event.description} Join us for an empowering gathering of women in faith.`,
        image: ogImage,
        url: siteUrl,
        type: "website",
      }}
    >
      <header className={styles.heroImage}>
        <div className={styles.slideshowContainer}>
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`${styles.slide} ${index === currentImageIndex ? styles.active : ''}`}
            >
              <Image 
                src={image} 
                alt={`${event.name} ${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
                unoptimized={false}
              />
            </div>
          ))}
        </div>
        <div className={styles.content}>
          <p className={styles.presents}>Presents...</p>
          {homeContent.mainLogo && (
            <Image 
              src={homeContent.mainLogo} 
              alt={homeContent.mainLogoAlt || event.name}
              width={750}
              height={226}
              className={styles.logo}
              quality={100}
              priority
              unoptimized
            />
          )}
          <small className={styles.verse}>
            &ldquo;{homeContent.verse}
          </small>
          <div className={styles.eventInfo}>
            <span className={styles.eventInfoItem}>
              <EventIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <small>{homeContent.eventDate}</small>
            </span>
            <span className={styles.eventInfoDivider}>•</span>
            <span className={styles.eventInfoItem}>
              <PersonIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <small>{homeContent.host}</small>
            </span>
          </div>
          <Link href="/rsvp" legacyBehavior>
            <Button variant="primary">
              RSVP Now
            </Button>
          </Link>
        </div>
      </header>

      {/* About Us Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          {cms.about.paragraphs && cms.about.paragraphs.length > 0 && (
            <div className={styles.aboutParagraphs}>
              {cms.about.paragraphs.map((paragraph, index) => (
                <p key={index} className={styles.aboutParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <Link href="/about" legacyBehavior>
            <Button 
              variant="secondary" 
              style={{
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-text-primary)',
                boxShadow: 'none',
              }}
            >
              Learn More
            </Button>
          </Link>
        </div>
        {carouselImages.length > 0 && (
          <div className={styles.carouselContainer}>
            <CardCarousel cards={carouselImages.map((image) => ({ image, title: '' }))} />
          </div>
        )}
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
