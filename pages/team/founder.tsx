import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "types";
import Image from "next/legacy/image";
import styles from "./founder.module.scss";

interface FounderPageProps {
  cms: string;
}

export default function FounderPage({ cms: stringifiedCMS }: FounderPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);

  const fullBio = [
    "When I was eleven years old, I moved to Canada and stepped into the four walls of a church for the very first time. The service felt pleasant but nothing spectacular or out of the ordinary happened—or so it seemed.",
    "Years later, the fruit of that moment is a life anchored in Jesus, with His love burning deeply in my heart.",
    "In a similar fashion, the vision for Galentines came to me quietly one December while I was in the bathroom. It was a gentle stirring in my heart to gather women in love and from that whisper, Galentines was born.",
    "My passion is to see every daughter of God walk in a conscious understanding of the Father's love for her. I believe the love of God produces healed and whole women, and I'm honoured to partner with Him to raise a generation of women who know how deeply loved and valued they are.",
    "By profession, I'm a lawyer. At heart, I'm a worshipper. I love cooking for my loved ones, and I almost always have a song on my lips. My prayer is that the same love of God that found me will find every heart."
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://galentinesglobal.com";

  return (
    <Layout 
      event={event}
      seo={{
        title: "Meet The Founder",
        description: "Learn about Shile Adeyoyin, the visionary behind Galentines Global, dedicated to empowering women through the revelation of the Father's love.",
        image: "/images/founder.jpeg",
        url: `${siteUrl}/team/founder`,
        type: "profile",
      }}
    >
      <TitleHero
        image="/images/founder.jpeg"
        imageAlt="Shile Adeyoyin, Founder & Steward"
        title="Meet The Founder"
        subtitle="Shile Adeyoyin"
      />

      <section className={styles.founderSection}>
        <div className={styles.container}>
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
  );
}

export const getStaticProps = () => {
  return {
    props: {
      cms: JSON.stringify(getCMSById(process.env.EVENT_ID)),
    },
  };
};

