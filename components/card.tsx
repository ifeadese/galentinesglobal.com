import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import styles from "components/card.module.scss";
import { Service } from "types";

interface Props {
  service: Service;
  height?: string | null;
}

const Card = ({ service, height = null }: Props) => {
  const { name, featuredImage, pagePath } = service

  return (
    <div className={styles.card} style={height ? { height } : undefined}>
      <Image
        src={featuredImage.path}
        alt={featuredImage.altText}
        placeholder="blur"
        loading="lazy"
        objectFit="cover"
      />
      <Link href={pagePath} className={styles.overlay} />
      <Link href={pagePath} className={styles.title}>{name}</Link>
    </div >
  );
};

export default Card;
