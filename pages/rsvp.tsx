import React, { useState, useEffect } from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import ContactForm from "components/contact-form";
import EventCountdown from "components/event-countdown";
import { getCMSById, getEventFromCMS, getEventDate } from "helpers";
import { CMSContent } from "types";
import type { GetServerSideProps } from "next";
import styles from "./rsvp.module.scss";

interface RSVPPageProps {
  cms: string;
}

export default function RSVPPage({ cms }: RSVPPageProps) {
  const cmsContent: CMSContent = JSON.parse(cms);
  const event = getEventFromCMS(cmsContent);
  const eventDate = getEventDate(cmsContent);
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // null = loading

  // Check Google connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          setIsConnected(data.connected || false);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Failed to check connection status:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <Layout event={event}>
      <TitleHero
        image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
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
          {isConnected === false && (
            <div className={styles.warningBanner}>
              <p className={styles.warningText}>
                <strong>Form submissions are currently unavailable.</strong> The Google account connection is required to process RSVP submissions. Please check back soon or contact the event organizer.
              </p>
            </div>
          )}
          <ContactForm
            description="Fill the form below to confirm your attendance. We'd love to see you there!"
            disabled={isConnected === false}
            fields={[
              { 
                name: "fullName", 
                label: "Full Name", 
                type: "text", 
                required: true, 
                placeholder: "John Doe" 
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
                placeholder: "(555) 123-4567" 
              },
            ]}
            submitButtonText="Confirm RSVP"
          />
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      cms: JSON.stringify(getCMSById(process.env.EVENT_ID)),
    },
  };
};

