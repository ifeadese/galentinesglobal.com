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
        description: "Have a question, feedback or testimony? Get in touch with us. We'd love to hear from you.",
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
        subtitle="We'd love to hear from you"
      />

      <section className={styles.section}>
        <div className={styles.formContainer}>
          <ContactForm description="Have a question, feedback or testimony? Fill the form below. We would love to hear from you." />
        </div>
      </section>
    </Layout>
  );
}
