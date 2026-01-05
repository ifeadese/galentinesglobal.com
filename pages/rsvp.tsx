import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import ContactForm from "components/contact-form";
import EventCountdown from "components/event-countdown";
import { getCMSById, getEventFromCMS, getEventDate } from "helpers";
import { CMSContent } from "types";
import styles from "./rsvp.module.scss";

interface RSVPPageProps {
  cms: string;
}

export default function RSVPPage({ cms }: RSVPPageProps) {
  const cmsContent: CMSContent = JSON.parse(cms);
  const event = getEventFromCMS(cmsContent);
  const eventDate = getEventDate(cmsContent);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://galentinesglobal.com";
  const eventDateStr = cmsContent.home.eventDate;
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
        url: `${siteUrl}/rsvp`,
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
          <ContactForm
            description="Fill the form below to confirm your attendance. We'd love to see you there!"
            fields={[
              { 
                name: "fullName", 
                label: "Full Name", 
                type: "text", 
                required: true, 
                placeholder: "Jane Doe" 
              },
              { 
                name: "email", 
                label: "Email Address", 
                type: "email", 
                required: true, 
                placeholder: "your.email@example.com" 
              },
              { 
                name: "phone", 
                label: "Phone Number", 
                type: "tel", 
                required: true, 
                placeholder: "(123) 456-7890" 
              },
              {
                name: "shuttleInterest",
                label: "I'm interested in shuttle service from Toronto to Ottawa",
                type: "select",
                required: true,
                options: [
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" }
                ]
              }
            ]}
            submitButtonText="Submit"
          />
        </div>
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

