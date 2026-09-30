import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import FounderCard from "components/founder-card";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";
import { SITE_URL } from "../constants";
import Image from "next/legacy/image";
import Button from "components/button";
import styles from "./team.module.scss";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  description?: string | string[]; // Only for founder - can be string or array of strings for multiple paragraphs
}

const teamMembers: TeamMember[] = [
  {
    name: "Shile Adeyoyin",
    role: "Founder & Steward",
    image: "/images/founder.jpeg",
    imageAlt: "Shile Adeyoyin, Founder & Steward of Galentines Global",
    description: [
      "Shile is the visionary behind Galentines Global. A lawyer by profession and a worshipper at heart.",
      "Her passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. Her prayer is that the same love of God that found her will find every heart."
    ]
  },
  {
    name: "Abigail",
    role: "Operations & Logistics Lead",
    image: "/images/abigail.png",
    imageAlt: "Abigail, Operations & Logistics Lead"
  },
  {
    name: "Fathia",
    role: "Communications & Guest Services Lead",
    image: "/images/fathia.png",
    imageAlt: "Fathia, Communications & Guest Services Lead"
  },
  {
    name: "Bukky",
    role: "Experience & Programming Lead",
    image: "/images/bukky.png",
    imageAlt: "Bukky, Experience & Programming Lead"
  }
];

export default function TeamPage() {
  const event = getEventFromCMS(CMS);


  return (
    <Layout 
      event={event}
      seo={{
        title: "Our Team",
        description: "Meet the passionate team behind Galentines Global, dedicated to empowering women through faith and community.",
        image: "/images/ladies-2.JPG",
        url: `${SITE_URL}/team`,
        type: "website",
      }}
    >
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>Our Team</h1>
            <p className={styles.contentSubtitle}>Meet the passionate team behind Galentines Global</p>
          </div>
          {/* Founder Section - Larger with description */}
          <FounderCard
            name={teamMembers[0].name}
            role={teamMembers[0].role}
            image={teamMembers[0].image}
            imageAlt={teamMembers[0].imageAlt}
            description={teamMembers[0].description || ""}
          />

          {/* Team Members Section */}
          <div className={styles.teamMembersSection}>
            <div className={styles.teamGrid}>
              {teamMembers.slice(1).map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  <div className={styles.teamImageWrapper}>
                    <Image
                      src={member.image}
                      alt={member.imageAlt}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center top"
                      className={styles.teamImage}
                    />
                  </div>
                  <div className={styles.teamInfo}>
                    <h3 className={styles.teamName}>{member.name}</h3>
                    <p className={styles.teamRole}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join the Team Section */}
      <TitleHero
        image="/images/ladies-2.JPG"
        imageAlt="Join Our Team"
        title="Join the Team"
        subtitle="Be part of a movement that transforms lives through faith, love, and sisterhood."
      >
        <Button href="/volunteer" variant="primary">
          Volunteer With Us
        </Button>
      </TitleHero>
    </Layout>
  );
}

