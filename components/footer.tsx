import React, { ReactElement } from "react";
import Image from "next/legacy/image";
import styles from "components/footer.module.scss";
import { SocialIcon } from "react-social-icons";

const YOUTUBE_STREAMS_URL = "https://www.youtube.com/@swisShile/streams";

const iconStyles = { 
  margin: '0.5rem', 
  height: 40, 
  width: 40,
  border: '1px solid rgba(220, 108, 140, 0.4)',
  borderRadius: '50%'
};

const iconColors = {
  bgColor: "rgb(255, 240, 245)",
  fgColor: "rgb(220, 108, 140)"
};

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
              <span>Every February</span>
            </div>
            <div className={styles.copyright}>
              <span>&copy; 2026 Galentines Global</span>
              <span className={styles.separator}>•</span>
              <span>All rights reserved.</span>
            </div>
            <div className={styles.socialIcons}>
                {contactEmailAddress && <SocialIcon url={`mailto:${contactEmailAddress}`} style={iconStyles} bgColor={iconColors.bgColor} fgColor={iconColors.fgColor} />}
                {facebookPageUrl && <SocialIcon url={facebookPageUrl} style={iconStyles} bgColor={iconColors.bgColor} fgColor={iconColors.fgColor} />}
                {instagramPageUrl && <SocialIcon url={instagramPageUrl} style={iconStyles} bgColor={iconColors.bgColor} fgColor={iconColors.fgColor} />}
                <SocialIcon url={YOUTUBE_STREAMS_URL} style={iconStyles} bgColor={iconColors.bgColor} fgColor={iconColors.fgColor} />
            </div>
        </footer >
    );
};

export default Footer;