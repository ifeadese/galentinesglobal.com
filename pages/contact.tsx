import React from "react";
import Layout from "components/layout";
import ContactForm from "components/forms/contact-form";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import styles from "./contact.module.scss";

export default function ContactPage() {
  const event = getEventFromCMS(CMS);

  return (
    <Layout 
      event={event}
      seo={{
        title: "Contact",
        description: "Have a question, feedback or testimony? Get in touch with us. We'd love to hear from you.",
        image: "/images/rsvp.png",
        url: `${SITE_URL}/contact`,
        type: "website",
        preloadImage: "/images/rsvp.png",
      }}
    >
      <section className={styles.section}>
        <div className={styles.contentHeader}>
          <h1 className={styles.contentTitle}>Contact</h1>
          <p className={styles.contentSubtitle}>We&apos;d love to hear from you</p>
        </div>
        <div className={styles.formContainer}>
          <ContactForm description="Have a question, feedback or testimony? Fill the form below. We would love to hear from you." />
        </div>
      </section>
    </Layout>
  );
}
