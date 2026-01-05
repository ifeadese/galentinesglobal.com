import React, { useState } from "react";
import Head from "next/head";
import MenuBar from "components/menu-bar";
import styles from "components/layout.module.scss";
import { Event } from "types";
import Footer from "components/footer";
import SEO from "components/seo";

interface Props {
  event: Event;
  children: React.ReactNode;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    noindex?: boolean;
  };
}

const Layout = ({ event, children, seo }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const showDrawer = (state: boolean) => setIsDrawerOpen(state);
  const { name, logo, logoAlt, facebookPageUrl, instagramPageUrl, contactEmailAddress } = event;

  return (
    <div className={styles.container}>
      <SEO
        event={event}
        title={seo?.title}
        description={seo?.description}
        image={seo?.image}
        url={seo?.url}
        type={seo?.type}
        noindex={seo?.noindex}
      />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuBar
        isDrawerOpen={isDrawerOpen}
        showDrawer={showDrawer}
        siteName={name}
        logo={logo}
        logoAlt={logoAlt}
      />

      <main>
        {children}
      </main>

      <Footer 
        contactEmailAddress={contactEmailAddress} 
        logo={logo}
        logoAlt={logoAlt}
        facebookPageUrl={facebookPageUrl} 
        instagramPageUrl={instagramPageUrl} 
      />
    </div>
  );
};

export default Layout;
