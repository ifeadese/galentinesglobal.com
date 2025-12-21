import React, { ReactElement } from "react";
import Image from "next/legacy/image";
import styles from "components/footer.module.scss";
import { SocialIcon } from "react-social-icons";


const iconStyles = { margin: '0.5rem', height: 40, width: 40 }

interface FooterProps {
  contactEmailAddress: string;
  facebookPageUrl?: string;
  instagramPageUrl?: string;
}

export const Footer = ({ contactEmailAddress, facebookPageUrl, instagramPageUrl }: FooterProps): ReactElement => {
    return (
        <footer className={styles.footer}>
            <Image 
                src="/images/galentines-white-logo.svg" 
                alt="Galentines"
                width={200}
                height={60}
                className={styles.logo}
            />
            <p className={styles.conference}>The Love of God Conference • February 7, 2026</p>
            <p className={styles.copyright}>&copy; 2026 Galentines. All rights reserved.</p>
            <div className={styles.socialIcons}>
                {contactEmailAddress && <SocialIcon url={`mailto:${contactEmailAddress}`} style={iconStyles} bgColor="lightgray" fgColor="black" />}
                {facebookPageUrl && <SocialIcon url={facebookPageUrl} style={iconStyles} bgColor="lightgray" fgColor="black" />}
                {instagramPageUrl && <SocialIcon url={instagramPageUrl} style={iconStyles} bgColor="lightgray" fgColor="black" />}
            </div>
        </footer >
    );
};

export default Footer;