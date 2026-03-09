import React from "react";
import Layout from "components/layout";
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
        preloadImage: "/images/rsvp.png",
      }}
    >
      <section className={styles.section}>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>RSVP</h1>
          {eventDate && (
            <div className={styles.contentSubtitle}>
              <EventCountdown eventDate={eventDate} prefixText="To see you in" />
            </div>
          )}
        </div>
        <div className={styles.formContainer}>
          <RSVPForm 
            description="RSVP registration is currently closed. The form below is disabled." 
            disabled={true}
          />
        </div>
      </section>
    </Layout>
  );
}


