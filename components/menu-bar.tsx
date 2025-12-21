import React from "react";
import { Twirl as Hamburger } from "hamburger-react";
import Link from "next/link";
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
      <Link href="/" className={styles.businessName} >
        {businessName}
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
