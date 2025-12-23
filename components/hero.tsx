import React from "react";
import Image from "next/legacy/image";
import Button from "components/button";
import styles from "components/hero.module.scss";
import { Event } from "types";
import { useRouter } from "next/router";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";

interface Props {
  event: Event;
}

const Hero = ({ event }: Props) => {
  const router = useRouter();
  const { description, marketingCopy, pagePath, heroImage } = event;
  return (
    <header className={styles["heroImage"]}>
      <div>
        <Image src={heroImage.path} alt={heroImage.altText} layout="fill" />
      </div>
      <div
        className={styles["content"]}
        style={{ opacity: "unset" }}
      >
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
        <p className={styles.verse}>&ldquo;And to know the love of Christ which passes knowledge; that you might be filled with all the fullness of God.&rdquo; - Ephesians 3:19</p>
        <div className={styles.eventInfo}>
          <span className={styles.eventInfoItem}>
            <EventIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            February 7, 2026
          </span>
          <span className={styles.eventInfoDivider}>•</span>
          <span className={styles.eventInfoItem}>
            <PersonIcon sx={{ fontSize: '1rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Hosted by Shile Adeyoyin
          </span>
        </div>
        <Button
          variant="primary"
          onClick={() => window.open('https://rsvpify.com/', '_blank')}
        >
          RSVP Now
        </Button>
      </div>
    </header>
  );
};

export default Hero;
