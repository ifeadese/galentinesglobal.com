import React from "react";
import Image from "next/legacy/image";
import styles from "components/title-hero.module.scss";

interface TitleHeroProps {
  image: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
}

const TitleHero = ({ image, imageAlt, title, subtitle }: TitleHeroProps) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImageContainer}>
        <Image 
          src={image} 
          alt={imageAlt} 
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{title}</h1>
      </div>
    </section>
  );
};

export default TitleHero;

