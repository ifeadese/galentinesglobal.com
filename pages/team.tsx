import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "types";
import Image from "next/legacy/image";
import Link from "next/link";
import Button from "components/button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import styles from "./team.module.scss";

interface TeamPageProps {
  cms: string;
}

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
      "My passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. My prayer is that the same love of God that found me will find every heart."
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

export default function TeamPage({ cms: stringifiedCMS }: TeamPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);

  return (
    <Layout event={event}>
      <TitleHero
        image="/images/ladies-2.JPG"
        imageAlt="Our Team"
        title="Our Team"
        subtitle="Meet the passionate team behind Galentines Global"
      />

      <section className={styles.teamSection}>
        <div className={styles.container}>
          {/* Founder Section - Larger with description */}
          <div className={styles.founderCard}>
            <div className={styles.founderImageWrapper}>
              <Image
                src={teamMembers[0].image}
                alt={teamMembers[0].imageAlt}
                layout="fill"
                objectFit="cover"
                objectPosition="center top"
                className={styles.founderImage}
              />
            </div>
            <div className={styles.founderContent}>
              <h2 className={styles.founderName}>{teamMembers[0].name}</h2>
              <p className={styles.founderRole}>{teamMembers[0].role}</p>
              {teamMembers[0].description && (
                <div className={styles.founderDescription}>
                  {Array.isArray(teamMembers[0].description) ? (
                    teamMembers[0].description.map((paragraph, index) => (
                      <p key={index} className={styles.founderDescriptionParagraph}>
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className={styles.founderDescriptionParagraph}>
                      {teamMembers[0].description}
                    </p>
                  )}
                  <div className={styles.founderButton}>
                    <Link href="/team/founder" legacyBehavior>
                      <Button variant="secondary">Learn More</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

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
      <section className={styles.joinSection}>
        <div className={styles.joinContainer}>
          <h2 className={styles.joinTitle}>Join the Team</h2>
          <p className={styles.joinDescription}>
            We&apos;re always looking for passionate individuals to join our mission of empowering women through faith and community.
          </p>
          <a href="https://galentines.fillout.com/volunteers" target="_blank" rel="noopener noreferrer" className={styles.joinLink}>
            <Button variant="primary">
              Volunteer With Us
              <OpenInNewIcon sx={{ fontSize: '1rem', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </Button>
          </a>
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

