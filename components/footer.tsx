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
            <div style={{ marginBottom: '1rem' }}>
<Image 
                src="/images/galentines-gradient-logo.svg" 
                alt="Galentines"
                width={200}
                height={60}
                className={styles.logo}
            />
            </div>
            
            <div className={styles.conference}>
              <span>The Love of God Conference</span>
              <span className={styles.separator}>•</span>
              <span>February 7, 2026</span>
            </div>
            <div className={styles.copyright}>
              <span>&copy; 2026 Galentines</span>
              <span className={styles.separator}>•</span>
              <span>All rights reserved.</span>
            </div>
            <div className={styles.socialIcons}>
                {contactEmailAddress && <SocialIcon url={`mailto:${contactEmailAddress}`} style={iconStyles} bgColor="lightgray" fgColor="black" />}
                {facebookPageUrl && <SocialIcon url={facebookPageUrl} style={iconStyles} bgColor="lightgray" fgColor="black" />}
                {instagramPageUrl && <SocialIcon url={instagramPageUrl} style={iconStyles} bgColor="lightgray" fgColor="black" />}
            </div>
        </footer >
    );
};

export default Footer;