import React, { useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import styles from "components/menu-bar.module.scss";
import { pages } from "./pages";

interface MenuBarProps {
  siteName: string;
  logo?: string;
  logoAlt?: string;
  isDrawerOpen: boolean;
  showDrawer: (state: boolean) => void;
}

const MenuBar = ({ siteName, logo, logoAlt, isDrawerOpen, showDrawer }: MenuBarProps) => {
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      showDrawer(false);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, showDrawer]);

  const handleToggle = () => {
    showDrawer(!isDrawerOpen);
  };

  return (
    <>
      <div className={styles.menuContainer}>
        {logo && (
          <Link href="/" >
            <Image 
              src={logo} 
              alt={logoAlt || siteName}
              width={150}
              height={50}
              className={styles.logo}
            />
          </Link>
        )}
        <ul className={styles.desktopMenu}>
          {pages.map((page, idx) => {
            if (!page.disabled) {
              if (page.isButton) {
                return (
                  <li key={idx}>
                    <Link href={page.url} legacyBehavior>
                      <a className={styles.rsvpButton}>{page.name}</a>
                    </Link>
                  </li>
                );
              }
              return (
                <li key={idx}>
                  <Link href={page.url} legacyBehavior>{page.name}</Link>
                </li>
              );
            }
          })}
        </ul>
        <div className={styles.navIcon}>
          <Hamburger
            onToggle={handleToggle}
            toggled={isDrawerOpen}
          />
        </div>
      </div>
      {isDrawerOpen && (
        <div className={styles.overlay} onClick={() => showDrawer(false)}>
          <button 
            className={styles.closeButton}
            onClick={() => showDrawer(false)}
            aria-label="Close menu"
          >
            <CloseIcon sx={{ fontSize: '2rem' }} />
          </button>
          <nav className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <ul>
              {pages.map((page, idx) => {
                if (!page.disabled) {
                  if (page.isButton) {
                    return (
                      <li key={idx}>
                        <Link 
                          href={page.url} 
                          className={styles.mobileRsvpButton}
                          onClick={() => showDrawer(false)}
                        >
                          {page.name}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={idx}>
                      <Link 
                        href={page.url} 
                        className={styles.mobileMenuItem}
                        onClick={() => showDrawer(false)}
                      >
                        {page.name}
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default MenuBar;
