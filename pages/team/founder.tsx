import React from "react";
import Head from "next/head";
import Layout from "components/layout";
import { getEventFromCMS } from "helpers";
import { CMS } from "../../cms";
import { SITE_URL } from "../../constants";
import Image from "next/legacy/image";
import styles from "./founder.module.scss";

export default function FounderPage() {
  const event = getEventFromCMS(CMS);

  const fullBio = [
    "When I was eleven years old, I moved to Canada and stepped into the four walls of a church for the very first time. The service felt pleasant but nothing spectacular or out of the ordinary happened—or so it seemed.",
    "Years later, the fruit of that moment is a life anchored in Jesus, with His love burning deeply in my heart.",
    "In a similar fashion, the vision for Galentines came to me quietly one December while I was in the bathroom. It was a gentle stirring in my heart to gather women in love and from that whisper, Galentines was born.",
    "My passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. I believe the love of God produces healed and whole women, and I'm honoured to partner with Him to raise a generation of women who know how deeply loved and valued they are.",
    "By profession, I'm a lawyer. At heart, I'm a worshipper. I love cooking for my loved ones, and I almost always have a song on my lips. My prayer is that the same love of God that found me will find every heart."
  ];


  // Person structured data schema for founder
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Shile Adeyoyin",
    "jobTitle": "Founder & Steward",
    "description": "Founder and steward of Galentines Global, dedicated to empowering women through the revelation of the Father's love. A lawyer by profession and a worshipper at heart.",
    "image": `${SITE_URL}/images/founder.jpeg`,
    "url": `${SITE_URL}/team/founder`,
    "worksFor": {
      "@type": "Organization",
      "name": event.name,
      "url": SITE_URL,
    },
    "knowsAbout": ["Women's Ministry", "Christian Faith", "Worship"],
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </Head>
      <Layout 
        event={event}
        seo={{
          title: "Meet The Founder",
          description: "Learn about Shile Adeyoyin, the visionary behind Galentines Global, dedicated to empowering women through the revelation of the Father's love.",
          image: "/images/founder.jpeg",
          url: `${SITE_URL}/team/founder`,
          type: "profile",
        }}
      >
      <section className={styles.founderSection}>
        <div className={styles.container}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>Meet The Founder</h1>
            <p className={styles.contentSubtitle}>Shile Adeyoyin</p>
          </div>
          <div className={styles.founderImageWrapper}>
            <Image
              src="/images/founder.jpeg"
              alt="Shile Adeyoyin, Founder & Steward"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className={styles.founderImage}
            />
          </div>
          <div className={styles.founderContent}>
            <div className={styles.bioContent}>
              <div className={styles.bioText}>
                {fullBio.map((paragraph, index) => (
                  <p key={index} className={styles.bioParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </Layout>
    </>
  );
}


