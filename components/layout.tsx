import React, { useState } from "react";
import Head from "next/head";
import MenuBar from "components/menu-bar";
import MobileDrawer from "components/mobile-drawer";
import { FacebookMessengerChat } from "components/chat-button";
import styles from "components/layout.module.scss";
import { Business } from "types";
import Footer from "components/footer";

interface Props {
  business: Business;
  children: React.ReactNode;
}

const Layout = ({ business, children }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const showDrawer = (state: boolean) => setIsDrawerOpen(state);
  const { name, description, facebookPageId, facebookPageUrl, instagramPageUrl, contactEmailAddress } = business;

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>{name}</title>
          <meta name="description" content={description} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MenuBar
          isDrawerOpen={isDrawerOpen}
          showDrawer={showDrawer}
          businessName={name}
        />

        <main>
          {children}
          <FacebookMessengerChat facebookPageId={facebookPageId} />
        </main>

        <Footer contactEmailAddress={contactEmailAddress} facebookPageUrl={facebookPageUrl} instagramPageUrl={instagramPageUrl} />
      </div>
      {isDrawerOpen && (
        <MobileDrawer isDrawerOpen={isDrawerOpen} showDrawer={showDrawer} businessName={name} />
      )}
    </>
  );
};

export default Layout;
