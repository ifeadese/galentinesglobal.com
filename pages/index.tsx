import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Button from "components/button";
import Layout from "components/layout";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "data/cms-types";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import styles from "pages/index.module.scss";

interface HomePageProps {
  cms: string;
}

const HOME_IMAGES = [
  "/images/panelists.jpeg",
  "/images/ladies.jpeg",
  "/images/support.jpeg",
  "/images/volunteer.jpeg",
];

export default function HomePage({ cms: stringifiedCMS }: HomePageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const homeContent = cms.home || {};
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HOME_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout event={event}>
      <header className={styles.heroImage}>
        <div className={styles.slideshowContainer}>
          {HOME_IMAGES.map((image, index) => (
            <div
              key={image}
              className={`${styles.slide} ${index === currentImageIndex ? styles.active : ''}`}
            >
              <Image 
                src={image} 
                alt={`Galentines Conference ${index + 1}`}
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
          <Image 
            src="/images/the-love-of-god.svg" 
            alt="The Love of God"
            width={750}
            height={226}
            className={styles.logo}
            quality={100}
            priority
            unoptimized
          />
          <p className={styles.verse}>
            &ldquo;{homeContent.verse || "And to know the love of Christ which passes knowledge; that you might be filled with all the fullness of God."}&rdquo;
            {homeContent.verseReference && ` - ${homeContent.verseReference}`}
            {!homeContent.verseReference && homeContent.verse && " - Ephesians 3:19"}
            {!homeContent.verse && !homeContent.verseReference && " - Ephesians 3:19"}
          </p>
          <div className={styles.eventInfo}>
            <span className={styles.eventInfoItem}>
              <EventIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              {homeContent.eventDate || "February 7, 2026"}
            </span>
            <span className={styles.eventInfoDivider}>•</span>
            <span className={styles.eventInfoItem}>
              <PersonIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              {homeContent.host || "Hosted by Shile Adeyoyin"}
            </span>
          </div>
          <Button
            variant="primary"
            onClick={() => window.open(homeContent.rsvpUrl || 'https://rsvpify.com/', '_blank')}
          >
            RSVP Now
          </Button>
        </div>
      </header>
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
