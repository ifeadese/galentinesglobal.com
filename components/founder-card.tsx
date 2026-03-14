import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import Button from "components/button";
import styles from "./founder-card.module.scss";

interface FounderCardProps {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  description: string | string[];
  title?: string; // Optional heading above the name
  linkHref?: string;
  linkText?: string;
}

export default function FounderCard({
  name,
  role,
  image,
  imageAlt,
  description,
  title,
  linkHref = "/team/founder",
  linkText = "Learn More",
}: FounderCardProps) {
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <div className={styles.founderCard}>
      <div className={styles.founderImageWrapper}>
        <Image
          src={image}
          alt={imageAlt}
          layout="fill"
          objectFit="cover"
          objectPosition="center top"
          className={styles.founderImage}
        />
      </div>
      <div className={styles.founderContent}>
        {title && <span className={styles.founderTitle}>{title}</span>}
        <h2 className={styles.founderName}>{name}</h2>
        <p className={styles.founderRole}>{role}</p>
        <div className={styles.founderDescription}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.founderDescriptionParagraph}>
              {paragraph}
            </p>
          ))}
          {linkHref && (
            <div className={styles.founderButton}>
              <Link href={linkHref} legacyBehavior>
                <Button variant="secondary">{linkText}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
