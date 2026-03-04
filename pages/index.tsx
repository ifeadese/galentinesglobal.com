import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import Button from "components/button";
import Layout from "components/layout";
import CardCarousel from "components/card-carousel";
import { getEventFromCMS, getEventDate } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "pages/index.module.scss";

interface Minister {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
}

const ministers: Minister[] = [
  {
    name: "Pst. Oyin Brandy",
    role: "Guest Speaker",
    image: "/images/oyin.jpeg",
    imageAlt: "Pst. Oyin Brandy, Guest Speaker"
  },
  {
    name: "Obianuju Harbor",
    role: "Guest Speaker",
    image: "/images/obianuju.jpeg",
    imageAlt: "Obianuju Harbor, Guest Speaker"
  },
  {
    name: "Min. Toju Temile",
    role: "Worship Lead",
    image: "/images/toju.jpeg",
    imageAlt: "Min. Toju Temile, Worship Leader"
  },
  {
    name: "Chioma Great-Nwankwo",
    role: "Worship Lead",
    image: "/images/chioma.jpeg",
    imageAlt: "Chioma Great-Nwankwo, Worship Lead"
  },
];

export default function HomePage() {
  const event = getEventFromCMS(CMS);
  const homeContent = CMS.home;
  const heroImages = homeContent.heroImages || [];
  const carouselImages = homeContent.carouselImages || [];
  const [currentMinisterIndex, setCurrentMinisterIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport (carousel only on very small screens)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToPreviousMinister = () => {
    setCurrentMinisterIndex((prev) => 
      prev === 0 ? ministers.length - 1 : prev - 1
    );
  };

  const goToNextMinister = () => {
    setCurrentMinisterIndex((prev) => 
      prev === ministers.length - 1 ? 0 : prev + 1
    );
  };

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

  // Get the event date using the same helper as the countdown component
  // This ensures consistency between structured data and countdown timer
  const eventDateObj = getEventDate(CMS);
  
  // Format date for structured data (ISO 8601)
  // Event is in February, so always EST (UTC-5)
  const formatDateForSchema = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const hour = parts.find(p => p.type === 'hour')?.value || '';
    const minute = parts.find(p => p.type === 'minute')?.value || '';
    const second = parts.find(p => p.type === 'second')?.value || '00';
    
    // February is always EST (UTC-5)
    return `${year}-${month}-${day}T${hour}:${minute}:${second}-05:00`;
  };

  // Calculate endDate (same day, 9 PM EST)
  const eventEndDate = eventDateObj 
    ? (() => {
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Toronto',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        
        const parts = formatter.formatToParts(eventDateObj);
        const year = parts.find(p => p.type === 'year')?.value || '';
        const month = parts.find(p => p.type === 'month')?.value || '';
        const day = parts.find(p => p.type === 'day')?.value || '';
        
        return `${year}-${month}-${day}T21:00:00-05:00`;
      })()
    : null;

  // Calculate validFrom date (when RSVPs opened - 6 months before event, static to avoid hydration mismatch)
  // This ensures the offer is always valid and prevents SSR/client timestamp differences
  const validFromDate = eventDateObj 
    ? (() => {
        try {
          // Set validFrom to 6 months before event date (when RSVPs typically open)
          const validFrom = new Date(eventDateObj);
          validFrom.setMonth(validFrom.getMonth() - 6);
          return validFrom.toISOString();
        } catch {
          // Fallback to a fixed date if calculation fails
          return "2024-01-01T00:00:00-05:00";
        }
      })()
    : null;

  // Event structured data schema
  const eventSchema = eventDateObj ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": formatDateForSchema(eventDateObj), // Uses same Date object as countdown (1:30 PM)
    "endDate": eventEndDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "url": SITE_URL,
    "image": `${SITE_URL}${ogImage}`,
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ottawa",
        "addressRegion": "ON",
        "addressCountry": "CA"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock",
      "url": `${SITE_URL}/rsvp`,
      ...(validFromDate && { "validFrom": validFromDate })
    },
    "performer": ministers.map(minister => ({
      "@type": "Person",
      "name": minister.name,
      "jobTitle": minister.role
    })),
    "organizer": {
      "@type": "Organization",
      "name": event.name,
      "url": SITE_URL,
      ...(event.logo && {
        "logo": `${SITE_URL}${event.logo}`,
      }),
    },
  } : null;

  return (
    <>
      {eventSchema && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(eventSchema),
            }}
          />
        </Head>
      )}
      <Layout 
        event={event}
        seo={{
          title: seoTitle,
          description: isValidDate 
            ? `${event.description} Join us on ${eventDate} for an empowering gathering of women in faith.`
            : `${event.description} Join us for an empowering gathering of women in faith.`,
          image: ogImage,
          url: SITE_URL,
          type: "website",
        }}
      >
      <header className={styles.heroImage}>
        <div className={styles.content}>
          <div className={styles.heroText}>
            <div className={styles.heroTextLine}>A Space</div>
            <div className={styles.heroTextLine}><span className={styles.boldText}>for women</span></div>
            <div className={styles.heroTextLine}>to <span className={styles.italicText}>encounter</span></div>
            <div className={styles.heroTextLine}>God's love</div>
          </div>
          <h1 style={{ 
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0
          }}>
            {event.name}
          </h1>
          <small className={styles.verse}>
            &ldquo;{homeContent.verse}
          </small>
          <a 
            href="https://www.youtube.com/@swisShile/streams" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.liveStreamButton}
          >
            <PlayArrowIcon sx={{ fontSize: '1.5rem', marginRight: '0.5rem' }} />
            Watch Live Stream
          </a>
        </div>
      </header>

      {/* Carousel Section */}
      {carouselImages.length > 0 && (
        <section className={styles.carouselSection}>
          <div className={styles.carouselContainer}>
            <CardCarousel cards={carouselImages.map((image) => ({ image, title: '' }))} />
          </div>
        </section>
      )}

      {/* About Us Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          {CMS.about.paragraphs && CMS.about.paragraphs.length > 0 && (
            <div className={styles.aboutParagraphs}>
              {CMS.about.paragraphs.map((paragraph, index) => (
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
      </section>

      {/* Ministers Section */}
      <section className={styles.ministersSection}>
        <div className={styles.ministersContainer}>
          <h2 className={styles.ministersTitle}>Our Ministers</h2>
          {isMobile ? (
            <>
              <div className={styles.ministersCarousel}>
                <div 
                  className={styles.ministersCarouselTrack}
                  style={{
                    transform: `translateX(-${currentMinisterIndex * 100}%)`,
                  }}
                >
                  {ministers.map((minister, index) => (
                    <div key={index} className={styles.ministerCard}>
                      <div className={styles.ministerImageWrapper}>
                        <Image
                          src={minister.image}
                          alt={minister.imageAlt}
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center top"
                          className={styles.ministerImage}
                        />
                      </div>
                      <div className={styles.ministerInfo}>
                        <h3 className={styles.ministerName}>{minister.name}</h3>
                        <p className={styles.ministerRole}>{minister.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.ministersNavigation}>
                <button
                  className={styles.navButton}
                  onClick={goToPreviousMinister}
                  aria-label="Previous minister"
                >
                  <ArrowBackIosIcon />
                </button>
                <button
                  className={styles.navButton}
                  onClick={goToNextMinister}
                  aria-label="Next minister"
                >
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </>
          ) : (
            <div 
              className={styles.ministersGrid}
              style={{
                '--ministers-count': ministers.length,
              } as React.CSSProperties}
            >
              {ministers.map((minister, index) => (
                <div key={index} className={styles.minister}>
                  <div className={styles.ministerImageWrapper}>
                    <Image
                      src={minister.image}
                      alt={minister.imageAlt}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center top"
                      className={styles.ministerImage}
                    />
                  </div>
                  <div className={styles.ministerInfo}>
                    <h3 className={styles.ministerName}>{minister.name}</h3>
                    <p className={styles.ministerRole}>{minister.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      </Layout>
    </>
  );
}

