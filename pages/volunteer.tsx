import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import VolunteerForm from "components/forms/volunteer-form";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import styles from "./volunteer.module.scss";

export default function VolunteerPage() {
  const event = getEventFromCMS(CMS);

  return (
    <Layout 
      event={event}
      seo={{
        title: "Volunteer",
        description: "Join us as a volunteer for The Love of God Conference. Your service helps make this event a blessing for all attendees.",
        image: "/images/rsvp.png",
        url: `${SITE_URL}/volunteer`,
        type: "website",
        preloadImage: "/images/rsvp.png",
      }}
    >
      <TitleHero
        image="/images/rsvp.png"
        imageAlt="Volunteer"
        title="Join the team"
        subtitle="Our volunteers help us make an impact"
      />

      <section className={styles.section}>
        <div className={styles.formContainer}>
          <VolunteerForm description="We could always use the help of passionate volunteers in making our next edition of Galentines a success! Fill out the form below to express your interest." />
        </div>
      </section>
    </Layout>
  );
}
