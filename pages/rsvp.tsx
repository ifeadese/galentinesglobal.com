import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import RSVPForm from "components/forms/rsvp-form";
import EventCountdown from "components/event-countdown";
import { getEventFromCMS, getEventDate } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import styles from "./rsvp.module.scss";

export default function RSVPPage() {
  const event = getEventFromCMS(CMS);
  const eventDate = getEventDate(CMS);

  const eventDateStr = CMS.home.eventDate;
  const isValidDate = eventDateStr && eventDateStr !== "TBD";

  return (
    <Layout 
      event={event}
      seo={{
        title: "RSVP",
        description: isValidDate 
          ? `RSVP for The Love of God Conference ${eventDateStr}. Join us for an empowering gathering of women in faith.`
          : "RSVP for The Love of God Conference. Join us for an empowering gathering of women in faith.",
        image: "/images/rsvp.png",
        url: `${SITE_URL}/rsvp`,
        type: "website",
        preloadImage: "/images/rsvp.png", // Preload hero image for faster rendering
      }}
    >
      <TitleHero
        image="/images/rsvp.png"
        imageAlt="RSVP"
        title="RSVP"
        subtitle={
          eventDate ? (
            <EventCountdown eventDate={eventDate} prefixText="To see you in" />
          ) : undefined
        }
      />

      <section className={styles.section}>
        <div className={styles.formContainer}>
          <RSVPForm description="Fill the form below to confirm your attendance. We'd love to see you there!" />
        </div>
      </section>
    </Layout>
  );
}


