import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import FeedbackForm from "components/forms/feedback-form";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import styles from "./feedback.module.scss";

export default function FeedbackPage() {
  const event = getEventFromCMS(CMS);

  return (
    <Layout 
      event={event}
      seo={{
        title: "Feedback",
        description: "Share your feedback about The Love of God Conference. Your thoughts help us improve and serve you better.",
        image: "/images/rsvp.png",
        url: `${SITE_URL}/feedback`,
        type: "website",
        preloadImage: "/images/rsvp.png",
      }}
    >
      <TitleHero
        image="/images/rsvp.png"
        imageAlt="Feedback"
        title="Feedback"
        subtitle="We'd love to hear from you"
      />

      <section className={styles.section}>
        <div className={styles.formContainer}>
          <FeedbackForm description="Thank you for attending The Love of God Conference! Your feedback is valuable and helps us improve future events. Please share your thoughts below." />
        </div>
      </section>
    </Layout>
  );
}
