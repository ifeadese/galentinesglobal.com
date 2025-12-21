import React, { ReactElement } from "react";
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
            <div>
                {contactEmailAddress && <SocialIcon url={`mailto:${contactEmailAddress}`} style={iconStyles} bgColor="lightgray" fgColor="black" />}
                {facebookPageUrl && <SocialIcon url={facebookPageUrl} style={iconStyles} bgColor="lightgray" fgColor="black" />}
                {instagramPageUrl && <SocialIcon url={instagramPageUrl} style={iconStyles} bgColor="lightgray" fgColor="black" />}
            </div>
            <p>
                Made by{" "}
                <a
                    href="https://ifedaviid.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    IfeDaviid
                </a>
            </p>
        </footer >
    );
};

export default Footer;