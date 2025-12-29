import React from "react";
import Image from "next/legacy/image";
import styles from "components/title-hero.module.scss";

interface TitleHeroProps {
  image: string;
  imageAlt: string;
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

const TitleHero = ({ image, imageAlt, title, subtitle, children }: TitleHeroProps) => {
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
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
        {children && <div className={styles.heroChildren}>{children}</div>}
      </div>
    </section>
  );
};

export default TitleHero;

