import React, { ReactElement } from "react";
import styles from "components/footer.module.scss";
import { SocialIcon } from "react-social-icons";


const iconStyles = { margin: '0.5rem', height: 40, width: 40 }

export const Footer = (): ReactElement => {
    return (
        <footer className={styles.footer}>
            <div>
                <SocialIcon url="mailto:ayoolumide@yahoo.ca" style={iconStyles} bgColor="lightgray" fgColor="black" />
                <SocialIcon url="https://https://www.instagram.com/philsvisionphotography" style={iconStyles} bgColor="lightgray" fgColor="black" />
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