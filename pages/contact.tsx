import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
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
        description: "Get in touch with us. We'd love to hear from you and answer any questions you may have about The Love of God Conference.",
        image: "/images/rsvp.png",
        url: `${SITE_URL}/contact`,
        type: "website",
        preloadImage: "/images/rsvp.png",
      }}
    >
      <TitleHero
        image="/images/rsvp.png"
        imageAlt="Contact Us"
        title="Contact"
        subtitle="We're here to help"
      />

      <section className={styles.section}>
        <div className={styles.formContainer}>
          <ContactForm description="Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible." />
        </div>
      </section>
    </Layout>
  );
}
