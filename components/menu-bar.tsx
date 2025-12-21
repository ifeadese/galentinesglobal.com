import React from "react";
import { Twirl as Hamburger } from "hamburger-react";
import Link from "next/link";
import Image from "next/legacy/image";
import styles from "components/menu-bar.module.scss";
import { pages } from "./pages";

interface MenuBarProps {
  businessName: string;
  isDrawerOpen: boolean;
  showDrawer: (state: boolean) => void;
}

const MenuBar = ({ businessName, isDrawerOpen, showDrawer }: MenuBarProps) => {
  return (
    <div className={styles.menuContainer}>
      <Link href="/" >
        <Image 
          src="/images/galentines-gradient-logo.svg" 
          alt={businessName}
          width={150}
          height={50}
          className={styles.logo}
        />
      </Link>
      <ul>
        {pages.map((page, idx) => {
          if (!page.disabled)
            return (
              <li key={idx}>
                <Link href={page.url} legacyBehavior>{page.name}</Link>
              </li>
            );
        })}
      </ul>
      <div className={styles.navIcon}>
        <Hamburger
          onToggle={() => showDrawer(true)}
          toggled={isDrawerOpen}
        />
      </div>
    </div >
  );
};

export default MenuBar;
