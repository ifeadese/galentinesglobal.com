import React, { ReactElement } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import styles from "components/footer.module.scss";
import { SocialIcon } from "react-social-icons";


const iconStyles = { 
  margin: '0.5rem', 
  height: 40, 
  width: 40,
  border: '1px solid rgba(220, 108, 140, 0.4)',
  borderRadius: '50%'
}

interface FooterProps {
  contactEmailAddress: string;
  logo?: string;
  logoAlt?: string;
  facebookPageUrl?: string;
  instagramPageUrl?: string;
}

export const Footer = ({ contactEmailAddress, logo, logoAlt, facebookPageUrl, instagramPageUrl }: FooterProps): ReactElement => {
    return (
        <footer className={styles.footer}>
            {logo && (
              <div style={{ marginBottom: '1rem' }}>
                <Image 
                  src={logo} 
                  alt={logoAlt || "Logo"}
                  width={200}
                  height={60}
                  className={styles.logo}
                />
              </div>
            )}
            
            <div className={styles.conference}>
              <span>The Love of God Conference</span>
              <span className={styles.separator}>•</span>
              <span>February 7, 2026</span>
            </div>
            <div className={styles.copyright}>
              <span>&copy; 2026 Galentines Global</span>
              <span className={styles.separator}>•</span>
              <span>All rights reserved.</span>
              <span className={styles.separator}>•</span>
              <Link href="/privacy" legacyBehavior>
                <a className={styles.privacyLink}>Privacy Policy</a>
              </Link>
            </div>
            <div className={styles.socialIcons}>
                {contactEmailAddress && <SocialIcon url={`mailto:${contactEmailAddress}`} style={iconStyles} bgColor="rgb(255, 240, 245)" fgColor="rgb(220, 108, 140)" />}
                {facebookPageUrl && <SocialIcon url={facebookPageUrl} style={iconStyles} bgColor="rgb(255, 240, 245)" fgColor="rgb(220, 108, 140)" />}
                {instagramPageUrl && <SocialIcon url={instagramPageUrl} style={iconStyles} bgColor="rgb(255, 240, 245)" fgColor="rgb(220, 108, 140)" />}
            </div>
        </footer >
    );
};

export default Footer;