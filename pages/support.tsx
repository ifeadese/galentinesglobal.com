import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "types";
import styles from "./support.module.scss";

interface SupportPageProps {
  cms: string;
}

export default function SupportPage({ cms: stringifiedCMS }: SupportPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const supportContent = cms.support;

  const handleCardClick = (card: any) => {
    if (card.openInNewTab) {
      window.open(card.link, '_blank');
    } else {
      window.location.href = card.link;
    }
  };

  return (
    <Layout event={event}>
      <TitleHero
        image={supportContent.heroImage || "/images/support.jpeg"}
        imageAlt={supportContent.heroImageAlt || "Support Galentines"}
        title={supportContent.heroTitle || "To the Willing Hearted"}
        subtitle={supportContent.heroSubtitle || "Work With Us"}
      />

      {/* Content Section */}
      <section style={{ 
        padding: '2rem 5%',
        background: `linear-gradient(180deg, rgba(255, 192, 203, 0.1) 0%, transparent 50%, rgba(255, 192, 203, 0.05) 100%)`
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto 2rem', textAlign: 'center' }}>
          {supportContent.paragraphs?.map((paragraph, index) => (
            <p key={index} style={{ 
              fontSize: '0.875rem', 
              marginBottom: '1rem', 
              lineHeight: '1.75rem' 
            }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.supportCards}>
          {supportContent.cards?.map((card: any, index: number) => (
            <div 
              key={index}
              className={styles.featureCard}
              style={{
                backgroundImage: `url('${card.image}')`
              }}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.overlay}></div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
            </div>
          ))}
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
