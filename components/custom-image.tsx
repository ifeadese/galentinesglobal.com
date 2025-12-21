import React from "react";
import Image from "next/legacy/image";
import styles from "components/custom-image.module.scss";
import type { AppImage } from "types";
import type { ImageProps } from "next/legacy/image";

interface CustomImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  image: AppImage;
}

const CustomImage = ({ image, ...rest }: CustomImageProps) => {
  const { path, altText } = image;
  return (
    <div className={styles['custom-image']}>
      <Image
        src={path}
        alt={altText}
        placeholder="blur"
        loading="lazy"
        objectFit="cover"
        layout="fixed"
        {...rest}
      />
    </div >
  );
};

export default CustomImage;
