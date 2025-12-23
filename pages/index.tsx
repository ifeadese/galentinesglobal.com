import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Button from "components/button";
import Layout from "components/layout";
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
  const slideshowImages = homeContent.slideshowImages!;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  return (
    <Layout event={event}>
      <header className={styles.heroImage}>
        <div className={styles.slideshowContainer}>
          {slideshowImages.map((image, index) => (
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
          <p className={styles.verse}>
            &ldquo;{homeContent.verse}&rdquo;
          </p>
          <div className={styles.eventInfo}>
            <span className={styles.eventInfoItem}>
              <EventIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              {homeContent.eventDate}
            </span>
            <span className={styles.eventInfoDivider}>•</span>
            <span className={styles.eventInfoItem}>
              <PersonIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              {homeContent.host}
            </span>
          </div>
          <Button
            variant="primary"
            onClick={() => window.open(homeContent.rsvpUrl!, '_blank')}
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
